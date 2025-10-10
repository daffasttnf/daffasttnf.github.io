import React from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
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
  } = useJobs();

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
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* New Attractive Header */}
      <header className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>

        {/* Animated Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 py-16 relative z-10">
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
              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Temukan{" "}
                <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Magang Impian
                </span>{" "}
                Anda
              </h1>
              {/* Subheading */}
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                🚀 Mulai perjalanan karirmu dengan pengalaman magang berkualitas
                dari perusahaan ternama di seluruh Indonesia
              </p>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                {/* Lowongan Aktif */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Lowongan"])
                    ) : (
                      "1.450"
                    )}
                  </div>
                  <div className="text-blue-100 text-sm">Lowongan Aktif</div>
                </div>

                {/* Perusahaan */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Perusahaan"])
                    ) : (
                      "1.003"
                    )}
                  </div>
                  <div className="text-blue-100 text-sm">Perusahaan</div>
                </div>

                {/* Pendaftar */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Pendaftar Magang"])
                    ) : (
                      "157.837"
                    )}
                  </div>
                  <div className="text-blue-100 text-sm">Pendaftar</div>
                </div>

                {/* Peserta Magang */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">
                    {statsLoading ? (
                      <div className="inline-block w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : stats ? (
                      formatNumber(stats["Jumlah Peserta Magang"])
                    ) : (
                      "0"
                    )}
                  </div>
                  <div className="text-blue-100 text-sm">Peserta Magang</div>
                </div>
              </div>
              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() =>
                    document
                      .getElementById("filter-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center"
                >
                  <svg
                    className="w-6 h-6 mr-2"
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
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-900 transition-all duration-300 backdrop-blur-sm">
                  🔍 Jelajahi Semua Lowongan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-blue-50 fill-current"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </header>

      {/* Filter Section dengan ID untuk scroll */}
      <section
        id="filter-section"
        className="container mx-auto px-4 -mt-8 relative z-20"
      >
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          fetchProgress={fetchProgress}
        />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Info Jumlah Lowongan */}
        {!fetchProgress.isFetchingAll && (
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <p className="text-gray-700 text-lg">
                    Menampilkan{" "}
                    <strong className="text-blue-900">
                      {pagination.from}-{pagination.to}
                    </strong>{" "}
                    dari{" "}
                    <strong className="text-blue-900">
                      {pagination.total}
                    </strong>{" "}
                    lowongan magang
                  </p>
                </div>

                {/* Info Filter Aktif */}
                {getActiveFiltersText() && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
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
                      <p className="text-blue-800 font-medium">
                        Filter aktif: {getActiveFiltersText()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {pagination.total > 0 && (
                <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
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

            {/* Pagination */}
            {pagination.last_page > 1 && !fetchProgress.isFetchingAll && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <button
                    onClick={() => changePage(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Sebelumnya
                  </button>

                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.last_page ||
                        Math.abs(page - pagination.current_page) <= 2
                    )
                    .map((page, index, array) => {
                      const showEllipsis =
                        index < array.length - 1 && array[index + 1] - page > 1;
                      return (
                        <React.Fragment key={page}>
                          <button
                            onClick={() => changePage(page)}
                            className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all ${
                              page === pagination.current_page
                                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 shadow-md"
                                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                          {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => changePage(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                    <svg
                      className="w-4 h-4 ml-2"
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
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
