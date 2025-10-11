import { useState, useEffect, useRef } from 'react';
import  Typewriter  from 'typewriter-effect';
import CountUp from 'react-countup';
import { useJobs } from '../hooks/useJobs';

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
      return (num / 1000000).toFixed(1) + 'Jt';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'Rb';
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

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Temukan{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Magang Impian
              </span>{" "}
              Anda
            </h1>

            {/* Animated Subheading */}
            <div className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 h-16 sm:h-20 flex items-center justify-center">
              <Typewriter
                options={{
                  strings: [
                    'Mulai perjalanan karirmu dengan pengalaman magang berkualitas...',
                    'Dapatkan pengalaman praktis dari perusahaan ternama Indonesia yeahh..',
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: '▌'
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

            {/* CTA Button */}
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
  );
};

export default Header;