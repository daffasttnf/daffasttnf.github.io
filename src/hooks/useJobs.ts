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

export const useJobs = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    provinsi: "32",
  });

  // HAPUS SEMUA: Tidak ada penyimpanan ke localStorage/sessionStorage untuk data besar

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
  const fetchAllJobs = async (provinceCode = "32", forceRefresh = false) => {
    try {
      setFetchProgress({ current: 0, total: 0, isFetchingAll: true });
      setLoading(true);
      setError(null);

      // Clear existing jobs when province changes atau force refresh
      if (forceRefresh) {
        setAllJobs([]);
        setFilteredJobs([]);
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

    if (currentFilters.jabatan) {
      filtered = filtered.filter((job) =>
        job.posisi.toLowerCase().includes(currentFilters.jabatan.toLowerCase())
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

  // Fungsi untuk clear state (tidak perlu clear storage)
  const clearStateAndReset = () => {
    setAllJobs([]);
    setFilteredJobs([]);
    setCurrentPage(1);
    console.log('🔄 State reset');
  };

  // Load stats saat component mount (hanya sekali)
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

  // Apply filters ketika programStudi atau jabatan berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      applyFilters();
    }
  }, [allJobs, filters.programStudi, filters.jabatan]);

  // Reset pagination setiap kali filter berubah
  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    // Reset pagination ke 1 setiap kali filter berubah
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

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
    updateFilters,
    changePage,
    fetchProgress,
    getJobDetail,
    isDataLoaded,
    refetch: () => fetchAllJobs(filters.provinsi, true),
    refreshData,
  };
};