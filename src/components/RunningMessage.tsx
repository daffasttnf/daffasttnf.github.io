const RunningMessage = () => {
  const messages = [
    "Jangan mentok, magang dulu! Pengalaman nambah, CV makin kece",
    "Dari magang biasa jadi extraordinary! Your future starts here",
    "Upgrade skillmu, jangan cuma scroll TikTok mulu!",
    "Daripada gabut, mending magang! Build your portfolio now",
    "Pengalaman > IPK. Yuk, mulai karirmu dari sini!",
    "Jangan takut salah, yang penting start! Magang itu learning process",
    "Your dream career starts with one internship!",
    "Jangan cuma jadi penonton, jadi pemain! Start your internship journey"
  ];

  return (
    <div className="bg-gradient-to-r from-primary-900 via-purple-900 to-primary-900 py-3 overflow-hidden relative group">
      {/* Gradient Overlay */}
      <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-primary-900 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-primary-900 to-transparent z-10"></div>
      
      {/* Marquee Container */}
      <div className="flex whitespace-nowrap">
        {/* First Set */}
        <div className="flex animate-marquee-infinite group-hover:[animation-play-state:paused]">
          {messages.map((message, index) => (
            <div key={`first-${index}`} className="flex items-center mx-4 flex-shrink-0">
              <span className="text-white/90 text-sm font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                {message}
              </span>
              {/* Animated dot separator */}
              <div className="w-1 h-1 bg-white/30 rounded-full mx-3 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Second Set (Duplicate for seamless loop) */}
        <div className="flex animate-marquee-infinite group-hover:[animation-play-state:paused]" aria-hidden="true">
          {messages.map((message, index) => (
            <div key={`second-${index}`} className="flex items-center mx-4 flex-shrink-0">
              <span className="text-white/90 text-sm font-medium bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                {message}
              </span>
              {/* Animated dot separator */}
              <div className="w-1 h-1 bg-white/30 rounded-full mx-3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunningMessage;