import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import Loading from './Loading';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getJobDetail, isDataLoaded } = useJobs();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check if job data is passed via navigation state (Instant Load)
    if (location.state?.job) {
      console.log('✅ Job loaded from navigation state');
      setJob(location.state.job);
      setIsLoading(false);
      return;
    }

    // 2. If not in state, try to load from useJobs (Background/Cache Load)
    setJob(null);
    setIsLoading(true);

    if (id) {
      let attempts = 0;
      const maxAttempts = 50; // Wait up to 5 seconds

      const checkData = () => {
        attempts++;

        if (isDataLoaded()) {
          const jobData = getJobDetail(id);
          if (jobData) {
            console.log('✅ Job data found via useJobs:', jobData.posisi);
            setJob(jobData);
            setIsLoading(false);
          } else if (attempts < maxAttempts) {
            // Data loaded but job not found yet (maybe filtering?), keep trying briefly
            setTimeout(checkData, 100);
          } else {
            // Max attempts reached
            console.warn('⚠️ Job not found after max attempts');
            setIsLoading(false);
          }
        } else if (attempts < maxAttempts) {
          // Data not loaded yet, keep waiting
          setTimeout(checkData, 100);
        } else {
          // Max attempts reached
          console.warn('⚠️ Data not loaded after max attempts');
          setIsLoading(false);
        }
      };

      checkData();
    }
  }, [id, getJobDetail, isDataLoaded, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading message="Memuat data lowongan..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Lowongan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Lowongan yang Anda cari tidak ditemukan atau sudah tidak tersedia.</p>
          <button
            onClick={() => {
              sessionStorage.setItem("magang_shouldRestoreScroll", 'true');
              navigate('/');
            }}
            className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-md"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
    if (job.id_posisi) {
      window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${job.id_posisi}`, '_blank');
    }
  };

  const handleBackToHome = () => {
    sessionStorage.setItem("magang_shouldRestoreScroll", 'true');
    navigate('/');
  };

  const programStudi = parseJSON(job.program_studi);
  const jenjang = parseJSON(job.jenjang);
  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-700 hover:text-primary-900 transition-all font-medium group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 rounded-3xl p-8 text-white mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              {job.perusahaan.logo && (
                <div className="flex-shrink-0">
                  <img
                    src={job.perusahaan.logo}
                    alt={`Logo ${job.perusahaan.nama_perusahaan}`}
                    className="w-20 h-20 object-contain bg-white rounded-2xl p-3 shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold mb-2 leading-tight">{job.posisi}</h1>
                <p className="text-white/90 text-lg font-medium">{job.perusahaan.nama_perusahaan}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="font-medium">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{duration} Bulan</span>
              </div>
              <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-green-400/30">
                <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-green-100">{job.ref_status_posisi?.nama_status_posisi || 'Aktif'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Kuota</span>
                  <svg className="w-8 h-8 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-blue-900">{job.jumlah_kuota || 0}</div>
                <p className="text-gray-600 text-sm mt-1">Posisi tersedia</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-600 text-sm font-semibold uppercase tracking-wide">Pendaftar</span>
                  <svg className="w-8 h-8 text-green-500 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-green-900">{job.jumlah_terdaftar || 0}</div>
                <p className="text-gray-600 text-sm mt-1">Sudah mendaftar</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Timeline Magang
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-semibold mb-1">Mulai Magang</p>
                    <p className="text-lg font-bold text-green-900">{formatDate(job.jadwal?.tanggal_mulai)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-700 font-semibold mb-1">Selesai Magang</p>
                    <p className="text-lg font-bold text-blue-900">{formatDate(job.jadwal?.tanggal_selesai)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-semibold mb-1">Batas Pendaftaran</p>
                    <p className="text-lg font-bold text-red-900">{formatDate(job.jadwal?.tanggal_batas_pendaftaran)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Studi */}
            {programStudi.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  Program Studi <span className="ml-2 text-primary-600">({programStudi.length})</span>
                </h2>

                <div className="flex flex-wrap gap-3">
                  {programStudi.map((ps: any, index: number) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-4 py-2.5 rounded-xl border border-blue-200 font-medium hover:shadow-md transition-shadow"
                    >
                      {ps.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Jenjang Pendidikan */}
            {jenjang.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Jenjang Pendidikan <span className="ml-2 text-purple-600">({jenjang.length})</span>
                </h2>

                <div className="flex flex-wrap gap-3">
                  {jenjang.map((j: any, index: number) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 px-4 py-2.5 rounded-xl border border-purple-200 font-medium hover:shadow-md transition-shadow"
                    >
                      {j}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deskripsi */}
            {job.deskripsi_posisi && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Deskripsi Pekerjaan
                </h2>
                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    {job.deskripsi_posisi.split('\n').map((paragraph: string, index: number) => (
                      paragraph.trim() && (
                        <p key={index} className="text-justify">{paragraph}</p>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 rounded-2xl p-6 shadow-2xl text-white sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Siap Bergabung?</h3>
                <p className="text-white/80">Daftar sekarang sebelum kuota penuh!</p>
              </div>

              <button
                onClick={handleDaftar}
                className="w-full bg-white text-primary-900 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-xl text-lg mb-4 hover:scale-105 transform"
              >
                📝 Daftar Sekarang
              </button>

              <p className="text-center text-white/70 text-xs">
                Anda akan diarahkan ke halaman resmi MagangHub Kemnaker
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Informasi Perusahaan
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Alamat</p>
                  <p className="text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {job.perusahaan.alamat}
                  </p>
                  <p className="text-primary-700 font-medium mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-3">Status Lowongan</p>
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                    <span className="bg-green-500 text-white text-sm px-3 py-1.5 rounded-full font-semibold shadow-sm">
                      {job.ref_status_posisi?.nama_status_posisi || 'Aktif'}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">
                      {job.jumlah_terdaftar || 0}/{job.jumlah_kuota || 0} pendaftar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 lg:hidden z-30">
        <button
          onClick={handleDaftar}
          className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-4 px-6 rounded-xl font-bold hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-lg text-lg"
        >
          📝 Daftar Sekarang
        </button>
        <p className="text-center text-gray-500 text-xs mt-2">
          Anda akan diarahkan ke halaman resmi MagangHub
        </p>
      </div>
    </div>
  );
};

export default JobDetail;
