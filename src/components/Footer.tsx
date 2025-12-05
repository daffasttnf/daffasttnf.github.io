
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleIGClick = () => {
    window.open('https://instagram.com/dqffqriftm', '_blank');
  };

  const handleKemnakerClick = () => {
    window.open('https://maganghub.kemnaker.go.id/', '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Left Side - Kemnaker Data */}
          <div
            onClick={handleKemnakerClick}
            className="group cursor-pointer"
          >
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left flex-1">
                <div className="text-xs text-gray-400">Powered by</div>
                <div className="text-sm font-semibold text-white">
                  Maganghub Kemnaker
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="text-center flex flex-col justify-center">
            <div className="text-sm text-gray-400 mb-1">
              Built with 💜 by the community
            </div>
            <div className="text-sm text-gray-300 font-medium">
              © {currentYear} Explore Magang
            </div>
          </div>

          {/* Right Side - Author */}
          <div
            onClick={handleIGClick}
            className="group cursor-pointer"
          >
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 hover:from-purple-900/50 hover:to-indigo-900/50 rounded-xl border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-left flex-1">
                <div className="text-xs text-gray-400">Crafted by</div>
                <div className="text-sm font-semibold text-white">
                  Daffa Ariftama
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <svg className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center pt-8 border-t border-gray-800">
          <div className="text-sm text-gray-500">
            Leveling up internships, one connection at a time 🚀
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;