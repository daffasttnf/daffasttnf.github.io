import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { fetchJobById } from '../services/api';
import Loading from './Loading';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getJobDetail, isDataLoaded } = useJobs();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSaveToggle = () => {
    if (!job) return;
    if (isSaved) {
      removeJob(job.id_posisi);
    } else {
      saveJob(job);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loading message="Memuat detail..." /></div>;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lowongan Tidak Ditemukan</h1>
          <button onClick={() => navigate('/')} className="text-primary-600 hover:underline">Kembali ke Beranda</button>
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12 font-sans">
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
            <button onClick={handleSaveToggle} className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${isSaved ? 'fill-current' : 'none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
        <button onClick={handleSaveToggle} className={`flex-1 py-2.5 rounded-xl font-bold border text-sm transition-colors ${isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-700 border-gray-300'}`}>
          {isSaved ? 'Tersimpan' : 'Simpan'}
        </button>
        <button onClick={handleDaftar} className="flex-[2] bg-primary-600 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary-600/20 text-sm">
          Daftar Sekarang
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
