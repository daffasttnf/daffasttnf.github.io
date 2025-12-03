import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const [showProgramStudiModal, setShowProgramStudiModal] = useState(false);


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
  const jenjang = parseJSON(job.jenjang);

  const handleCardClick = () => {
    sessionStorage.setItem("magang_scrollPosition", window.scrollY.toString());
    sessionStorage.setItem("magang_shouldRestoreScroll", 'true');
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
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 cursor-pointer h-full flex flex-col group transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-50 transition-opacity group-hover:opacity-100"></div>

        {/* Header - Company & Position */}
        <div className="flex items-start space-x-4 mb-4 relative z-10">
          <div className="bg-white p-1.5 rounded-lg border border-gray-100 shadow-sm flex-shrink-0">
            <img
              src={job.perusahaan.logo || 'https://via.placeholder.com/150'}
              alt={`Logo ${job.perusahaan.nama_perusahaan}`}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors leading-snug mb-1">
              {job.posisi}
            </h2>
            <p className="text-gray-600 font-medium text-sm line-clamp-1">
              {job.perusahaan.nama_perusahaan}
            </p>
          </div>
        </div>

        {/* Info Tags */}
        <div className="space-y-2.5 mb-4 relative z-10">
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="truncate">{job.perusahaan.nama_kabupaten}, {job.perusahaan.nama_provinsi}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span className="truncate">{jenjang.join(', ') || 'Semua Jenjang'}</span>
          </div>
        </div>

        {/* Program Studi Pills */}
        <div className="mb-4 relative z-10">
          <div className="flex flex-wrap gap-1.5">
            {displayedProgramStudi.map((ps: any, index: number) => (
              <span
                key={index}
                className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md border border-gray-100 font-medium truncate max-w-[150px]"
              >
                {ps.title}
              </span>
            ))}
            {remainingCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgramStudiModal(true);
                }}
                className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-md border border-primary-100 font-medium hover:bg-primary-100 transition-colors"
              >
                +{remainingCount}
              </button>
            )}
          </div>
        </div>

        {/* Footer - Quota & Applicants */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-sm relative z-10">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span><strong className="text-gray-900">{job.jumlah_terdaftar || 0}</strong> pendaftar</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span>Kuota: <strong className="text-primary-600">{job.jumlah_kuota || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Modal Program Studi */}
      {showProgramStudiModal && <ProgramStudiModal />}
    </>
  );
};

export default JobCard;