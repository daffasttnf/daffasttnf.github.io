import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const [showProgramStudiModal, setShowProgramStudiModal] = useState(false);

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
  const displayedProgramStudi = programStudi.slice(0, 3);
  const remainingCount = programStudi.length - 3;

  const handleCardClick = () => {
    // Save scroll position before navigating
    sessionStorage.setItem("magang_scrollPosition", window.scrollY.toString());
    sessionStorage.setItem("magang_shouldRestoreScroll", 'true');
    // Navigate to detail page with job data in state
    navigate(`/lowongan/${job.id_posisi}`, { state: { job } });
  };

  const ProgramStudiModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowProgramStudiModal(false)}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-primary-900 to-purple-900 p-6 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Semua Program Studi</h3>
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
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {programStudi.map((ps: any, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-200 font-medium"
              >
                {ps.title}
              </div>
            ))}
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
    </>
  );
};

export default JobCard;