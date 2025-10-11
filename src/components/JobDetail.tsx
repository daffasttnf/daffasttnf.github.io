import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import Loading from './Loading';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobDetail, isDataLoaded } = useJobs();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Reset state ketika id berubah
    setJob(null);
    setIsLoading(true);

    if (id) {
      // Tunggu sampai data benar-benar loaded
      const checkData = () => {
        if (isDataLoaded()) {
          const jobData = getJobDetail(id);
          if (jobData) {
            setJob(jobData);
            setIsLoading(false);
          } else {
            // Data tidak ditemukan
            setIsLoading(false);
          }
        } else {
          // Data belum loaded, coba lagi dalam 100ms
          setTimeout(checkData, 100);
        }
      };

      checkData();
    }
  }, [id, getJobDetail, isDataLoaded]);

  // Tampilkan loading sampai proses selesai
  if (isLoading || !isDataLoaded()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading message="Memuat data lowongan..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">Lowongan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6 text-sm">Lowongan yang Anda cari tidak ditemukan atau sudah tidak tersedia.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-800 hover:to-purple-800 transition-all duration-200"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
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
    if (id) {
      window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${id}`, '_blank');
    }
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${job.perusahaan.alamat}, ${job.perusahaan.nama_kabupaten}, ${job.perusahaan.nama_provinsi}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const programStudi = parseJSON(job.program_studi);
  const jenjang = parseJSON(job.jenjang);
  const duration = calculateDuration();
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-700 hover:text-primary-900 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl pb-24 lg:pb-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-900 to-purple-900 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                {job.perusahaan.logo && (
                  <img 
                    src={job.perusahaan.logo} 
                    alt={`Logo ${job.perusahaan.nama_perusahaan}`}
                    className="w-12 h-12 object-contain bg-white rounded-xl p-2 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h1 className="text-xl font-bold leading-tight">{job.posisi}</h1>
                  <p className="text-white/90 text-sm mt-1">{job.perusahaan.nama_perusahaan}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {duration} Bulan
                </div>
                <div className="flex items-center text-green-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.ref_status_posisi.nama_status_posisi}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-sm mb-1">Kuota Tersedia</div>
                <div className="text-2xl font-bold text-primary-900">{job.jumlah_kuota}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-gray-600 text-sm mb-1">Sudah Daftar</div>
                <div className="text-2xl font-bold text-green-600">{job.jumlah_terdaftar}</div>
              </div>
            </div>

            {/* Timeline Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Timeline Magang
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mulai
                  </div>
                  <span className="font-semibold text-gray-900">{formatDate(job.jadwal.tanggal_mulai)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Selesai
                  </div>
                  <span className="font-semibold text-gray-900">{formatDate(job.jadwal.tanggal_selesai)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Batas Daftar
                  </div>
                  <span className="font-semibold text-red-600">{formatDate(job.jadwal.tanggal_batas_pendaftaran)}</span>
                </div>
              </div>
            </div>

            {/* Program Studi */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
                Program Studi ({programStudi.length})
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {programStudi.map((ps: any, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-sm px-3 py-2 rounded-lg border border-blue-200 font-medium"
                  >
                    {ps.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            {job.deskripsi_posisi && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">📝 Deskripsi Pekerjaan</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  {job.deskripsi_posisi.split('\n').map((paragraph: string, index: number) => (
                    paragraph.trim() && (
                      <p key={index}>{paragraph}</p>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Jenjang Pendidikan */}
            {jenjang.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">🎓 Jenjang Pendidikan</h3>
                <div className="flex flex-wrap gap-2">
                  {jenjang.map((j: any, index: number) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium border border-gray-300"
                    >
                      {j.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info - Mobile Only */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm lg:hidden">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">🏢 Informasi Perusahaan</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alamat</p>
                  <p className="text-gray-900 font-medium text-sm leading-relaxed">
                    {job.perusahaan.alamat}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Status Lowongan</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                      {job.ref_status_posisi.nama_status_posisi}
                    </span>
                    <span className="text-xs text-gray-500">
                      {job.jumlah_terdaftar}/{job.jumlah_kuota} pendaftar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <button
                onClick={handleDaftar}
                className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-3 px-4 rounded-xl font-bold hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-lg mb-3"
              >
                📝 Daftar Sekarang
              </button>
              
              <button
                onClick={handleOpenMaps}
                className="w-full bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lihat Lokasi
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Anda akan diarahkan ke halaman resmi MagangHub
              </p>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">🏢 Informasi Perusahaan</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alamat</p>
                  <p className="text-gray-900 font-medium text-sm leading-relaxed">
                    {job.perusahaan.alamat}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Status Lowongan</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                      {job.ref_status_posisi.nama_status_posisi}
                    </span>
                    <span className="text-xs text-gray-500">
                      {job.jumlah_terdaftar}/{job.jumlah_kuota} pendaftar
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 lg:hidden z-20">
        <div className="container mx-auto max-w-4xl">
          <div className="flex space-x-3">
            <button
              onClick={handleDaftar}
              className="flex-1 bg-gradient-to-r from-primary-900 to-purple-900 text-white py-3 px-4 rounded-xl font-bold hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-lg text-center"
            >
              📝 Daftar Sekarang
            </button>
            <button
              onClick={handleOpenMaps}
              className="bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Anda akan diarahkan ke halaman resmi MagangHub
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;