import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { fetchJobs, overrideJobData } from "../services/api";
import { fetchStats } from "../services/statsApi";
import { indexedDBService } from "../services/indexedDBService";
import type { Job } from "../hooks/useJobs";

// Re-export types from useJobs or define them here if moving completely
interface ProgramStudi {
  value: string;
  title: string;
}

interface Filters {
  programStudi: string;
  jabatan: string;
  provinsi: string;
  kota: string;
  perusahaan: string;
  jenjang: string;
}

interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

interface FetchProgress {
  current: number;
  total: number;
  isFetchingAll: boolean;
  isBackgroundFetching?: boolean;
}

interface Stats {
  "Jumlah Lowongan": number;
  "Jumlah Pendaftar Magang": number;
  "Jumlah Perusahaan": number;
  "Jumlah Peserta Magang": number;
}

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: Filters;
  stats: Stats | null;
  statsLoading: boolean;
  availableCities: string[];
  availableCompanies: string[];
  availableJenjang: string[];
  updateFilters: (newFilters: Filters) => void;
  changePage: (page: number) => void;
  fetchProgress: FetchProgress;
  getJobDetail: (id: string) => Job | undefined;
  isDataLoaded: () => boolean;
  allJobs: Job[];
  refetch: () => void;
  refreshData: () => void;
  lastFetchTime: number | null;
  manualSync: () => void;
  failedPages: number[];
  retryFailedFetch: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Helper function untuk mendapatkan nama provinsi dari kode
const getProvinsiName = (code: string): string => {
  const provinsiMap: { [key: string]: string } = {
    "11": "Aceh",
    "12": "Sumatera Utara",
    "13": "Sumatera Barat",
    "14": "Riau",
    "15": "Jambi",
    "16": "Sumatera Selatan",
    "17": "Bengkulu",
    "18": "Lampung",
    "19": "Kepulauan Bangka Belitung",
    "21": "Kepulauan Riau",
    "31": "DKI Jakarta",
    "32": "Jawa Barat",
    "33": "Jawa Tengah",
    "34": "DI Yogyakarta",
    "35": "Jawa Timur",
    "36": "Banten",
    "51": "Bali",
    "52": "Nusa Tenggara Barat",
    "53": "Nusa Tenggara Timur",
    "61": "Kalimantan Barat",
    "62": "Kalimantan Tengah",
    "63": "Kalimantan Selatan",
    "64": "Kalimantan Timur",
    "65": "Kalimantan Utara",
    "71": "Sulawesi Utara",
    "72": "Sulawesi Tengah",
    "73": "Sulawesi Selatan",
    "74": "Sulawesi Tenggara",
    "75": "Gorontalo",
    "76": "Sulawesi Barat",
    "81": "Maluku",
    "82": "Maluku Utara",
    "91": "Papua",
    "92": "Papua Barat",
    "93": "Papua Selatan",
    "94": "Papua Tengah",
    "95": "Papua Pegunungan",
    "96": "Papua Barat Daya",
  };
  return provinsiMap[code] || "";
};

