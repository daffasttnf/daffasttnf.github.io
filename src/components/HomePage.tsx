import { useEffect, useRef, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import RunningMessage from "./RunningMessage";
import { formatNumber } from "../utils/formatters";

const HomePage = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFilter = () => {
    const filterSection = document.getElementById("filter-section");
    if (filterSection) {
      const headerHeight = 80; // Adjust sesuai tinggi header
      const filterPosition = filterSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: filterPosition,
        behavior: 'smooth'
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
      <header className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-purple-900 text-white overflow-hidden min-h-screen h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>

        {/* Animated Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-primary-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
                <span className="text-sm font-medium text-white/90">
                  {statsLoading
                    ? "✨ Memuat data..."
                    : `✨ ${
                        stats ? formatNumber(stats["Jumlah Lowongan"]) : "1.450"
                      }+ Lowongan Magang Tersedia`}
                </span>
              </div>

              {/* Main Heading - Responsive font sizes */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                Temukan{" "}
                <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Magang Impian
                </span>{" "}
                Anda
              </h1>

              {/* Subheading - Responsive */}
              <p className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                🚀 Mulai perjalanan karirmu dengan pengalaman magang berkualitas
                dari perusahaan ternama di seluruh Indonesia
              </p>

              {/* Stats - Responsive grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-6 md:mb-8 px-2">
                {/* Lowongan Aktif */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Lowongan"])
                    ) : (
                      "1.450"
                    )}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm">
                    Lowongan Aktif
                  </div>
                </div>

                {/* Perusahaan */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Perusahaan"])
                    ) : (
                      "1.003"
                    )}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm">
                    Perusahaan
                  </div>
                </div>

                {/* Pendaftar */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Pendaftar Magang"])
                    ) : (
                      "157.837"
                    )}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm">
                    Pendaftar
                  </div>
                </div>

                {/* Peserta Magang */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Peserta Magang"])
                    ) : (
                      "0"
                    )}
                  </div>
                  <div className="text-primary-100 text-xs sm:text-sm">
                    Peserta Magang
                  </div>
                </div>
              </div>

              {/* CTA Button - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <button
                  onClick={() =>
                    document
                      .getElementById("filter-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-primary-900 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center w-full sm:w-auto justify-center"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Cari Magang Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
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
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <p className="text-gray-700 text-lg">
                    Menampilkan{" "}
                    <strong className="text-primary-900">
                      {pagination.from}-{pagination.to}
                    </strong>{" "}
                    dari{" "}
                    <strong className="text-primary-900">
                      {pagination.total}
                    </strong>{" "}
                    lowongan magang
                  </p>
                </div>

                {/* Info Filter Aktif */}
                {getActiveFiltersText() && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl border border-primary-200">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-2"
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
                      <p className="text-primary-800 font-medium">
                        Filter aktif: {getActiveFiltersText()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {pagination.total > 0 && (
                <div className="flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-lg font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Halaman {pagination.current_page} dari {pagination.last_page}
                </div>
              )}
            </div>
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
