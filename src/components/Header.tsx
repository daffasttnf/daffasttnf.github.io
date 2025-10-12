import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import CountUp from "react-countup";
import { useJobs } from "../hooks/useJobs";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { stats, statsLoading } = useJobs();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Text rotation untuk subheading
  const subheadings = [
    "Cari magang atau cari jodoh? Why not both? 💘",
    "Your career love story starts here! 🌟", 
    "Bukan PDKT, tapi Professional Development & Karier Transformation! ⚡",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % subheadings.length);
    }, 4000);
    return () => clearInterval(interval);
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

  // Variants untuk animasi dengan tipe yang spesifik
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-3, 5, -3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <header
      ref={headerRef}
      className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 text-white overflow-hidden min-h-screen flex items-center py-8"
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/90 to-purple-900/80"></div>
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-purple-500/10 to-cyan-400/10"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        {/* Moving Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"
          style={{
            animation: 'gridMove 20s linear infinite'
          }}
        />

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-amber-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1
          }}
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 
                ? 'bg-amber-300/15 w-1 h-1'
                : i % 4 === 1
                ? 'bg-purple-300/15 w-0.5 h-0.5'
                : i % 4 === 2
                ? 'bg-cyan-300/15 w-0.5 h-0.5'
                : 'bg-white/5 w-0.5 h-0.5'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 15],
              y: [0, (Math.random() - 0.5) * 15],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Animated Waves */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/5 to-transparent"
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 w-full py-8">
        <motion.div
          className="max-w-4xl lg:max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="text-center">
            {/* Animated Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-4 sm:mb-6 border border-white/20 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span
                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-medium text-white/90">
                {statsLoading
                  ? "✨ Memuat data..."
                  : `✨ ${
                      stats ? formatNumber(stats["Jumlah Lowongan"]) : "1.450"
                    }+ Lowongan Magang Tersedia`}
              </span>
            </motion.div>

            {/* Main Heading - OPTIMIZED FOR ALL SCREENS */}
            <motion.div
              variants={itemVariants}
              className="mb-6 sm:mb-8"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  {/* First Line: Temukan [Changing Word] */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2">
                    <motion.span
                      className="whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Temukan
                    </motion.span>
                    
                    <motion.span
                      className="min-w-[120px] sm:min-w-[140px] md:min-w-[160px] text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl relative"
                      variants={floatingVariants}
                      animate="float"
                    >
                      <Typewriter
                        options={{
                          strings: [
                            '<span style="color: #fca5a5; text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 2px;">Pasangan</span>',
                            '<span style="background: linear-gradient(to right, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Magang</span>'
                          ],
                          autoStart: true,
                          loop: true,
                          delay: 80,
                          deleteSpeed: 50,
                          cursor: "|",
                          cursorClassName: "Typewriter__cursor text-amber-300 ml-1 text-inherit",
                        }}
                        onInit={(typewriter) => {
                          typewriter
                            .changeDelay(80)
                            .typeString('<span style="color: #fca5a5; text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 2px;">Pasangan</span>')
                            .pauseFor(2000)
                            .deleteChars(8)
                            .pauseFor(300)
                            .typeString('<span style="background: linear-gradient(to right, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Magang</span>')
                            .pauseFor(2000)
                            .deleteChars(6)
                            .pauseFor(300)
                            .start();
                        }}
                      />
                      {/* Gradient Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 to-yellow-400/20 blur-lg rounded-full -z-10 scale-110"></div>
                    </motion.span>
                  </div>
                  
                  {/* Second Line: Impian Anda */}
                  <motion.div
                    className="whitespace-nowrap text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    Impian Anda
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Animated Subheading */}
            <motion.div
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 h-12 sm:h-16 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-base sm:text-lg md:text-xl"
                >
                  {subheadings[currentTextIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Animated Stats - OPTIMIZED FOR MOBILE */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-6 sm:mb-8 px-2"
            >
              {[
                { 
                  key: "Jumlah Lowongan", 
                  label: "Lowongan Aktif", 
                  value: stats?.["Jumlah Lowongan"] || 1450,
                  color: "from-blue-400 to-cyan-400"
                },
                { 
                  key: "Jumlah Perusahaan", 
                  label: "Perusahaan", 
                  value: stats?.["Jumlah Perusahaan"] || 1003,
                  color: "from-purple-400 to-pink-400"
                },
                { 
                  key: "Jumlah Pendaftar Magang", 
                  label: "Pendaftar", 
                  value: stats?.["Jumlah Pendaftar Magang"] || 157837,
                  color: "from-green-400 to-emerald-400"
                },
                { 
                  key: "Jumlah Peserta Magang", 
                  label: "Peserta Magang", 
                  value: stats?.["Jumlah Peserta Magang"] || 0,
                  color: "from-orange-400 to-red-400"
                }
              ].map((stat) => (
                <motion.div
                  key={stat.key}
                  variants={itemVariants}
                  className="text-center bg-white/5 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105 cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Animated Border */}
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className="absolute inset-[1px] rounded-lg sm:rounded-xl bg-primary-900/90"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                      {statsLoading ? (
                        <motion.div
                          className="inline-block w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : isVisible ? (
                        <CountUp
                          end={stat.value}
                          duration={2.5}
                          separator="."
                          useEasing={true}
                          enableScrollSpy={true}
                          scrollSpyOnce={true}
                          className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                        />
                      ) : (
                        "0"
                      )}
                    </div>
                    <div className="text-primary-100 text-xs sm:text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button - OPTIMIZED FOR MOBILE */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2"
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("filter-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="relative bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-primary-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-primary-900 transition-all duration-300 shadow-lg flex items-center w-full sm:w-auto justify-center overflow-hidden group"
                whileHover={{ 
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 group-hover:from-amber-500 group-hover:via-orange-600 group-hover:to-amber-600 transition-all duration-1000" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Pulsing Ring */}
                <motion.div
                  className="absolute inset-0 rounded-xl border border-amber-300/50"
                  animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

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
                <span className="relative z-10 font-bold">Cari Magang Sekarang</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;