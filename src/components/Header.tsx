import { useJobs } from "../hooks/useJobs";

const Header = () => {
  const { stats } = useJobs();

  return (
    <header className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 overflow-hidden">
      {/* Aurora Gradient Blur Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-400/40 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-400/40 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[130px]"></div>
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-violet-300/25 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 lg:py-36 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100 shadow-sm mb-8 hover:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">
              Unofficial Platform Magang Kemnaker
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.15] tracking-tight px-4 sm:px-0">
            <span className="relative inline-block pb-2">
              Seamless Platform
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-purple-300/70 rounded-full -z-10"></div>
            </span>
            <br />
            <span className="text-gray-700">for Smarter</span>{" "}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Internships
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Optimize your workflow. Experience a seamless, more productive internship search journey.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center mb-6">
            <button
              onClick={() => {
                document.getElementById('filter-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Mulai Cari Magang
            </button>
          </div>

          {/* Small Text */}
          <p className="text-sm text-gray-500">
            Gratis 100% • Bergabung dengan ribuan pencari magang
          </p>

          {/* Stats Section */}
          <div className="mt-24 pt-12 border-t border-gray-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {stats?.["Jumlah Lowongan"]?.toLocaleString() || "1,200"}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Lowongan Aktif</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {stats?.["Jumlah Perusahaan"]?.toLocaleString() || "1,000"}+
                </div>
                <div className="text-sm text-gray-600 font-medium">Perusahaan</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  100%
                </div>
                <div className="text-sm text-gray-600 font-medium">Gratis</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  24/7
                </div>
                <div className="text-sm text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
