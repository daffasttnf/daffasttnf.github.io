import { useNavigate } from 'react-router-dom';
import { useSavedJobs } from '../hooks/useSavedJobs';
import JobCard from './JobCard';

const SavedJobsPage = () => {
  const { savedJobs } = useSavedJobs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lowongan Tersimpan</h1>
              <p className="text-gray-600 mt-1">
                {savedJobs.length} / 10 lowongan disimpan
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Lowongan Lain
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {savedJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada lowongan tersimpan</h2>
            <p className="text-gray-500 mb-6">Lowongan yang Anda simpan akan muncul di sini.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              Mulai Mencari
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id_posisi} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
