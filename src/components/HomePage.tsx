import { useEffect, useRef, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import RunningMessage from "./RunningMessage";
import Header from "./Header";

const HomePage = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    fetchProgress,
    refreshData,
  } = useJobs();

  const mainContentRef = useRef<HTMLDivElement>(null);
  const hasRestoredScroll = useRef(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Effect untuk show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFilter = () => {
    const filterSection = document.getElementById("filter-section");
    if (filterSection) {
      const headerHeight = 80; // Adjust sesuai tinggi header
      const filterPosition = filterSection.offsetTop - headerHeight;

      window.scrollTo({
        top: filterPosition,
        behavior: "smooth",
      });
    }
  };

  // Save scroll position saat scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(
        "magang_scrollPosition",
        window.scrollY.toString()
      );
    };

    // Throttle scroll events untuk performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  // Restore scroll position saat component mount - hanya sekali
  useEffect(() => {
    if (!hasRestoredScroll.current) {
      const savedScrollPosition = sessionStorage.getItem(
        "magang_scrollPosition"
      );
      if (savedScrollPosition && !fetchProgress.isFetchingAll) {
        // Tunggu sampai DOM selesai render
        const timer = setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          hasRestoredScroll.current = true;
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [fetchProgress.isFetchingAll]);

  // Cleanup scroll position saat unmount jika berpindah ke halaman lain
  useEffect(() => {
    return () => {
      // Jangan hapus scroll position jika masih di homepage
      // Scroll position akan dipertahankan untuk kembali ke homepage
    };
  }, []);

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };

  const getActiveFiltersText = () => {
    const activeFilters = [];

    if (filters.programStudi) {
      activeFilters.push(`Program Studi: "${filters.programStudi}"`);
    }

    if (filters.jabatan) {
      activeFilters.push(`Posisi: "${filters.jabatan}"`);
    }

    return activeFilters.join(" dan ");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-red-600 text-xl font-bold mb-4">
            Terjadi Kesalahan
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md font-semibold"
            >
              Coba Lagi
            </button>
            <button
              onClick={refreshData}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md font-semibold"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      ref={mainContentRef}
    >
      {/* Running Message */}
      <RunningMessage />

      {/* Header Section */}
      <Header></Header>
      <div className="container mx-auto px-4 py-8">
        <section id="filter-section">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
            fetchProgress={fetchProgress}
          />
        </section>
        {/* Info Jumlah Lowongan */}
        {!fetchProgress.isFetchingAll && (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200">
            {/* Main Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Results Info */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-900 font-semibold text-sm sm:text-base">
                    {pagination.from}-{pagination.to}
                  </span>
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  dari{" "}
                  <span className="font-semibold text-primary-900">
                    {pagination.total}
                  </span>{" "}
                  lowongan
                </div>
              </div>

              {/* Page Info - Hidden on mobile when filters active */}
              {pagination.total > 0 && (
                <div
                  className={`flex items-center bg-primary-50 text-primary-800 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    getActiveFiltersText() ? "hidden sm:flex" : "flex"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Halaman {pagination.current_page}/{pagination.last_page}
                </div>
              )}
            </div>

            {/* Active Filters - Compact */}
            {getActiveFiltersText() && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center text-primary-700 text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-1.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                    Filter:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.programStudi && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-blue-200">
                        🎓 {filters.programStudi}
                      </span>
                    )}
                    {filters.jabatan && (
                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-green-200">
                        💼 {filters.jabatan}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Page Info - Only show when filters active */}
            {pagination.total > 0 && getActiveFiltersText() && (
              <div className="mt-3 pt-3 border-t border-gray-200 sm:hidden">
                <div className="flex items-center justify-center bg-primary-50 text-primary-800 px-3 py-1.5 rounded-lg text-sm font-medium w-fit mx-auto">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Halaman {pagination.current_page}/{pagination.last_page}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {fetchProgress.isFetchingAll ? (
          <Loading
            message={`📥 Mengambil data halaman ${fetchProgress.current} dari ${fetchProgress.total}...`}
          />
        ) : loading ? (
          <Loading message="🔄 Memuat lowongan magang..." />
        ) : (
          <>
            {/* Grid Layout 3 Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id_posisi} job={job} />)
              ) : (
                <div className="col-span-3 text-center py-16 card">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Tidak ada lowongan yang sesuai
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Coba ubah kata kunci pencarian atau filter untuk menemukan
                    lebih banyak lowongan magang.
                  </p>
                  <button
                    onClick={() =>
                      updateFilters({
                        programStudi: "",
                        jabatan: "",
                        provinsi: "32",
                      })
                    }
                    className="btn-primary"
                  >
                    🔄 Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Pagination - Mobile Friendly */}
            {pagination.last_page > 1 && !fetchProgress.isFetchingAll && (
              <div className="flex justify-center mt-12">
                <nav className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-full max-w-md sm:max-w-none sm:w-auto">
                  {/* Mobile: Info halaman */}
                  <div className="sm:hidden text-sm text-gray-600 mb-2">
                    Halaman {pagination.current_page} dari{" "}
                    {pagination.last_page}
                  </div>

                  <div className="flex items-center space-x-1 w-full sm:w-auto justify-center">
                    {/* Previous Button */}
                    <button
                      onClick={() => changePage(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none justify-center min-w-[80px]"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Prev
                    </button>

                    {/* Page Numbers - Mobile: hanya current page, Desktop: lebih banyak */}
                    <div className="flex items-center space-x-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                      {/* First Page */}
                      {pagination.current_page > 2 && (
                        <>
                          <button
                            onClick={() => changePage(1)}
                            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0 hidden sm:block"
                          >
                            1
                          </button>
                          {pagination.current_page > 3 && (
                            <span className="px-1 text-gray-500 flex-shrink-0 hidden sm:block">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {/* Current Page & Surrounding */}
                      {(() => {
                        const pages = [];
                        const startPage = Math.max(
                          1,
                          pagination.current_page - 1
                        );
                        const endPage = Math.min(
                          pagination.last_page,
                          pagination.current_page + 1
                        );

                        for (let page = startPage; page <= endPage; page++) {
                          pages.push(
                            <button
                              key={page}
                              onClick={() => changePage(page)}
                              className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors flex-shrink-0 ${
                                page === pagination.current_page
                                  ? "text-white bg-primary-900 border-primary-900 shadow-md"
                                  : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        return pages;
                      })()}

                      {/* Last Page */}
                      {pagination.current_page < pagination.last_page - 1 && (
                        <>
                          {pagination.current_page <
                            pagination.last_page - 2 && (
                            <span className="px-1 text-gray-500 flex-shrink-0 hidden sm:block">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => changePage(pagination.last_page)}
                            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0 hidden sm:block"
                          >
                            {pagination.last_page}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => changePage(pagination.current_page + 1)}
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none justify-center min-w-[80px]"
                    >
                      Next
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
      {/* Back to Filter Button - Kecil dan Responsive */}
      {showScrollTop && (
        <button
          onClick={scrollToFilter}
          className="fixed bottom-4 right-4 z-40 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Scroll ke filter"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage;
