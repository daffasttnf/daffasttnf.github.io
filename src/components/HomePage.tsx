import { useEffect, useRef, useState } from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import RunningMessage from "./RunningMessage";
import Header from "./Header";
import Footer from "./Footer";
import ExportSection from "./ExportSection";
import { exportService } from "../services/exportService";
import { getProvinceName } from "../constants/regions";

const HomePage = () => {
  const {
    jobs,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    availableCities,
    changePage,
    fetchProgress,
    availableCompanies,
    refreshData,
    allJobs,
    lastFetchTime,
    manualSync,
  } = useJobs();

  const mainContentRef = useRef<HTMLDivElement>(null);
  const jobsGridRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastPageRef = useRef(pagination.current_page);

  const [allJobsForExport, setAllJobsForExport] = useState<any[]>([]);

  // Fungsi untuk save jobs ke export service
  const handleSaveJobsForExport = async (jobs: any[]) => {
    try {
      await exportService.saveJobsForExport(filters.provinsi, jobs);
      setAllJobsForExport(jobs);
    } catch (error) {
      console.error("Error saving jobs for export:", error);
    }
  };

  // Simpan jobs ketika data berubah
  useEffect(() => {
    if (allJobs.length > 0) {
      handleSaveJobsForExport(allJobs);
    }
  }, [allJobs]);

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
      const headerHeight = 80;
      const filterPosition = filterSection.offsetTop - headerHeight;

      window.scrollTo({
        top: filterPosition,
        behavior: "smooth",
      });
    }
  };

  // Fungsi untuk scroll ke grid jobs (hanya jika diperlukan)
  const scrollToJobsGrid = () => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (currentScrollY < 300) {
      return;
    }

    if (currentScrollY + windowHeight > documentHeight - 500) {
      if (jobsGridRef.current) {
        const headerHeight = 80;
        const gridPosition = jobsGridRef.current.offsetTop - headerHeight;

        window.scrollTo({
          top: gridPosition,
          behavior: "smooth",
        });
      }
    }
  };

  // Save scroll position saat scroll - dengan throttle
  useEffect(() => {
    let scrollTimeout: any;

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        try {
          sessionStorage.setItem("magang_scrollPosition", scrollY.toString());
        } catch (e) {
          console.warn("Gagal menyimpan scroll position:", e);
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // SCROLL RESTORATION
  useEffect(() => {
    if (jobs.length > 0) {
      const savedScrollPosition = sessionStorage.getItem(
        "magang_scrollPosition"
      );
      const shouldRestoreScroll = sessionStorage.getItem(
        "magang_shouldRestoreScroll"
      );

      if (savedScrollPosition && shouldRestoreScroll === "true") {
        const scrollY = parseInt(savedScrollPosition);

        const timer = setTimeout(() => {
          window.scrollTo(0, scrollY);
          console.log("🔄 Scroll position restored:", scrollY);

          // Clear flag setelah restore
          try {
            sessionStorage.setItem("magang_shouldRestoreScroll", "false");
          } catch (e) {
            console.warn("Gagal menyimpan scroll flag:", e);
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [jobs.length]);

  // Effect untuk scroll ke jobs grid hanya ketika benar-benar diperlukan
  useEffect(() => {
    if (jobs.length > 0) {
      if (lastPageRef.current !== pagination.current_page) {
        const timer = setTimeout(() => {
          scrollToJobsGrid();
          lastPageRef.current = pagination.current_page;
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [jobs, pagination.current_page]);

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
  };

  // Update getActiveFiltersText untuk include perusahaan:
  const getActiveFiltersText = () => {
    const activeFilters = [];

    if (filters.programStudi) {
      activeFilters.push(`Program Studi: "${filters.programStudi}"`);
    }

    if (filters.jabatan) {
      activeFilters.push(`Posisi: "${filters.jabatan}"`);
    }

    if (filters.kota) {
      activeFilters.push(`Kota: "${filters.kota}"`);
    }

    if (filters.perusahaan) {
      activeFilters.push(`Perusahaan: "${filters.perusahaan}"`);
    }

    return activeFilters.join(" dan ");
  };

  // Format last fetch time
  const formatLastFetch = () => {
    if (!lastFetchTime) return 'Belum pernah';
    const now = Date.now();
    const diff = now - lastFetchTime;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Baru saja';
    if (minutes === 1) return '1 menit yang lalu';
    if (minutes < 60) return `${minutes} menit yang lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 jam yang lalu';
    return `${hours} jam yang lalu`;
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
      <Header />

      <div className="container mx-auto px-4 py-8">
        <section id="filter-section">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
            fetchProgress={fetchProgress}
            availableCities={availableCities}
            availableCompanies={availableCompanies}
          />
        </section>

        {/* Info Jumlah Lowongan dengan Background Fetch Indicator */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200">
          {/* Background Fetch Info */}
          {fetchProgress.isBackgroundFetching && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">
                    📥 Sedang mengambil data lengkap...
                  </span>
                  <span className="text-green-600 text-sm">
                    (Halaman {fetchProgress.current} dari {fetchProgress.total})
                  </span>
                </div>
                <div className="text-green-600 text-xs">
                  Data akan terus bertambah
                </div>
              </div>
            </div>
          )}

          {/* Last Fetch Time & Manual Sync */}
          {lastFetchTime && (
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 text-sm">
                      Terakhir disinkronkan: <span className="font-medium text-gray-900">{formatLastFetch()}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => manualSync()}
                  disabled={fetchProgress.isBackgroundFetching}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sinkronkan ulang data"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Sync Ulang</span>
                </button>
              </div>
            </div>
          )}

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
                {fetchProgress.isBackgroundFetching && (
                  <span className="text-green-600 text-xs ml-2">
                    • Data masih bertambah
                  </span>
                )}
              </div>
            </div>

            {/* Page Info - Hidden on mobile when filters active */}
            {pagination.total > 0 && (
              <div
                className={`flex items - center bg - primary - 50 text - primary - 800 px - 3 py - 1.5 rounded - lg text - sm font - medium ${getActiveFiltersText() ? "hidden sm:flex" : "flex"
                  } `}
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
                  {filters.kota && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-purple-200">
                      🏙️ {filters.kota}
                    </span>
                  )}
                  {filters.perusahaan && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2.5 py-1.5 rounded-lg font-medium border border-orange-200">
                      🏢 {filters.perusahaan}
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

        {/* Loading State - HANYA tampil jika benar-benar belum ada data sama sekali */}
        {loading && allJobs.length === 0 ? (
          <Loading message="🔄 Memuat data lowongan..." />
        ) : (
          <>
            {/* Grid Layout 3 Kolom - TAMPILKAN data yang sudah terload */}
            <div
              ref={jobsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
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
                        provinsi: filters.provinsi,
                        kota: "",
                        perusahaan: "",
                      })
                    }
                    className="btn-primary"
                  >
                    🔄 Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Background Fetch Progress Indicator */}
            {fetchProgress.isBackgroundFetching && jobs.length > 0 && (
              <div className="flex justify-center my-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center max-w-md w-full">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    <div>
                      <p className="text-green-700 text-sm font-medium">
                        Mengambil data tambahan...
                      </p>
                      <p className="text-green-600 text-xs">
                        Halaman {fetchProgress.current} dari {fetchProgress.total}
                        {allJobs.length > 0 && ` • ${allJobs.length} data sudah terload`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGINATION - SELALU TAMPILKAN jika ada data, TIDAK PERLU loading check */}
            {pagination.last_page > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-full max-w-md">
                  <div className="flex items-center justify-between gap-3">
                    {/* Page Info & Input */}
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600 hidden sm:block">
                        Hal.{" "}
                        <span className="font-semibold">
                          {pagination.current_page}
                        </span>
                        /
                        <span className="font-semibold">
                          {pagination.last_page}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 sm:hidden">
                          Ke:
                        </span>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max={pagination.last_page}
                            defaultValue={pagination.current_page}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const page = Math.max(
                                  1,
                                  Math.min(
                                    pagination.last_page,
                                    parseInt(e.currentTarget.value) ||
                                    pagination.current_page
                                  )
                                );
                                handlePageChange(page);
                                e.currentTarget.value = page.toString();
                              }
                            }}
                            onBlur={(e) => {
                              const page = Math.max(
                                1,
                                Math.min(
                                  pagination.last_page,
                                  parseInt(e.target.value) ||
                                  pagination.current_page
                                )
                              );
                              handlePageChange(page);
                              e.target.value = page.toString();
                            }}
                            className="w-12 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-center"
                          // TIDAK ADA disabled state di sini
                          />
                        </div>
                      </div>
                    </div>

                    {/* Navigation - TIDAK ADA disabled state */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page - 1)
                        }
                        disabled={pagination.current_page === 1}
                        className={`p - 2 text - gray - 600 bg - white border border - gray - 300 rounded - lg transition - colors ${pagination.current_page === 1
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                          } `}
                        title="Sebelumnya"
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1 mx-2">
                        {pagination.current_page > 1 && (
                          <button
                            onClick={() => handlePageChange(1)}
                            className="w-7 h-7 text-xs border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            1
                          </button>
                        )}

                        {pagination.current_page > 2 && (
                          <span className="text-gray-400 text-xs">•</span>
                        )}

                        <button className="w-7 h-7 text-xs border border-primary-600 rounded text-white bg-primary-600 shadow-sm cursor-default">
                          {pagination.current_page}
                        </button>

                        {pagination.current_page < pagination.last_page - 1 && (
                          <span className="text-gray-400 text-xs">•</span>
                        )}

                        {pagination.current_page < pagination.last_page && (
                          <button
                            onClick={() =>
                              handlePageChange(pagination.last_page)
                            }
                            className="w-7 h-7 text-xs border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            {pagination.last_page}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          handlePageChange(pagination.current_page + 1)
                        }
                        disabled={pagination.current_page === pagination.last_page}
                        className={`p - 2 text - gray - 600 bg - white border border - gray - 300 rounded - lg transition - colors ${pagination.current_page === pagination.last_page
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-gray-50 hover:border-gray-400 cursor-pointer"
                          } `}
                        title="Selanjutnya"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to Filter Button */}
      {showScrollTop && (
        <button
          onClick={scrollToFilter}
          className="fixed bottom-4 right-4 z-40 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
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

      <div className="container mx-auto px-4 py-6">
        <ExportSection
          allJobs={allJobsForExport}
          onSaveJobs={handleSaveJobsForExport}
          provinceName={getProvinceName(filters.provinsi)}
        />
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;