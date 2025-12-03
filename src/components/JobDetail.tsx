import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useSavedJobs, type SaveStatus } from '../hooks/useSavedJobs';
import { fetchJobById } from '../services/api';
import Loading from './Loading';
import Toast from './Toast';
import SEO from './SEO';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getJobDetail, isDataLoaded } = useJobs();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showToast, setShowToast] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isSaved = id ? isJobSaved(id) : false;

  useEffect(() => {
    if (location.state?.job) {
      setJob(location.state.job);
      setIsLoading(false);
      return;
    }

    setJob(null);
    setIsLoading(true);

    if (id) {
      const loadJob = async () => {
        try {
          if (isDataLoaded()) {
            const cachedJob = getJobDetail(id);
            if (cachedJob) {
              setJob(cachedJob);
              setIsLoading(false);
              return;
            }
          }

          const jobData = await fetchJobById(id);
          if (jobData) {
            setJob(jobData);
            if (jobData.perusahaan?.kode_provinsi) {
              try {
                const savedFilters = sessionStorage.getItem('magang_filters');
                const currentFilters = savedFilters ? JSON.parse(savedFilters) : {
                  programStudi: "",
                  jabatan: "",
                  provinsi: "11",
                  kota: "",
                  perusahaan: "",
                  jenjang: "",
                };

                if (currentFilters.provinsi !== jobData.perusahaan.kode_provinsi) {
                  currentFilters.provinsi = jobData.perusahaan.kode_provinsi;
                  sessionStorage.setItem('magang_filters', JSON.stringify(currentFilters));
                  sessionStorage.setItem('magang_currentPage', '1');
                }
              } catch (e) {
                console.warn('Failed to update filters:', e);
              }
            }
          }
        } catch (e) {
          console.error('Error loading job:', e);
        } finally {
          setIsLoading(false);
        }
      };
      loadJob();
    }
  }, [id, location.state, getJobDetail, isDataLoaded]);

  const showToastNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSaveToggle = () => {
    if (!job) return;

    if (isSaved) {
      const success = removeJob(job.id_posisi);
      if (success) {
        showToastNotification('Lowongan dihapus dari tersimpan', 'info');
      }
    } else {
      const status: SaveStatus = saveJob(job);

      switch (status) {
        case 'success':
          showToastNotification('Lowongan berhasil disimpan!', 'success');
          break;
        case 'already_saved':
          showToastNotification('Lowongan sudah tersimpan', 'info');
          break;
        case 'quota_full':
          showToastNotification('Penyimpanan penuh! Maksimal 10 lowongan', 'error');
          break;
        case 'error':
          showToastNotification('Gagal menyimpan lowongan', 'error');
          break;
      }
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = `${job.posisi} - ${job.perusahaan.nama_perusahaan}`;
    const text = `Lihat lowongan magang ${job.posisi} di ${job.perusahaan.nama_perusahaan}, ${job.perusahaan.nama_kabupaten}! 🎯\n\nKuota: ${job.jumlah_kuota} orang\nLokasi: ${job.perusahaan.nama_kabupaten}, ${job.perusahaan.nama_provinsi}\n\nDaftar sekarang di MagangHub Kemnaker:`;

    const shareUrls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      copy: ''
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToastNotification('Link berhasil disalin!', 'success');
      setShowShareModal(false);
    } else {
      window.open(shareUrls[platform], '_blank');
      setShowShareModal(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loading message="Memuat detail..." /></div>;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl w-full">
          {/* Animated Error Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-blue-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full -ml-24 -mb-24 opacity-50"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Animated 404 Icon */}
              <div className="mb-6 relative">
                <div className="text-8xl sm:text-9xl font-bold text-gray-200 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl animate-bounce">🔍</div>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Lowongan Tidak Ditemukan
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-2 max-w-md mx-auto">
                Maaf, lowongan yang Anda cari tidak tersedia atau tautan tidak valid.
              </p>
              <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto">
                Mungkin lowongan sudah ditutup, dihapus, atau API sedang tidak berjalan.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <button
                  onClick={() => navigate('/')}
                  className="group relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Kembali ke Beranda</span>
                  </div>
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium text-base border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto"
                >
                  ← Halaman Sebelumnya
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Butuh bantuan? Coba{" "}
                  <button
                    onClick={() => navigate('/')}
                    className="text-primary-600 hover:text-primary-700 font-semibold underline"
                  >
                    cari lowongan lain
                  </button>
                  {" "}atau refresh halaman ini.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1">Tips</h3>
                <p className="text-xs sm:text-sm text-blue-700">
                  Jika Anda mengakses link dari share, pastikan link masih valid.
                  Lowongan mungkin sudah ditutup atau API sedang dalam maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const parseJSON = (data: string) => {
    try { return typeof data === 'string' ? JSON.parse(data) : data || []; } catch { return []; }
  };

  const handleDaftar = () => {
    if (job.id_posisi) window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${job.id_posisi}`, '_blank');
  };

  const programStudi = parseJSON(job.program_studi);
  const jenjang = parseJSON(job.jenjang);

  // Structured Data for JobPosting
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.nama,
    "description": job.deskripsi || `Lowongan magang ${job.nama} di ${job.perusahaan?.name || 'Perusahaan'}`,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.perusahaan?.name,
      "value": job.id_posisi
    },
    "datePosted": job.created_at,
    "validThrough": job.tgl_tutup,
    "employmentType": "INTERN",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.perusahaan?.name,
      "logo": job.perusahaan?.logo_url
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.lokasi_kota,
        "addressRegion": job.lokasi_provinsi,
        "addressCountry": "ID"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12 font-sans">
      <SEO
        title={`${job.nama} di ${job.perusahaan?.name || 'Perusahaan'}`}
        description={`Lowongan magang ${job.nama} di ${job.perusahaan?.name}. Lokasi: ${job.lokasi_kota}, ${job.lokasi_provinsi}. Daftar sekarang di MagangHub Explorer!`}
        image={job.perusahaan?.logo_url}
        type="article"
        structuredData={structuredData}
      />
      {/* Compact Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-between items-center">
          <button
            onClick={() => { sessionStorage.setItem("magang_shouldRestoreScroll", 'true'); navigate('/'); }}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali
          </button>
          <div className="flex gap-2">
            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:bg-gray-100 hover:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            {/* Save/Bookmark Button */}
            <button onClick={handleSaveToggle} className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-100'}`}>
              <svg className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Rest of the JobDetail component remains the same... */}
        {/* Compact Hero */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
              <img
                src={job.perusahaan.logo || 'https://via.placeholder.com/150'}
                alt="Logo"
                className="w-16 h-16 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                  {job.ref_status_posisi?.nama_status_posisi || 'Aktif'}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs font-medium">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{job.posisi}</h1>
              <p className="text-primary-700 font-medium text-lg">{job.perusahaan.nama_perusahaan}</p>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleDaftar}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all hover:scale-105 active:scale-95"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description FIRST */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-3 text-lg">📝</span>
                Deskripsi Pekerjaan
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-justify">
                {job.deskripsi_posisi?.split('\n').map((p: string, i: number) => p.trim() && <p key={i} className="mb-2">{p}</p>)}
              </div>
            </div>

            {/* Requirements (Compact Chips) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-lg">🎓</span>
                Kualifikasi
              </h2>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Jenjang Pendidikan</h3>
                <div className="flex flex-wrap gap-2">
                  {jenjang.map((j: string, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium border border-blue-100">{j}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Jurusan</h3>
                <div className="flex flex-wrap gap-2">
                  {programStudi.map((ps: any, i: number) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium border border-gray-200">{ps.title}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            {/* Key Info Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Informasi Penting</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Kuota</span>
                  <span className="font-bold text-gray-900">{job.jumlah_kuota} Orang</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Pendaftar</span>
                  <span className="font-bold text-green-600">{job.jumlah_terdaftar} Orang</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">Durasi</span>
                  <span className="font-bold text-gray-900">
                    {job.jadwal ? Math.ceil(Math.abs(new Date(job.jadwal.tanggal_selesai).getTime() - new Date(job.jadwal.tanggal_mulai).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0} Bulan
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Compact */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Jadwal</h3>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  <p className="text-xs text-gray-500 mb-0.5">Mulai Magang</p>
                  <p className="font-semibold text-sm text-gray-900">{formatDate(job.jadwal?.tanggal_mulai)}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                  <p className="text-xs text-gray-500 mb-0.5">Selesai Magang</p>
                  <p className="font-semibold text-sm text-gray-900">{formatDate(job.jadwal?.tanggal_selesai)}</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                  <p className="text-xs text-gray-500 mb-0.5">Batas Daftar</p>
                  <p className="font-semibold text-sm text-red-600">{formatDate(job.jadwal?.tanggal_batas_pendaftaran)}</p>
                </div>
              </div>
            </div>

            {/* Company Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{job.perusahaan.alamat}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={handleSaveToggle} className={`flex-1 py-2.5 rounded-xl font-bold border text-sm transition-colors ${isSaved ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-white text-gray-700 border-gray-300'}`}>
          {isSaved ? 'Tersimpan' : 'Simpan'}
        </button>
        <button onClick={handleDaftar} className="flex-[2] bg-primary-600 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 text-sm">
          Daftar Sekarang
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bagikan Lowongan</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">WhatsApp</span>
              </button>

              <button onClick={() => handleShare('telegram')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.306.02.472z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Telegram</span>
              </button>

              <button onClick={() => handleShare('twitter')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Twitter/X</span>
              </button>

              <button onClick={() => handleShare('facebook')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Facebook</span>
              </button>

              <button onClick={() => handleShare('linkedin')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-0.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">LinkedIn</span>
              </button>

              <button onClick={() => handleShare('copy')} className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Salin Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={4000}
          onClose={() => setShowToast(false)}
          showAction={toastType === 'success' && toastMessage.includes('disimpan')}
          actionLabel="Lihat Tersimpan"
          onAction={() => navigate('/tersimpan')}
        />
      )}
    </div>
  );
};

export default JobDetail;
