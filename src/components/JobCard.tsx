import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showProgramStudiModal, setShowProgramStudiModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const parseJSON = (data: string) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data || [];
    } catch {
      return [];
    }
  };

  const programStudi = parseJSON(job.program_studi);

  // Hitung durasi magang (selalu bulatkan ke atas)
  const calculateDuration = () => {
    const start = new Date(job.jadwal.tanggal_mulai);
    const end = new Date(job.jadwal.tanggal_selesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const duration = calculateDuration();

  const displayedProgramStudi = programStudi.slice(0, 2);
  const remainingCount = programStudi.length - 2;

  const handleCardClick = () => {
    sessionStorage.setItem('magang_scrollPosition', window.scrollY.toString());
    navigate(`/lowongan/${job.id_posisi}`);
  };

  const ProgramStudiModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowProgramStudiModal(false)}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-primary-900 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold text-lg">Program Studi Tersedia</h3>
            <button
              onClick={() => setShowProgramStudiModal(false)}
              className="text-white hover:text-gray-200 transition-colors"
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
              <div key={index} className="flex items-center p-3 bg-primary-50 rounded border border-primary-200">
                <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-primary-800 font-medium">{ps.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setShowProgramStudiModal(false)}
            className="w-full bg-primary-900 text-white py-2 px-4 rounded hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="card p-5 hover:border-primary-300 cursor-pointer h-full flex flex-col group"
      >
        {/* Header dengan Logo */}
        <div className="flex items-start space-x-4 mb-4">
          {job.perusahaan.logo && (
            <img 
              src={job.perusahaan.logo} 
              alt={`Logo ${job.perusahaan.nama_perusahaan}`}
              className="w-12 h-12 object-contain rounded border border-gray-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-900 transition-colors">
              {job.posisi}
            </h2>
            <p className="text-primary-900 font-medium text-sm line-clamp-1">
              {job.perusahaan.nama_perusahaan}
            </p>
          </div>
        </div>

        {/* Info Penting */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="line-clamp-1">{job.perusahaan.nama_kabupaten}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{duration} bulan</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Batas: {formatDate(job.jadwal.tanggal_batas_pendaftaran)}</span>
            </div>
            <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.ref_status_posisi.nama_status_posisi}
            </div>
          </div>
        </div>

        {/* Program Studi */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Program Studi:</span>
            {remainingCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgramStudiModal(true);
                }}
                className="text-xs text-primary-900 hover:text-primary-800 font-medium transition-colors"
              >
                Lihat semua
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {displayedProgramStudi.map((ps: any, index: number) => (
              <span key={index} className="bg-primary-50 text-primary-800 text-xs px-2 py-1 rounded border border-primary-200">
                {ps.title}
              </span>
            ))}
            {remainingCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgramStudiModal(true);
                }}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                +{remainingCount}
              </button>
            )}
          </div>
        </div>

        {/* Footer dengan Info Pendaftar */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600">
              <span className="font-medium text-gray-900">{job.jumlah_terdaftar}</span> pendaftar
            </div>
            <div className="text-gray-500">
              Kuota: <span className="font-medium text-gray-700">{job.jumlah_kuota}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Program Studi */}
      {showProgramStudiModal && <ProgramStudiModal />}
    </>
  );
};

export default JobCard;