import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import Loading from './Loading';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobDetail, isDataLoaded } = useJobs();
  const [job, setJob] = useState<any>(null);
  
  useEffect(() => {
    if (id && isDataLoaded()) {
      const jobData = getJobDetail(id);
      setJob(jobData);
    }
  }, [id, getJobDetail, isDataLoaded]);

  if (!isDataLoaded()) {
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

  const programStudi = parseJSON(job.program_studi);
  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-700 hover:text-primary-900 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-900 to-purple-900 rounded-2xl p-5 text-white mb-4 shadow-lg">
          <div className="flex items-start space-x-4">
            {job.perusahaan.logo && (
              <img 
                src={job.perusahaan.logo} 
                alt={`Logo ${job.perusahaan.nama_perusahaan}`}
                className="w-14 h-14 object-contain bg-white rounded-xl p-2 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-2 leading-tight">{job.posisi}</h1>
              <div className="flex items-center text-white/90 text-sm mb-1">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="truncate">{job.perusahaan.nama_perusahaan}</span>
              </div>
              <div className="flex items-center text-white/80 text-xs">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Durasi
            </div>
            <p className="text-lg font-bold text-primary-900">{duration} Bulan</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </div>
            <p className="text-lg font-bold text-green-600">{job.ref_status_posisi.nama_status_posisi}</p>
          </div>
        </div>

        {/* Timeline Info */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Timeline Magang
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Mulai</span>
              <span className="font-semibold text-gray-900 text-sm">{formatDate(job.jadwal.tanggal_mulai)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">Selesai</span>
              <span className="font-semibold text-gray-900 text-sm">{formatDate(job.jadwal.tanggal_selesai)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 text-sm">Batas Daftar</span>
              <span className="font-semibold text-red-600 text-sm">{formatDate(job.jadwal.tanggal_batas_pendaftaran)}</span>
            </div>
          </div>
        </div>

        {/* Program Studi */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
            Program Studi ({programStudi.length})
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {programStudi.map((ps: any, index: number) => (
              <span 
                key={index} 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-xs px-3 py-2 rounded-lg border border-blue-200 font-medium whitespace-nowrap"
              >
                {ps.title}
              </span>
            ))}
        
          </div>
        </div>

        {/* Deskripsi */}
        {job.deskripsi_posisi && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">📝 Deskripsi Pekerjaan</h3>
            <div className="text-gray-700 text-sm leading-relaxed space-y-2">
              {job.deskripsi_posisi.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() && (
                  <p key={index}>{paragraph}</p>
                )
              ))}
            </div>
          </div>
        )}

        {/* Kuota & Pendaftar */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-900">{job.jumlah_kuota}</div>
              <div className="text-gray-600 text-xs mt-1">Kuota Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{job.jumlah_terdaftar}</div>
              <div className="text-gray-600 text-xs mt-1">Sudah Daftar</div>
            </div>
          </div>
        </div>

        {/* Fixed CTA Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <button
            onClick={handleDaftar}
            className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-4 px-4 rounded-xl font-bold text-lg hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-lg"
          >
            📝 Daftar Sekarang
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Akan dibuka di halaman resmi MagangHub
          </p>
        </div>

        {/* Spacer for fixed button */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default JobDetail;