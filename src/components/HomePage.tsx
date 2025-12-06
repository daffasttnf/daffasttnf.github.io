import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import JobCard from "./JobCard";
import FilterBar from "./FilterBar";
import Loading from "./Loading";
import Header from "./Header";
import ExportSection from "./ExportSection";
import { exportService } from "../services/exportService";
import { getProvinceName } from "../constants/regions";
import { useSavedJobs } from "../hooks/useSavedJobs";

import SEO from "./SEO";

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
    failedPages,
    retryFailedFetch,
    availableJenjang,
  } = useJobs();

  const navigate = useNavigate();
  const { savedJobs } = useSavedJobs();

  const mainContentRef = useRef<HTMLDivElement>(null);
  const jobsGridRef = useRef<HTMLDivElement>(null);
  const jobsSectionRef = useRef<HTMLDivElement>(null);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
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

  // Simpan jobs ketika data berubah, provinsi berubah, atau sync ulang
  useEffect(() => {
    if (allJobs.length > 0) {
      handleSaveJobsForExport(allJobs);
    }
  }, [allJobs, filters.provinsi, lastFetchTime]);

  // Effect untuk show/hide floating CTA  /* State untuk slow fetch message */
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  /* Effect untuk timer slow fetch */
  useEffect(() => {
    let timer: number;
    if (fetchProgress.isBackgroundFetching) {
      // Reset state saat fetch dimulai
      setShowSlowMessage(false);
      // Set timer 3 detik
      timer = setTimeout(() => {
        setShowSlowMessage(true);
      }, 3000);
    } else {
      setShowSlowMessage(false);
    }
    return () => clearTimeout(timer);
  }, [fetchProgress.isBackgroundFetching]);

  /* Scroll to top when jobs change significantly */
  // Effect untuk show/hide floating CTA - only when in jobs section
  useEffect(() => {
    const handleScroll = () => {
      const jobsSection = jobsSectionRef.current;
      if (jobsSection) {
        const rect = jobsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Show CTA when jobs section is in view (top of section is above bottom of viewport)
        const isInJobsSection = rect.top < windowHeight && rect.bottom > 0;
        setShowFloatingCTA(isInJobsSection);
      } else {
        setShowFloatingCTA(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
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
    if (jobsGridRef.current) {
      const headerHeight = 80;
      const gridPosition = jobsGridRef.current.offsetTop - headerHeight;
      const currentScrollY = window.scrollY;

      // Hanya scroll jika posisi kita saat ini berada DI BAWAH posisi grid
      // (artinya kita sudah scroll melewati bagian atas grid)
      if (currentScrollY > gridPosition) {
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

  if (error && allJobs.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
      className="min-h-screen bg-white"
      ref={mainContentRef}
    >
      {/* Header Section */}
      <Header />

      {/* Intro Section - Full Screen Height */}
      <div className="min-h-screen bg-white flex flex-col justify-center py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
              <p className="text-sm text-purple-600 font-bold uppercase tracking-wider">
                Platform Magang Kemnaker
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Platform yang{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-purple-600">ramah pengguna</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none">
                  <path d="M2 8C60 2 140 2 198 8" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              {" "}menawarkan berbagai lowongan magang dari{" "}
              <span className="text-purple-600">berbagai industri</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
              Memudahkan Anda untuk menjelajahi dan melamar posisi yang sesuai dengan tujuan karier Anda. Temukan peluang terbaik untuk mengembangkan skill dan pengalaman profesional.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Gratis 100%</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Perusahaan Terverifikasi</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Update Setiap Hari</span>
              </div>
            </div>

            {/* Industry Categories Marquee */}
            <div className="mt-16 pt-12 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-8 font-medium">
                Tersedia lowongan dari berbagai sektor
              </p>

              {/* Marquee Container */}
              <div className="relative overflow-hidden">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* Scrolling Content - First Row */}
                <div className="flex animate-marquee">
                  <div className="flex items-center gap-8 px-4 min-w-max">
                    {/* BUMN */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v2h20V7L12 2zM4 10v8h3v-8H4zm6.5 0v8h3v-8h-3zM17 10v8h3v-8h-3zM2 20v2h20v-2H2z" /></svg>
                      <span className="font-semibold text-sm">BUMN</span>
                    </div>
                    {/* BUMD */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
                      <span className="font-semibold text-sm">BUMD</span>
                    </div>
                    {/* Swasta Nasional */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
                      <span className="font-semibold text-sm">Swasta Nasional</span>
                    </div>
                    {/* Multinasional */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white" /></svg>
                      <span className="font-semibold text-sm">Multinasional</span>
                    </div>
                    {/* Startup */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                      <span className="font-semibold text-sm">Startup</span>
                    </div>
                    {/* Pemerintah Pusat */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" /></svg>
                      <span className="font-semibold text-sm">Pemerintah Pusat</span>
                    </div>
                    {/* Pemerintah Daerah */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                      <span className="font-semibold text-sm">Pemerintah Daerah</span>
                    </div>
                    {/* Lembaga Non-Kementerian */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                      <span className="font-semibold text-sm">Lembaga Non-Kementerian</span>
                    </div>
                    {/* Lembaga Negara */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                      <span className="font-semibold text-sm">Lembaga Negara</span>
                    </div>
                    {/* Pendidikan */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /></svg>
                      <span className="font-semibold text-sm">Pendidikan</span>
                    </div>
                  </div>
                  {/* Duplicate for seamless loop */}
                  <div className="flex items-center gap-8 px-4 min-w-max">
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v2h20V7L12 2zM4 10v8h3v-8H4zm6.5 0v8h3v-8h-3zM17 10v8h3v-8h-3zM2 20v2h20v-2H2z" /></svg>
                      <span className="font-semibold text-sm">BUMN</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
                      <span className="font-semibold text-sm">BUMD</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
                      <span className="font-semibold text-sm">Swasta Nasional</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white" /></svg>
                      <span className="font-semibold text-sm">Multinasional</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                      <span className="font-semibold text-sm">Startup</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" /></svg>
                      <span className="font-semibold text-sm">Pemerintah Pusat</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                      <span className="font-semibold text-sm">Pemerintah Daerah</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                      <span className="font-semibold text-sm">Lembaga Non-Kementerian</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                      <span className="font-semibold text-sm">Lembaga Negara</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" /></svg>
                      <span className="font-semibold text-sm">Pendidikan</span>
                    </div>
                  </div>
                </div>

                {/* Second Row - Reverse Direction */}
                <div className="flex animate-marquee-reverse mt-6">
                  <div className="flex items-center gap-8 px-4 min-w-max">
                    {/* BLK */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" /></svg>
                      <span className="font-semibold text-sm">Balai Latihan Kerja</span>
                    </div>
                    {/* LSM */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                      <span className="font-semibold text-sm">LSM / Non-Profit</span>
                    </div>
                    {/* Industri Kreatif */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
                      <span className="font-semibold text-sm">Industri Kreatif</span>
                    </div>
                    {/* Kesehatan */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" /></svg>
                      <span className="font-semibold text-sm">Rumah Sakit</span>
                    </div>
                    {/* Hospitality */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" /></svg>
                      <span className="font-semibold text-sm">Hospitality</span>
                    </div>
                    {/* Manufaktur */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" /></svg>
                      <span className="font-semibold text-sm">Manufaktur</span>
                    </div>
                    {/* Keuangan */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
                      <span className="font-semibold text-sm">Keuangan & Perbankan</span>
                    </div>
                    {/* Retail */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                      <span className="font-semibold text-sm">Retail</span>
                    </div>
                    {/* Media */}
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg>
                      <span className="font-semibold text-sm">Media & Komunikasi</span>
                    </div>
                  </div>
                  {/* Duplicate for seamless loop */}
                  <div className="flex items-center gap-8 px-4 min-w-max">
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" /></svg>
                      <span className="font-semibold text-sm">Balai Latihan Kerja</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                      <span className="font-semibold text-sm">LSM / Non-Profit</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
                      <span className="font-semibold text-sm">Industri Kreatif</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" /></svg>
                      <span className="font-semibold text-sm">Rumah Sakit</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" /></svg>
                      <span className="font-semibold text-sm">Hospitality</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 10V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" /></svg>
                      <span className="font-semibold text-sm">Manufaktur</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
                      <span className="font-semibold text-sm">Keuangan & Perbankan</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                      <span className="font-semibold text-sm">Retail</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 whitespace-nowrap">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" /></svg>
                      <span className="font-semibold text-sm">Media & Komunikasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={jobsSectionRef} className="container mx-auto px-4 py-4 md:py-8">
        {/* Partial Error Banner */}
        {error && allJobs.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-xl shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Koneksi Tidak Stabil
                  </h3>
                  <div className="mt-1 text-sm text-amber-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              {failedPages.length > 0 && (
                <button
                  onClick={retryFailedFetch}
                  disabled={fetchProgress.isBackgroundFetching}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
                >
                  {fetchProgress.isBackgroundFetching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mencoba...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Ambil Data Gagal
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Layout: Filter Sidebar + Job Cards */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Left on Desktop (sticky), Top on Mobile (sticky) */}
          <aside className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-[5px] z-30">
              <section id="filter-section">
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  loading={loading}
                  fetchProgress={fetchProgress}
                  availableCities={availableCities}
                  availableCompanies={availableCompanies}
                  availableJenjang={availableJenjang}
                  lastFetchTime={lastFetchTime}
                  formatLastFetch={formatLastFetch}
                  manualSync={manualSync}
                  pagination={pagination}
                />
              </section>
            </div>
          </aside>

          {/* Main Content - Job Cards */}
          <main className="flex-1 min-w-0">
            {/* Mobile-only: Info Sync & Halaman */}
            <div className="lg:hidden bg-white rounded-xl p-3 mb-4 shadow-sm border border-gray-200">
              {/* Background Fetch Info - Mobile */}
              {fetchProgress.isBackgroundFetching && (
                <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full border-2 border-purple-200"></div>
                      <div className="absolute top-0 left-0 w-5 h-5 rounded-full border-2 border-transparent border-t-purple-600 border-r-purple-600 animate-spin"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-purple-700 text-xs font-semibold">
                        Mengambil data... ({fetchProgress.current}/{fetchProgress.total})
                      </p>
                      {showSlowMessage && (
                        <p className="text-purple-500 text-[10px] mt-0.5 animate-pulse font-medium">
                          Agak lama ya izinn 🫷🏻
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Last Fetch Time & Manual Sync */}
              {lastFetchTime && (
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Sync: <span className="font-medium text-gray-900">{formatLastFetch()}</span></span>
                  </div>
                  <button
                    onClick={() => manualSync()}
                    disabled={fetchProgress.isBackgroundFetching}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sync
                  </button>
                </div>
              )}

              {/* Info Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-900 font-semibold text-xs">
                    {pagination.from}-{pagination.to}
                  </span>
                  <span className="text-gray-600 text-xs">
                    dari <span className="font-semibold text-purple-900">{pagination.total}</span> lowongan
                  </span>
                </div>
                <div className="flex items-center bg-purple-50 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
                  Hal. {pagination.current_page}/{pagination.last_page}
                </div>
              </div>
            </div>

            {/* Loading State - HANYA tampil jika benar-benar belum ada data sama sekali */}
            {loading && allJobs.length === 0 ? (
              <Loading message="Memuat data lowongan..." />
            ) : (
              <>
                {/* Grid Layout 2 Kolom untuk Job Cards */}
                <div
                  ref={jobsGridRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
                >
                  {jobs.length > 0 ? (
                    jobs.map((job) => <JobCard key={job.id_posisi} job={job} />)
                  ) : (
                    <div className="col-span-full text-center py-16 card">
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
                            jenjang: "",
                          })
                        }
                        className="btn-primary"
                      >
                        🔄 Reset Filter
                      </button>
                    </div>
                  )}
                </div>

                {/* Background Fetch Progress Indicator - Desktop */}
                {fetchProgress.isBackgroundFetching && jobs.length > 0 && (
                  <div className="flex justify-center my-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-4 text-center max-w-md w-full shadow-lg shadow-purple-500/5">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-6 h-6 rounded-full border-2 border-purple-100"></div>
                          <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-transparent border-t-purple-600 border-r-purple-600 animate-spin"></div>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 text-sm font-semibold">
                            Sedang memperbarui data...
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-purple-600 text-xs font-medium">
                              Halaman {fetchProgress.current} dari {fetchProgress.total}
                            </p>
                            <span className="text-gray-300 text-xs">•</span>
                            <p className="text-gray-500 text-xs">
                              {allJobs.length} lowongan dimuat
                            </p>
                          </div>
                          {showSlowMessage && (
                            <p className="text-orange-500 text-xs mt-1 font-medium animate-pulse flex items-center gap-1">
                              <span>⏳</span> Agak lama ya izinn 🫷🏻
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGINATION - SELALU TAMPILKAN jika ada data, TIDAK PERLU loading check */}
                {pagination.last_page > 1 && (
                  <div className="flex justify-center mt-8 sm:mt-12 px-2">
                    <nav className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 w-full max-w-sm sm:max-w-md">
                      {/* Mobile Layout */}
                      <div className="flex flex-col gap-3">
                        {/* Page Info */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Halaman <span className="font-bold text-purple-600">{pagination.current_page}</span> dari <span className="font-semibold">{pagination.last_page}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500 text-xs">Ke:</span>
                            <input
                              type="number"
                              min="1"
                              max={pagination.last_page}
                              defaultValue={pagination.current_page}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const page = Math.max(1, Math.min(pagination.last_page, parseInt(e.currentTarget.value) || pagination.current_page));
                                  handlePageChange(page);
                                  e.currentTarget.value = page.toString();
                                }
                              }}
                              onBlur={(e) => {
                                const page = Math.max(1, Math.min(pagination.last_page, parseInt(e.target.value) || pagination.current_page));
                                handlePageChange(page);
                                e.target.value = page.toString();
                              }}
                              className="w-12 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                            />
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${pagination.current_page === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">Sebelumnya</span>
                            <span className="sm:hidden">Prev</span>
                          </button>

                          <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${pagination.current_page === pagination.last_page
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 active:scale-95 shadow-md"
                              }`}
                          >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <span className="sm:hidden">Next</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Floating Action Buttons - Bottom Right - Only visible in jobs section */}
        {showFloatingCTA && (
          <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex flex-col gap-2">
            {/* Saved Jobs Button - Only show when there are saved jobs */}
            {savedJobs.length > 0 && (
              <button
                onClick={() => {
                  sessionStorage.setItem('magang_scrollPosition', window.scrollY.toString());
                  sessionStorage.setItem('magang_shouldRestoreScroll', 'true');
                  navigate('/tersimpan');
                }}
                className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-purple-50 text-purple-600 rounded-full shadow-md border-2 border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group flex items-center justify-center"
                aria-label="Lowongan Tersimpan"
              >
                {/* Badge with count */}
                <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-sm px-1">
                  {savedJobs.length}
                </div>
                <svg
                  className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {/* Tooltip - Hidden on mobile */}
                <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  Tersimpan
                </div>
              </button>
            )}

            {/* Scroll to Filter Button - Hidden on desktop */}
            <button
              onClick={scrollToFilter}
              className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group flex items-center justify-center"
              aria-label="Scroll ke filter"
            >
              <svg
                className="w-4.5 h-4.5 sm:w-5 sm:h-5"
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
              {/* Tooltip - Hidden on mobile */}
              <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                Ke Filter
              </div>
            </button>
          </div>
        )}

        <div className="container mx-auto px-2 py-6">
          <ExportSection
            allJobs={allJobsForExport}
            onSaveJobs={handleSaveJobsForExport}
            provinceName={getProvinceName(filters.provinsi)}
          />
        </div>

        <SEO
          title="Beranda"
          description="Temukan ribuan lowongan magang resmi dari Kemnaker RI. Cari berdasarkan lokasi, perusahaan, dan jenjang pendidikan."
        />
      </div>
    </div>
  );
};

export default HomePage;