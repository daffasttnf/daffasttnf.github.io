import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import CountUp from "react-countup";
import { useJobs } from "../hooks/useJobs";

const Header = () => {
  const { stats, statsLoading } = useJobs();
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "Jt";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "Rb";
    }
    return num.toString();
  };

  return (
    <header
      ref={headerRef}
      className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-purple-900 text-white overflow-hidden min-h-screen h-screen flex items-center"
    >
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

            {/* Main Heading dengan Layout Responsif */}
            <div className="mb-4 md:mb-6">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                {/* Untuk Semua Device - Layout Horizontal */}
                <div className="flex flex-col items-center">
                  {/* Baris Pertama: Temukan [Kata Berubah] */}
                  <div className="flex justify-center items-baseline flex-wrap gap-2 sm:gap-3 mb-2 px-2">
                    <span className="whitespace-nowrap">Temukan</span>
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent min-w-[140px] sm:min-w-[160px] md:min-w-[180px] text-center">
                      <Typewriter
                        options={{
                          strings: ["Pasangan", "Magang"],
                          autoStart: true,
                          loop: true,
                          delay: 120,
                          deleteSpeed: 80,
                          cursor: "|",
                          cursorClassName:
                            "Typewriter__cursor text-amber-300 ml-1",
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .typeString("Pasangan")
                            .pauseFor(2500)
                            .deleteChars(8)
                            .pauseFor(500)
                            .typeString("Magang")
                            .pauseFor(2500)
                            .deleteChars(6)
                            .pauseFor(500)
                            .start();
                        }}
                      />
                    </span>
                  </div>

                  {/* Baris Kedua: Impian Anda */}
                  <div className="whitespace-nowrap">Impian Anda</div>
                </div>
              </div>
            </div>

            {/* Alternatif Layout untuk Tablet */}
            <div className="mb-4 md:mb-6 hidden md:block lg:hidden">
              <div className="text-4xl md:text-5xl font-bold leading-tight">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex flex-col items-center">
                    <div className="flex items-baseline space-x-2">
                      <span>Temukan</span>
                      <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent min-w-[180px] text-center">
                        <Typewriter
                          options={{
                            strings: ["Pasangan", "Magang"],
                            autoStart: true,
                            loop: true,
                            delay: 120,
                            deleteSpeed: 80,
                            cursor: "|",
                            cursorClassName:
                              "Typewriter__cursor text-amber-300 ml-1",
                          }}
                          onInit={(typewriter) => {
                            typewriter
                              .typeString("Pasangan")
                              .pauseFor(2500)
                              .deleteChars(8)
                              .pauseFor(500)
                              .typeString("Magang")
                              .pauseFor(2500)
                              .deleteChars(6)
                              .pauseFor(500)
                              .start();
                          }}
                        />
                      </span>
                    </div>
                  </div>
                  <div>Impian Anda</div>
                </div>
              </div>
            </div>

            {/* Animated Subheading */}
            <div className="text-lg sm:text-lg md:text-2xl text-primary-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 h-16 sm:h-20 flex items-center justify-center">
              <Typewriter
                options={{
                  strings: [
                    "Cari magang atau cari jodoh? Why not both? 💘", 
                    "Your career love story starts here! 🌟", 
                    "Bukan PDKT, tapi Professional Development & Karir Transformation! ⚡", 
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 45,
                  deleteSpeed: 25,
                  cursor: "▌",
                }}
              />
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-6 md:mb-8 px-2">
              {/* Lowongan Aktif */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  {statsLoading ? (
                    <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isVisible ? (
                    <CountUp
                      end={stats ? stats["Jumlah Lowongan"] : 1450}
                      duration={2.5}
                      separator="."
                      useEasing={true}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                      className="text-white"
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-primary-100 text-xs sm:text-sm">
                  Lowongan Aktif
                </div>
              </div>

              {/* Perusahaan */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  {statsLoading ? (
                    <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isVisible ? (
                    <CountUp
                      end={stats ? stats["Jumlah Perusahaan"] : 1003}
                      duration={2.5}
                      separator="."
                      useEasing={true}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-primary-100 text-xs sm:text-sm">
                  Perusahaan
                </div>
              </div>

              {/* Pendaftar */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  {statsLoading ? (
                    <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isVisible ? (
                    <CountUp
                      end={stats ? stats["Jumlah Pendaftar Magang"] : 157837}
                      duration={3}
                      separator="."
                      useEasing={true}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-primary-100 text-xs sm:text-sm">
                  Pendaftar
                </div>
              </div>

              {/* Peserta Magang */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group hover:scale-105">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  {statsLoading ? (
                    <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : isVisible ? (
                    <CountUp
                      end={stats ? stats["Jumlah Peserta Magang"] : 0}
                      duration={2}
                      separator="."
                      useEasing={true}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <div className="text-primary-100 text-xs sm:text-sm">
                  Peserta Magang
                </div>
              </div>
            </div>

            {/* CTA Button dengan Efek Berkilau */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <button
                onClick={() =>
                  document
                    .getElementById("filter-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-primary-900 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-amber-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center w-full sm:w-auto justify-center overflow-hidden group"
              >
                {/* Efek Kilau */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10"
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
                <span className="relative z-10">Cari Magang Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
