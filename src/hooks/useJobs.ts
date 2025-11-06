import { useState, useEffect } from "react";
import { fetchJobs } from "../services/api";
import { fetchStats } from "../services/statsApi";

interface ProgramStudi {
  value: string;
  title: string;
}

interface Perusahaan {
  id_perusahaan: string;
  nama_perusahaan: string;
  alamat: string;
  logo: string | null;
  nama_kabupaten: string;
  nama_provinsi: string;
}

interface Jadwal {
  tanggal_mulai: string;
  tanggal_selesai: string;
  tanggal_batas_pendaftaran: string;
}

interface StatusPosisi {
  id_status_posisi: number;
  nama_status_posisi: string;
}

export interface Job {
  id_posisi: string;
  posisi: string;
  deskripsi_posisi: string;
  program_studi: string;
  jenjang: string;
  id_status_posisi: number;
  jumlah_kuota: number;
  jumlah_terdaftar: number;
  perusahaan: Perusahaan;
  jadwal: Jadwal;
  ref_status_posisi: StatusPosisi;
}

interface Filters {
  programStudi: string;
  jabatan: string;
  provinsi: string;
  kota: string;
  perusahaan: string;
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
}

interface Stats {
  "Jumlah Lowongan": number;
  "Jumlah Pendaftar Magang": number;
  "Jumlah Perusahaan": number;
  "Jumlah Peserta Magang": number;
}

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

export const useJobs = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  const [itemsPerPage] = useState(21);
  const [fetchProgress, setFetchProgress] = useState<FetchProgress>({
    current: 0,
    total: 0,
    isFetchingAll: false,
  });

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    programStudi: "",
    jabatan: "",
    provinsi: "11",
    kota: "",
    perusahaan: "",
  });

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

  // Update available cities dan companies ketika allJobs berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      const cities = extractCitiesFromJobs(allJobs, filters);
      const companies = extractCompaniesFromJobs(allJobs, filters);

      setAvailableCities(cities);
      setAvailableCompanies(companies);

      // Reset kota jika kota yang dipilih tidak ada di list baru
      if (filters.kota && !cities.includes(filters.kota)) {
        setFilters((prev) => ({ ...prev, kota: "" }));
      }

      // Reset perusahaan jika perusahaan yang dipilih tidak ada di list baru
      if (filters.perusahaan && !companies.includes(filters.perusahaan)) {
        setFilters((prev) => ({ ...prev, perusahaan: "" }));
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

  // Fungsi untuk fetch semua data dari semua halaman
  const fetchAllJobs = async (provinceCode = "11", forceRefresh = false) => {
    try {
      setFetchProgress({ current: 0, total: 0, isFetchingAll: true });
      setLoading(true);
      setError(null);

      // Clear existing jobs when province changes atau force refresh
      if (forceRefresh) {
        setAllJobs([]);
        setFilteredJobs([]);
        setAvailableCities([]);
        setAvailableCompanies([]);
      }

      const firstPageData = await fetchJobs(1, 20, provinceCode);
      const totalPages = firstPageData.meta.pagination.last_page;

      setFetchProgress({ current: 1, total: totalPages, isFetchingAll: true });

      let allJobsData: Job[] = [...firstPageData.data];

      for (let page = 2; page <= totalPages; page++) {
        const pageData = await fetchJobs(page, 20, provinceCode);
        allJobsData = [...allJobsData, ...pageData.data];
        setFetchProgress({
          current: page,
          total: totalPages,
          isFetchingAll: true,
        });

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setAllJobs(allJobsData);
      applyFilters(allJobsData, filters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");

      // Fallback: coba load data dari cache/local storage jika ada
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setFetchProgress({ current: 0, total: 0, isFetchingAll: false });
    }
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

  // Initial load - selalu fetch data baru
  useEffect(() => {
    fetchAllJobs(filters.provinsi, false);
  }, []);

  // Fetch data ketika provinsi berubah
  useEffect(() => {
    fetchAllJobs(filters.provinsi, true);
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
    fetchAllJobs(filters.provinsi, true);
  };

  return {
    jobs: currentJobs,
    loading,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
    availableCities,
    availableCompanies,
    updateFilters,
    changePage,
    fetchProgress,
    getJobDetail,
    isDataLoaded,
    allJobs,
    refetch: () => fetchAllJobs(filters.provinsi, true),
    refreshData,
  };
};
