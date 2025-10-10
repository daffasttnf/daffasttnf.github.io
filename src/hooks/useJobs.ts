import { useState, useEffect, useRef } from 'react';
import { fetchJobs } from '../services/api';
import { fetchStats } from '../services/statsApi';

interface ProgramStudi {
  value: string;
  title: string;
}

interface Jenjang {
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

interface Job {
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
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(21);
  const [fetchProgress, setFetchProgress] = useState<FetchProgress>({
    current: 0,
    total: 0,
    isFetchingAll: false
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    programStudi: '',
    jabatan: '',
    provinsi: '32'
  });

  // Ref untuk track initial load
  const initialLoadRef = useRef(true);

  // Fungsi untuk fetch stats
  const fetchAllStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Tetap set stats dengan nilai default real jika error
      setStats({
        "Jumlah Lowongan": 1450,
        "Jumlah Pendaftar Magang": 157837,
        "Jumlah Perusahaan": 1003,
        "Jumlah Peserta Magang": 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fungsi untuk fetch semua data dari semua halaman
  const fetchAllJobs = async (provinceCode = '32') => {
    try {
      setFetchProgress({ current: 0, total: 0, isFetchingAll: true });
      setLoading(true);
      
      const firstPageData = await fetchJobs(1, 20, provinceCode);
      const totalPages = firstPageData.meta.pagination.last_page;
      
      setFetchProgress({ current: 1, total: totalPages, isFetchingAll: true });
      
      let allJobsData: Job[] = [...firstPageData.data];
      
      for (let page = 2; page <= totalPages; page++) {
        const pageData = await fetchJobs(page, 20, provinceCode);
        allJobsData = [...allJobsData, ...pageData.data];
        setFetchProgress({ current: page, total: totalPages, isFetchingAll: true });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setAllJobs(allJobsData);
      applyFilters(allJobsData, filters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
      setFetchProgress({ current: 0, total: 0, isFetchingAll: false });
    }
  };

  const applyFilters = (jobs: Job[] = allJobs, currentFilters: Filters = filters) => {
    let filtered = jobs;

    if (currentFilters.programStudi) {
      filtered = filtered.filter(job => {
        try {
          const programStudiList: ProgramStudi[] = JSON.parse(job.program_studi || '[]');
          return programStudiList.some(ps => 
            ps.title.toLowerCase().includes(currentFilters.programStudi.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }

    if (currentFilters.jabatan) {
      filtered = filtered.filter(job => 
        job.posisi.toLowerCase().includes(currentFilters.jabatan.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  // Fungsi yang sederhana - langsung return job tanpa async
  const getJobDetail = (id: string): Job | undefined => {
    return allJobs.find(job => job.id_posisi === id);
  };

  // Fungsi untuk check apakah data sudah loaded
  const isDataLoaded = () => {
    return allJobs.length > 0;
  };

  // Effect untuk initial load - fetch stats dan jobs
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // Fetch stats hanya sekali di awal
      fetchAllStats();
      // Fetch jobs untuk provinsi default
      fetchAllJobs(filters.provinsi);
    }
  }, []);

  // Effect untuk fetch jobs ketika provinsi berubah
  useEffect(() => {
    if (!initialLoadRef.current) {
      // Hanya fetch jobs, tidak fetch stats lagi
      fetchAllJobs(filters.provinsi);
    }
  }, [filters.provinsi]);

  useEffect(() => {
    if (allJobs.length > 0) {
      applyFilters();
    }
  }, [allJobs, filters.programStudi, filters.jabatan]);

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
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
    to: Math.min(indexOfLastItem, filteredJobs.length)
  };

  return {
    jobs: currentJobs,
    loading,
    detailLoading,
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
    refetch: () => fetchAllJobs(filters.provinsi)
  };
};