export const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const savedPage = sessionStorage.getItem('magang_currentPage');
      return savedPage ? parseInt(savedPage) : 1;
    } catch {
      return 1;
    }
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [availableJenjang, setAvailableJenjang] = useState<string[]>([]);

  const [itemsPerPage] = useState(21);

  // NEW: State untuk background fetching
  const [fetchProgress, setFetchProgress] = useState<FetchProgress>({
    current: 0,
    total: 0,
    isFetchingAll: false,
    isBackgroundFetching: false,
  });

  // NEW: State untuk cache tracking
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>(() => {
    try {
      const savedFilters = sessionStorage.getItem('magang_filters');
      return savedFilters ? JSON.parse(savedFilters) : {
        programStudi: "",
        jabatan: "",
        provinsi: "91",
        kota: "",
        perusahaan: "",
        jenjang: "",
      };
    } catch {
      return {
        programStudi: "",
        jabatan: "",
        provinsi: "91",
        kota: "",
        perusahaan: "",
        jenjang: "",
      };
    }
  });

  // Save filters and pagination to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem('magang_filters', JSON.stringify(filters));
      sessionStorage.setItem('magang_currentPage', currentPage.toString());
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [filters, currentPage]);

  // NEW: Ref untuk cancel fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fungsi untuk cancel fetch yang sedang berjalan
  const cancelCurrentFetch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      console.log("🛑 Fetch dibatalkan");
    }
  };

  // Fungsi untuk extract kota-kota unik berdasarkan provinsi yang dipilih
  const extractCitiesFromJobs = (
    jobs: Job[],
    currentFilters: Filters
  ): string[] => {
    const cities = new Set<string>();
    const currentProvinsiName = getProvinsiName(currentFilters.provinsi);

    jobs.forEach((job) => {
      // Filter berdasarkan provinsi yang dipilih
      const matchesProvinsi =
        job.perusahaan.nama_provinsi &&
        job.perusahaan.nama_provinsi
          .toLowerCase()
          .includes(currentProvinsiName.toLowerCase());

      if (matchesProvinsi && job.perusahaan.nama_kabupaten) {
        cities.add(job.perusahaan.nama_kabupaten);
      }
    });

    return Array.from(cities).sort();
  };

  // Fungsi untuk extract perusahaan unik berdasarkan provinsi dan kota yang dipilih
  const extractCompaniesFromJobs = (
    jobs: Job[],
    currentFilters: Filters
  ): string[] => {
    const companies = new Set<string>();
    const currentProvinsiName = getProvinsiName(currentFilters.provinsi);

    jobs.forEach((job) => {
      // Filter berdasarkan provinsi yang dipilih
      const matchesProvinsi =
        job.perusahaan.nama_provinsi &&
        job.perusahaan.nama_provinsi
          .toLowerCase()
          .includes(currentProvinsiName.toLowerCase());

      // Filter berdasarkan kota jika ada yang dipilih
      const matchesKota =
        !currentFilters.kota ||
        (job.perusahaan.nama_kabupaten &&
          job.perusahaan.nama_kabupaten
            .toLowerCase()
            .includes(currentFilters.kota.toLowerCase()));

      if (matchesProvinsi && matchesKota && job.perusahaan.nama_perusahaan) {
        companies.add(job.perusahaan.nama_perusahaan);
      }
    });

    return Array.from(companies).sort();
  };

  // Fungsi untuk extract jenjang unik berdasarkan provinsi yang dipilih
  const extractJenjangFromJobs = (
    jobs: Job[],
    currentFilters: Filters
  ): string[] => {
    const jenjangSet = new Set<string>();
    const currentProvinsiName = getProvinsiName(currentFilters.provinsi);

    jobs.forEach((job) => {
      // Filter berdasarkan provinsi yang dipilih
      const matchesProvinsi =
        job.perusahaan.nama_provinsi &&
        job.perusahaan.nama_provinsi
          .toLowerCase()
          .includes(currentProvinsiName.toLowerCase());

      if (matchesProvinsi && job.jenjang) {
        try {
          const jenjangList = typeof job.jenjang === 'string' ? JSON.parse(job.jenjang) : job.jenjang;
          if (Array.isArray(jenjangList)) {
            jenjangList.forEach((j: string) => jenjangSet.add(j));
          }
        } catch {
          // Skip invalid jenjang data
        }
      }
    });

    return Array.from(jenjangSet).sort();
  };

  // Update available cities dan companies ketika allJobs berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      const cities = extractCitiesFromJobs(allJobs, filters);
      const companies = extractCompaniesFromJobs(allJobs, filters);
      const jenjangList = extractJenjangFromJobs(allJobs, filters);

      setAvailableCities(cities);
      setAvailableCompanies(companies);
      setAvailableJenjang(jenjangList);

      // Reset kota jika kota yang dipilih tidak ada di list baru
      if (filters.kota && !cities.includes(filters.kota)) {
        setFilters((prev) => ({ ...prev, kota: "" }));
      }

      // Reset perusahaan jika perusahaan yang dipilih tidak ada di list baru
      if (filters.perusahaan && !companies.includes(filters.perusahaan)) {
        setFilters((prev) => ({ ...prev, perusahaan: "" }));
      }

      // Reset jenjang jika jenjang yang dipilih tidak ada di list baru
      if (filters.jenjang && !jenjangList.includes(filters.jenjang)) {
        setFilters((prev) => ({ ...prev, jenjang: "" }));
      }
    }
  }, [allJobs, filters]);

  // Update available companies ketika provinsi atau kota berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      const companies = extractCompaniesFromJobs(allJobs, filters);
      setAvailableCompanies(companies);

      // Reset perusahaan jika perusahaan yang dipilih tidak ada di list baru
      if (filters.perusahaan && !companies.includes(filters.perusahaan)) {
        setFilters((prev) => ({ ...prev, perusahaan: "" }));
      }
    }
  }, [filters.provinsi, filters.kota, allJobs]);

  // Fungsi untuk fetch stats
  const fetchAllStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({
        "Jumlah Lowongan": 1450,
        "Jumlah Pendaftar Magang": 157837,
        "Jumlah Perusahaan": 1003,
        "Jumlah Peserta Magang": 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // NEW: State untuk tracking halaman yang gagal fetch
  const [failedPages, setFailedPages] = useState<number[]>([]);

  // NEW: Fungsi untuk fetch semua data di background dengan IndexedDB caching
  const fetchAllJobsInBackground = async (provinceCode: string = "ALL", forceRefresh: boolean = false) => {
    cancelCurrentFetch(); // Cancel fetch sebelumnya

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setFailedPages([]); // Reset failed pages

    try {
      // Check cache first jika bukan force refresh
      if (!forceRefresh) {
        const cachedData = await indexedDBService.getProvinceData(provinceCode);

        if (cachedData.data && cachedData.data.length > 0) {
          console.log(`📦 Loading ${cachedData.data.length} jobs from cache for province ${getProvinsiName(provinceCode)}`);
          // Apply override to cached data as well
          setAllJobs(cachedData.data.map(overrideJobData));
          setLastFetchTime(cachedData.timestamp);
          setLoading(false);
          return;
        }
      }

      setFetchProgress(prev => ({
        ...prev,
        isBackgroundFetching: true,
        isFetchingAll: true
      }));

      // Set loading hanya untuk initial, tidak blocking
      if (allJobs.length === 0) {
        setLoading(true);
      }

      const firstPageData = await fetchJobs(1, 20, provinceCode);
      const totalPages = firstPageData.meta.pagination.last_page;

      // Check jika fetch dibatalkan
      if (abortController.signal.aborted) return;

      // Set data halaman pertama langsung
      setAllJobs(firstPageData.data);
      setFetchProgress({
        current: 1,
        total: totalPages,
        isFetchingAll: true,
        isBackgroundFetching: true
      });

      let allJobsData: Job[] = [...firstPageData.data];
      const currentFailedPages: number[] = [];

      // Fetch halaman berikutnya di background
      for (let page = 2; page <= totalPages; page++) {
        // Check jika fetch dibatalkan sebelum setiap request
        if (abortController.signal.aborted) return;

        try {
          const pageData = await fetchJobs(page, 20, provinceCode);

          // Check jika fetch dibatalkan setelah request
          if (abortController.signal.aborted) return;

          allJobsData = [...allJobsData, ...pageData.data];

          // Update state dengan data baru
          setAllJobs(allJobsData);
          setFetchProgress({
            current: page,
            total: totalPages,
            isFetchingAll: true,
            isBackgroundFetching: true
          });
        } catch (err) {
          console.warn(`⚠️ Gagal fetch halaman ${page}:`, err);
          currentFailedPages.push(page);
          setFailedPages(prev => [...prev, page]);
          // Delay lebih lama jika error (backoff sederhana)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Small delay untuk tidak overload server
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Save to IndexedDB (save apa yang kita punya)
      await indexedDBService.saveProvinceData(provinceCode, allJobsData, totalPages);
      setLastFetchTime(Date.now());

      if (currentFailedPages.length > 0) {
        setError(`Gagal mengambil ${currentFailedPages.length} halaman data. Koneksi mungkin tidak stabil.`);
      } else {
        setError(null);
        console.log(`✅ Data provinsi ${getProvinsiName(provinceCode)} selesai di-load dan disimpan: ${allJobsData.length} lowongan`);
      }

    } catch (err: any) {
      // AbortError adalah expected behavior ketika cancel
      if (err.name === 'AbortError') {
        console.log('Fetch dibatalkan untuk provinsi baru');
        return;
      }

      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("Error fetching jobs:", err);
    } finally {
      if (!abortController.signal.aborted) {
        setFetchProgress({
          current: 0,
          total: 0,
          isFetchingAll: false,
          isBackgroundFetching: false
        });
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  };

  // NEW: Fungsi untuk retry halaman yang gagal
  const retryFailedFetch = async () => {
    if (failedPages.length === 0) return;

    const pagesToRetry = [...failedPages];
    setFailedPages([]); // Reset sementara
    setError(null);

    setFetchProgress({
      current: 0,
      total: pagesToRetry.length,
      isBackgroundFetching: true,
      isFetchingAll: true
    });

    let currentAllJobs = [...allJobs];
    const stillFailedPages: number[] = [];
    let successCount = 0;

    for (const page of pagesToRetry) {
      try {
        const pageData = await fetchJobs(page, 20, filters.provinsi);
        currentAllJobs = [...currentAllJobs, ...pageData.data];
        setAllJobs(currentAllJobs);
        successCount++;
        setFetchProgress(prev => ({
          ...prev,
          current: successCount
        }));
      } catch (err) {
        console.warn(`⚠️ Retry gagal untuk halaman ${page}:`, err);
        stillFailedPages.push(page);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setFailedPages(stillFailedPages);

    if (stillFailedPages.length > 0) {
      setError(`Berhasil memulihkan ${successCount} halaman. Masih ada ${stillFailedPages.length} halaman gagal.`);
    } else {
      setError(null);
      // Update cache dengan data lengkap
      await indexedDBService.saveProvinceData(filters.provinsi, currentAllJobs, Math.ceil(currentAllJobs.length / 20));
    }

    setFetchProgress(prev => ({
      ...prev,
      isBackgroundFetching: false,
      isFetchingAll: false
    }));
  };

  const applyFilters = (
    jobs: Job[] = allJobs,
    currentFilters: Filters = filters
  ) => {
    let filtered = jobs;

    // Filter Program Studi
    if (currentFilters.programStudi) {
      filtered = filtered.filter((job) => {
        try {
          const programStudiList: ProgramStudi[] = JSON.parse(
            job.program_studi || "[]"
          );
          return programStudiList.some((ps) =>
            ps.title
              .toLowerCase()
              .includes(currentFilters.programStudi.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }

    // Filter Jabatan
    if (currentFilters.jabatan) {
      filtered = filtered.filter((job) =>
        job.posisi.toLowerCase().includes(currentFilters.jabatan.toLowerCase())
      );
    }

    // Filter Kota
    if (currentFilters.kota) {
      filtered = filtered.filter((job) =>
        job.perusahaan.nama_kabupaten
          .toLowerCase()
          .includes(currentFilters.kota.toLowerCase())
      );
    }

    // Filter Perusahaan
    if (currentFilters.perusahaan) {
      filtered = filtered.filter((job) =>
        job.perusahaan.nama_perusahaan
          .toLowerCase()
          .includes(currentFilters.perusahaan.toLowerCase())
      );
    }

    // Filter Jenjang
    if (currentFilters.jenjang) {
      filtered = filtered.filter((job) => {
        try {
          const jenjangList = typeof job.jenjang === 'string' ? JSON.parse(job.jenjang) : job.jenjang;
          if (Array.isArray(jenjangList)) {
            return jenjangList.some((j: string) =>
              j.toLowerCase().includes(currentFilters.jenjang.toLowerCase())
            );
          }
          return false;
        } catch {
          return false;
        }
      });
    }

    setFilteredJobs(filtered);
  };

  // Fungsi yang sederhana - langsung return job tanpa async
  const getJobDetail = (id: string): Job | undefined => {
    return allJobs.find((job) => job.id_posisi === id);
  };

  // Fungsi untuk check apakah data sudah loaded
  const isDataLoaded = () => {
    return allJobs.length > 0;
  };

  // Fungsi untuk clear state
  const clearStateAndReset = () => {
    cancelCurrentFetch();
    setAllJobs([]);
    setFilteredJobs([]);
    setCurrentPage(1);
    setAvailableCities([]);
    setAvailableCompanies([]);
    console.log("🔄 State reset");
  };

  // Load stats saat component mount
  useEffect(() => {
    fetchAllStats();
  }, []);

  // Fetch data ketika provinsi berubah (dengan cancel previous dan debounce)
  useEffect(() => {
    // Reset state immediately when province changes
    setAllJobs([]);
    setFilteredJobs([]);
    setLoading(true);
    setError(null);
    setFetchProgress({
      current: 0,
      total: 0,
      isFetchingAll: false,
      isBackgroundFetching: false,
    });

    // Debounce untuk menghindari multiple rapid changes
    const timeoutId = setTimeout(() => {
      fetchAllJobsInBackground(filters.provinsi);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters.provinsi]);

  // Apply filters ketika filter berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      applyFilters();
    }
  }, [
    allJobs,
    filters.programStudi,
    filters.jabatan,
    filters.kota,
    filters.perusahaan,
    filters.jenjang,
  ]);

  // Reset pagination setiap kali filter berubah
  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const pagination: Pagination = {
    current_page: currentPage,
    last_page: totalPages,
    total: filteredJobs.length,
    from: indexOfFirstItem + 1,
    to: Math.min(indexOfLastItem, filteredJobs.length),
  };

  // Fungsi untuk manual refresh data
  const refreshData = () => {
    clearStateAndReset();
    fetchAllJobsInBackground(filters.provinsi);
  };

  // Cleanup pada unmount
  useEffect(() => {
    // NOTE: We do NOT cancel/abort fetching on unmount here
    // because we want background fetching to persist across page navigations (which unmount components but not the Provider if placed high enough)
    // Using a ref to track mount status if needed, but for now we let it run.
    return () => {
      // cancelCurrentFetch(); // <--- REMOVE THIS to allow persistence
    };
  }, []);

  const value = {
    jobs: currentJobs,
    loading: loading && allJobs.length === 0,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
    availableCities,
    availableCompanies,
    availableJenjang,
    updateFilters,
    changePage,
    fetchProgress,
    getJobDetail,
    isDataLoaded,
    allJobs,
    refetch: () => fetchAllJobsInBackground(filters.provinsi),
    refreshData,
    lastFetchTime,
    manualSync: () => fetchAllJobsInBackground(filters.provinsi, true),
    failedPages,
    retryFailedFetch,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobsContext = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error("useJobsContext must be used within a JobsProvider");
  }
  return context;
};
