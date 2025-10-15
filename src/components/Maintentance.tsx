import { useState, useEffect } from 'react';

const Maintenance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCopied, setIsCopied] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Trigger animations
    setTimeout(() => setAnimate(true), 100);
    
    // Animate progress bar
    const progressTimer = setTimeout(() => {
      setProgress(85);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(progressTimer);
    };
  }, []);

  const contactEmail = 'support@maganghub.com';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const openEmail = () => {
    const subject = encodeURIComponent('Pertanyaan tentang Website Maintenance');
    const body = encodeURIComponent('Halo,\n\nSaya ingin bertanya tentang website MagangHub yang sedang maintenance.\n\nTerima kasih.');
    window.open(`mailto:${contactEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full mix-blend-screen filter blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full mix-blend-screen filter blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full mix-blend-screen filter blur-2xl animate-float-fast"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,white_50%,transparent_100%)] animate-shimmer"></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float-random"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl w-full max-w-md transform transition-all duration-1000 ${
        animate ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
      }`}>
        
        {/* Animated Border Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur opacity-30 animate-pulse-slow"></div>
        
        {/* Content */}
        <div className="relative">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Animated Main Icon */}
            <div className="relative mb-6">
              <div className="relative inline-block">
                {/* Outer Glow */}
                <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-ping-slow"></div>
                
                {/* Main Icon Container */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                  <svg 
                    className="w-12 h-12 text-white drop-shadow-lg" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                
                {/* Floating Gears */}
                <div className="absolute -top-2 -right-2 w-10 h-10 text-yellow-300 animate-spin-slow">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04.32.07.64.07.97c0 2.12-.74 4.07-1.97 5.61l1.42 1.42c1.51-1.89 2.42-4.28 2.42-6.88c0-.76-.09-1.5-.25-2.21l-1.69 1.09m-14.86 0l-1.69-1.09C3.09 11.5 3 12.24 3 13c0 2.6.91 4.99 2.42 6.88l1.42-1.42A7.902 7.902 0 0 1 5 13c0-.33.03-.65.07-.97l1.5.97M12 6.5c1.38 0 2.5 1.12 2.5 2.5c0 .41-.11.79-.28 1.12l2.95 1.91c.31-.97.49-2 .49-3.03c0-3.28-2.14-6.07-5.12-7.06l-.54 3.19c.33-.05.67-.08 1-.08m-2.5 2.5c0-.41.11-.79.28-1.12L6.83 5.97c-.31.97-.49 2-.49 3.03c0 3.28 2.14 6.07 5.12 7.06l.54-3.19c-.33.05-.67.08-1 .08a2.5 2.5 0 0 1-2.5-2.5z"/>
                  </svg>
                </div>
                
                <div className="absolute -bottom-2 -left-2 w-8 h-8 text-orange-300 animate-spin-reverse-slow">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04.32.07.64.07.97c0 2.12-.74 4.07-1.97 5.61l1.42 1.42c1.51-1.89 2.42-4.28 2.42-6.88c0-.76-.09-1.5-.25-2.21l-1.69 1.09m-14.86 0l-1.69-1.09C3.09 11.5 3 12.24 3 13c0 2.6.91 4.99 2.42 6.88l1.42-1.42A7.902 7.902 0 0 1 5 13c0-.33.03-.65.07-.97l1.5.97M12 6.5c1.38 0 2.5 1.12 2.5 2.5c0 .41-.11.79-.28 1.12l2.95 1.91c.31-.97.49-2 .49-3.03c0-3.28-2.14-6.07-5.12-7.06l-.54 3.19c.33-.05.67-.08 1-.08m-2.5 2.5c0-.41.11-.79.28-1.12L6.83 5.97c-.31.97-.49 2-.49 3.03c0 3.28 2.14 6.07 5.12 7.06l.54-3.19c-.33.05-.67.08-1 .08a2.5 2.5 0 0 1-2.5-2.5z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Title with Gradient Text */}
            <h1 className="text-3xl font-bold text-white mb-3">
              Sedang Dalam
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x mt-2">
                Pemeliharaan
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Kami sedang melakukan upgrade sistem untuk memberikan pengalaman yang lebih baik dan fitur yang lebih lengkap.
            </p>
          </div>

          {/* Batch 2 Announcement */}
          <div className="relative mb-6">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div>
                  <div className="text-yellow-300 font-bold text-lg">Sampai Jumpa di Batch 2! <br /> (kalo ada😜)</div>
                  <div className="text-yellow-200/80 text-sm">Stay tuned for amazing updates</div>
                </div>
              </div>
            </div>
            
            {/* Floating Stars */}
            <div className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-bounce">
              ⭐
            </div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 text-yellow-200 animate-bounce delay-1000">
              ✨
            </div>
          </div>

          {/* Live Time Display */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 transform transition-all duration-500 hover:bg-white/10">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-400 text-sm">
                {formatDate(currentTime)}
              </div>
            </div>
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-green-400 text-sm font-medium">Live Updates</span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20 mb-6 transform transition-all duration-500 hover:shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 text-center flex items-center justify-center space-x-2">
              <span className="text-xl">📧</span>
              <span>Hubungi Kami</span>
            </h3>
            
            <p className="text-gray-300 text-center text-sm mb-4">
              Butuh bantuan? Hubungi tim support kami
            </p>
            
            {/* Email Card */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4 transform transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-mono text-sm md:text-base truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {contactEmail}
                  </div>
                  <div className="text-gray-400 text-xs">Email Support Team</div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(contactEmail)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{isCopied ? 'Tersalin! 🎉' : 'Salin'}</span>
                </button>
                
                <button
                  onClick={openEmail}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Kirim Email</span>
                </button>
              </div>
            </div>

            <p className="text-gray-400 text-xs text-center">
              Tim support akan membalas dalam 1x24 jam
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
              <span>Progress Update Sistem</span>
              <span className="font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-2000 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent to-white/20 rounded-full animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Terima kasih atas kesabaran dan dukungannya! 🙏
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;