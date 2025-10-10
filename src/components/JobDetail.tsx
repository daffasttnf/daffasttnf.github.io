import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import Loading from './Loading';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getJobDetail, isDataLoaded } = useJobs();
  
  // State untuk data job
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Ambil data job dari state navigation (jika ada)
  const jobFromState = location.state?.job;
  

  useEffect(() => {
    const loadJobData = async () => {
      setLoading(true);
      
      // Priority 1: Gunakan data dari state (jika ada) - instant
      if (jobFromState) {
        setJob(jobFromState);
        setLoading(false);
        return;
      }
      
      // Priority 2: Jika data sudah loaded di hook, ambil dari there
      if (id && isDataLoaded()) {
        const jobData = getJobDetail(id);
        if (jobData) {
          setJob(jobData);
          setLoading(false);
          return;
        }
      }
      
      // Priority 3: Jika data belum tersedia, tunggu sebentar
      if (id) {
        const checkInterval = setInterval(() => {
          if (isDataLoaded()) {
            const jobData = getJobDetail(id);
            if (jobData) {
              setJob(jobData);
              setLoading(false);
              clearInterval(checkInterval);
            }
          }
        }, 100);

        // Timeout setelah 3 detik
        const timeout = setTimeout(() => {
          clearInterval(checkInterval);
          setLoading(false);
        }, 3000);

        return () => {
          clearInterval(checkInterval);
          clearTimeout(timeout);
        };
      }
    };

    loadJobData();
  }, [id, jobFromState, getJobDetail, isDataLoaded]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const parseJSON = (data: string) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data || [];
    } catch {
      return [];
    }
  };

  const calculateDuration = () => {
    if (!job?.jadwal) return 0;
    const start = new Date(job.jadwal.tanggal_mulai);
    const end = new Date(job.jadwal.tanggal_selesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const handleDaftar = () => {
    if (id) {
      window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${id}`, '_blank');
    }
  };

  // Tampilkan loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Memuat detail lowongan..." />
      </div>
    );
  }

  // Tampilkan error jika job tidak ditemukan
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Lowongan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            Lowongan yang Anda cari tidak ditemukan atau sudah tidak tersedia.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => router.back()}
              className="w-full btn-primary"
            >
              Kembali ke Beranda
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full btn-secondary"
            >
              🔄 Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const programStudi = parseJSON(job.program_studi);
  const jenjang = parseJSON(job.jenjang);
  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-primary-900 hover:text-primary-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Header Card */}
              <div className="bg-primary-900 p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-3">{job.posisi}</h1>
                    <div className="flex items-center text-primary-100 text-lg mb-2">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.perusahaan.nama_perusahaan}
                    </div>
                    <div className="flex items-center text-primary-100 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                    </div>
                  </div>
                  {job.perusahaan.logo && (
                    <img 
                      src={job.perusahaan.logo} 
                      alt={`Logo ${job.perusahaan.nama_perusahaan}`}
                      className="w-16 h-16 object-contain bg-white rounded p-2 mt-4 lg:mt-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Info Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <h3 className="font-semibold text-primary-900 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Durasi Magang
                    </h3>
                    <p className="text-xl font-bold text-primary-900">{duration} Bulan</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status
                    </h3>
                    <p className="text-xl font-bold text-green-900">{job.ref_status_posisi.nama_status_posisi}</p>
                  </div>
                </div>

                {/* Deskripsi Pekerjaan */}
                {job.deskripsi_posisi && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Deskripsi Pekerjaan</h2>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="prose max-w-none text-gray-700">
                        {job.deskripsi_posisi.split('\n').map((paragraph: string, index: number) => (
                          <p key={index} className="mb-3 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Program Studi */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Program Studi yang Dibutuhkan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {programStudi.map((ps: any, index: number) => (
                      <div key={index} className="flex items-center bg-primary-50 rounded p-3 border border-primary-200">
                        <svg className="w-4 h-4 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-primary-800 font-medium">{ps.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Jenjang Pendidikan */}
                {jenjang.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Jenjang Pendidikan</h2>
                    <div className="flex flex-wrap gap-2">
                      {jenjang.map((j: any, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-2 rounded font-medium border border-gray-300">
                          {j.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pendaftaran</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Lokasi</p>
                    <p className="text-sm">{job.perusahaan.alamat}</p>
                    <p className="text-sm">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Tanggal Mulai</p>
                    <p className="text-sm">{formatDate(job.jadwal.tanggal_mulai)}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Tanggal Selesai</p>
                    <p className="text-sm">{formatDate(job.jadwal.tanggal_selesai)}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Batas Pendaftaran</p>
                    <p className="text-sm text-red-600 font-semibold">{formatDate(job.jadwal.tanggal_batas_pendaftaran)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-gray-600 pt-2 border-t border-gray-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Kuota</p>
                      <p className="text-sm">{job.jumlah_kuota} posisi</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Pendaftar</p>
                    <p className="text-sm text-green-600 font-semibold">{job.jumlah_terdaftar} orang</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDaftar}
                className="w-full btn-primary py-3 text-lg"
              >
                📝 Daftar Sekarang
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Anda akan diarahkan ke halaman resmi MagangHub Kemnaker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;