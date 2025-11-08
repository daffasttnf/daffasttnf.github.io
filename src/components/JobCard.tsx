import { useState } from 'react';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showProgramStudiModal, setShowProgramStudiModal] = useState(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);

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
      if (!data) return [];
      return typeof data === 'string' ? JSON.parse(data) : data || [];
    } catch {
      return [];
    }
  };

  const programStudi = parseJSON(job.program_studi);
  const jenjang = JSON.parse(job.jenjang);
  const displayedProgramStudi = programStudi.slice(0, 3);
  const remainingCount = programStudi.length - 3;

  const handleCardClick = () => {
    setShowJobDetailModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowJobDetailModal(false);
    document.body.style.overflow = 'unset';
  };

  const handleDaftarClick = () => {
    window.open(`https://maganghub.kemnaker.go.id/lowongan/view/${job.id_posisi}`, '_blank');
  };

  const calculateDuration = () => {
    if (!job?.jadwal?.tanggal_mulai || !job?.jadwal?.tanggal_selesai) return 0;
    const start = new Date(job.jadwal.tanggal_mulai);
    const end = new Date(job.jadwal.tanggal_selesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const duration = calculateDuration();

  const ProgramStudiModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowProgramStudiModal(false)}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-primary-900 to-purple-900 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Program Studi</h3>
            <button
              onClick={() => setShowProgramStudiModal(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {programStudi.map((ps: any, index: number) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800 font-medium">{ps.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setShowProgramStudiModal(false)}
            className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-2 px-4 rounded-lg hover:from-primary-800 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );

  const JobDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-purple-900 p-6 text-white flex-shrink-0">
          <div className="flex justify-between items-start">
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
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold leading-tight break-words">{job.posisi}</h1>
                  <p className="text-white/90 text-sm mt-1 break-words">{job.perusahaan.nama_perusahaan}</p>
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
                  {job.ref_status_posisi?.nama_status_posisi || 'Aktif'}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCloseModal}
              className="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0 ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-blue-700 text-sm mb-1 font-medium">Kuota Tersedia</div>
                  <div className="text-2xl font-bold text-blue-900">{job.jumlah_kuota || 0}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-green-700 text-sm mb-1 font-medium">Sudah Daftar</div>
                  <div className="text-2xl font-bold text-green-900">{job.jumlah_terdaftar || 0}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Timeline Magang
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Mulai Magang</div>
                        <div className="font-semibold text-gray-900">{formatDate(job.jadwal?.tanggal_mulai)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Selesai Magang</div>
                        <div className="font-semibold text-gray-900">{formatDate(job.jadwal?.tanggal_selesai)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Batas Pendaftaran</div>
                        <div className="font-semibold text-red-700">{formatDate(job.jadwal?.tanggal_batas_pendaftaran)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Studi */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  Program Studi ({programStudi.length})
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  {programStudi.map((ps: any, index: number) => (
                    <span 
                      key={index} 
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-4 py-2 rounded-lg border border-blue-200 font-medium text-sm"
                    >
                      {ps.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Jenjang Pendidikan - FIXED */}
              {jenjang && jenjang.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Jenjang Pendidikan ({jenjang.length})
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {jenjang.map((j: any, index: number) => (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 px-4 py-2 rounded-lg border border-purple-200 font-medium text-sm"
                      >
                        {j}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deskripsi Pekerjaan */}
              {job.deskripsi_posisi && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Deskripsi Pekerjaan
                  </h3>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {job.deskripsi_posisi.split('\n').map((paragraph: string, index: number) => (
                      paragraph.trim() && (
                        <p key={index} className="text-justify">{paragraph}</p>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-5 border border-primary-200 shadow-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-900 to-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Daftar Magang</h3>
                  <p className="text-gray-600 text-sm mt-1">Segera daftar sebelum batas waktu</p>
                </div>
                
                <button
                  onClick={handleDaftarClick}
                  className="w-full bg-gradient-to-r from-primary-900 to-purple-900 text-white py-3 px-4 rounded-xl font-bold hover:from-primary-800 hover:to-purple-800 transition-all duration-200 shadow-lg mb-3 text-lg"
                >
                  📝 Daftar Sekarang
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Anda akan diarahkan ke halaman resmi MagangHub Kemnaker
                  </p>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Informasi Perusahaan
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-medium">Alamat Perusahaan</p>
                    <p className="text-gray-900 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {job.perusahaan.alamat || 'Alamat tidak tersedia'}
                    </p>
                    <p className="text-primary-700 font-medium text-sm mt-2">
                      📍 {job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Status Lowongan</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-full font-medium">
                        {job.ref_status_posisi?.nama_status_posisi || 'Aktif'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {job.jumlah_terdaftar || 0}/{job.jumlah_kuota || 0} pendaftar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Sumber: MagangHub Kemnaker
            </p>
            <button
              onClick={handleCloseModal}
              className="bg-white text-gray-700 py-2 px-6 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:border-primary-300 cursor-pointer h-full flex flex-col group transition-all duration-300"
      >
        {/* Header - Company & Position */}
        <div className="flex items-start space-x-3 mb-3">
          {job.perusahaan.logo && (
            <img 
              src={job.perusahaan.logo} 
              alt={`Logo ${job.perusahaan.nama_perusahaan}`}
              className="w-10 h-10 object-contain rounded-lg border border-gray-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-primary-900 transition-colors leading-tight">
              {job.posisi}
            </h2>
            <p className="text-primary-900 font-semibold text-sm line-clamp-1 mt-1">
              {job.perusahaan.nama_perusahaan}
            </p>
          </div>
        </div>

        {/* Location & Deadline */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="line-clamp-1">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Batas: <strong>{formatDate(job.jadwal?.tanggal_batas_pendaftaran)}</strong></span>
          </div>
        </div>

        {/* Program Studi */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Program Studi:</span>
            {remainingCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgramStudiModal(true);
                }}
                className="text-xs text-primary-900 hover:text-primary-800 font-medium transition-colors bg-primary-50 px-2 py-1 rounded-lg"
              >
                +{remainingCount} lainnya
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displayedProgramStudi.map((ps: any, index: number) => (
              <span 
                key={index} 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 font-medium"
              >
                {ps.title}
              </span>
            ))}
          </div>
        </div>

        {/* Footer - Applicants & Quota */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              <span className="font-bold text-gray-900">{job.jumlah_terdaftar || 0}</span> pendaftar
            </div>
            <div className="text-gray-600">
              Kuota: <span className="font-bold text-gray-900">{job.jumlah_kuota || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Program Studi */}
      {showProgramStudiModal && <ProgramStudiModal />}

      {/* Modal Detail Lowongan */}
      {showJobDetailModal && <JobDetailModal />}
    </>
  );
};

export default JobCard;