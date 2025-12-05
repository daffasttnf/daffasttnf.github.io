import { useNavigate } from 'react-router-dom';
import { useSavedJobs } from '../hooks/useSavedJobs';
import JobCard from './JobCard';

import SEO from './SEO';

const SavedJobsPage = () => {
  const { savedJobs } = useSavedJobs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SEO
        title="Lowongan Tersimpan"
        description="Kelola daftar lowongan magang favorit Anda. Simpan dan bandingkan lowongan magang impian Anda di MagangHub Explorer."
      />
      {/* Sticky Header with proper z-index to prevent overlap */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-7xl">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex-shrink-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center truncate">
                <span>Lowongan Tersimpan</span>
              </h1>
              <div className="flex items-center mt-1 text-xs sm:text-sm">
                <span className="text-gray-600">
                  <span className="font-bold text-primary-600">{savedJobs.length}</span> / 10 lowongan
                </span>
                <div className="ml-2 sm:ml-3 bg-gray-200 rounded-full h-1.5 sm:h-2 w-16 sm:w-24 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(savedJobs.length / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper relative positioning */}
      <div className="container mx-auto px-4 pt-6 pb-12 max-w-7xl relative z-0">
        {savedJobs.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="relative">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-pulse">💼</div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-5xl sm:text-6xl md:text-7xl opacity-20">❤️</div>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 px-4">Belum ada lowongan tersimpan</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto px-4">
              Simpan lowongan favoritmu untuk memudahkan akses dan perbandingan nanti.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              Mulai Mencari Lowongan
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                {savedJobs.length} lowongan tersimpan
              </h2>
              {savedJobs.length >= 8 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center w-fit">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Hampir penuh ({10 - savedJobs.length} slot tersisa)
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {savedJobs.map((job) => (
                <JobCard key={job.id_posisi} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
