import { useState, useEffect } from 'react';

interface TimelineData {
  data: {
    id_jadwal: string;
    timeline_id: string;
    angkatan: string;
    tanggal_batas_pendaftaran: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    tahun: string;
    tanggal_rencana_mulai: string;
    tanggal_rencana_akhir: string;
    tanggal_seleksi_mulai: string;
    tanggal_seleksi_akhir: string;
    tanggal_usulan_mulai: string;
    tanggal_usulan_akhir: string;
    tanggal_persetujuan_awal: string;
    tanggal_persetujuan_akhir: string;
    tanggal_pendaftaran_awal: string;
    tanggal_pendaftaran_akhir: string;
    tanggal_pengumuman_mulai: string;
    tanggal_pengumuman_akhir: string;
    tanggal_lulus_awal: string;
    tanggal_lulus_akhir: string;
    publish: number;
    limit_kuota_perusahaan: number;
    limit_kuota_overall: number;
    ditetapkan: boolean;
    timeline: {
      id: string;
      name: string;
      schedules: Array<{
        title: string;
        started_at: string;
        finished_at: string;
        icon: string;
      }>;
      created_at: string;
      updated_at: string;
      announcement: string | null;
      alert: {
        type: string;
        message: string;
      };
    };
  };
}

const Timeline = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    setTimeout(() => setAnimate(true), 100);
    fetchTimelineData();

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const fetchTimelineData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://maganghub.kemnaker.go.id/be/v1/api/timeline');
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      
      const data: TimelineData = await response.json();
      setTimelineData(data);
      
      const currentPhaseIndex = getCurrentPhaseIndex(data);
      setActivePhase(currentPhaseIndex);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPhaseIndex = (data: TimelineData): number => {
    const now = new Date();
    const schedules = data.data.timeline.schedules;

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const start = new Date(schedule.started_at);
      const end = new Date(schedule.finished_at);

      if (now >= start && now <= end) {
        return i;
      }
    }

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      const start = new Date(schedule.started_at);
      if (now < start) return i;
    }

    return schedules.length - 1;
  };

  const getPhaseStatus = (schedule: any, index: number) => {
    const now = new Date();
    const start = new Date(schedule.started_at);
    const end = new Date(schedule.finished_at);

    if (now >= start && now <= end) return 'active';
    if (now < start) return 'upcoming';
    return 'completed';
  };

  const getIconComponent = (iconName: string, status: string) => {
    const baseClasses = "w-6 h-6 md:w-8 md:h-8 transition-all duration-500";
    
    const icons = {
      'tabler-send-2': (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      'tabler-list-check': (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      'tabler-briefcase-2': (
        <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    };

    return icons[iconName as keyof typeof icons] || (
      <svg className={baseClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      });
    }
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeRange = (startString: string, endString: string) => {
    const start = new Date(startString);
    const end = new Date(endString);
    
    // Hilangkan 00:00 - 23:59
    const startTime = start.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const endTime = end.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    // Jika waktu adalah 00:00 - 23:59, jangan tampilkan
    if (startTime === '00.00' && endTime === '23.59') {
      return null;
    }

    // Jika hanya tanggal yang berbeda, tapi waktu sama, tampilkan sekali
    if (startTime === endTime) {
      return startTime;
    }

    return `${startTime} - ${endTime}`;
  };

  const calculateProgress = (schedule: any) => {
    const now = new Date();
    const start = new Date(schedule.started_at);
    const end = new Date(schedule.finished_at);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, (elapsed / totalDuration) * 100);
  };

  const getDaysRemaining = (schedule: any) => {
    const now = new Date();
    const start = new Date(schedule.started_at);
    const end = new Date(schedule.finished_at);
    
    if (now < start) {
      const diff = start.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } else if (now > end) {
      return 0;
    } else {
      const diff = end.getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin mx-auto mb-4" style={{ animationDelay: '0.1s' }}></div>
          </div>
          <div className="text-white text-lg font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Memuat Timeline Magang...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="text-center text-white max-w-md mx-auto">
          <div className="text-6xl mb-4">🚧</div>
          <div className="text-xl mb-2 font-light">Gagal Memuat Timeline</div>
          <div className="text-gray-300 mb-6">{error}</div>
          <button 
            onClick={fetchTimelineData}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-orb-float-1"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-orb-float-2"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl animate-orb-float-3"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow"></div>
        </div>

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-element"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className={`relative w-full max-w-6xl mx-auto transform transition-all duration-1000 ${
        animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        
        {/* Enhanced Header */}
        <div className="text-center mb-12 px-4">
          <div className="inline-flex items-center justify-center mb-6 relative">
            {/* Animated Orb Behind Icon */}
            <div className="absolute -inset-6 bg-blue-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
            
            {/* Main Icon */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:rotate-12 hover:scale-110">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              Live
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Timeline Magang
            <span className="block text-xl md:text-2xl lg:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x mt-2">
              Batch {timelineData?.data.angkatan} • {timelineData?.data.tahun}
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Ikuti setiap tahapan dengan seksama untuk keberhasilan program magang nasional
          </p>
        </div>

        {/* Enhanced Alert Banner */}
        {timelineData?.data.timeline.alert && (
          <div className="mb-8 mx-auto max-w-4xl px-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-4 md:p-6 backdrop-blur-xl transform transition-all duration-500 hover:scale-[1.02] group">
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base md:text-lg mb-1">Informasi Penting</h3>
                  <p className="text-blue-100 leading-relaxed text-sm md:text-base">
                    {timelineData.data.timeline.alert.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Timeline Container */}
        <div className="relative max-w-4xl mx-auto px-4">
          {/* Main Timeline Line - Responsive */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full shadow-2xl z-0"></div>
          )}
          
          {/* Timeline Phases */}
          <div className="space-y-8 md:space-y-12">
            {timelineData?.data.timeline.schedules.map((schedule, index) => {
              const status = getPhaseStatus(schedule, index);
              const progress = calculateProgress(schedule);
              const daysRemaining = getDaysRemaining(schedule);
              const isActive = status === 'active';
              const isCompleted = status === 'completed';
              const isUpcoming = status === 'upcoming';
              const timeRange = formatTimeRange(schedule.started_at, schedule.finished_at);

              return (
                <div
                  key={index}
                  className={`relative flex ${isMobile ? 'flex-col' : 'items-center justify-between'} ${
                    !isMobile && (index % 2 === 0 ? 'flex-row' : 'flex-row-reverse')
                  } transform transition-all duration-700 group`}
                  onMouseEnter={() => !isMobile && setActivePhase(index)}
                  onMouseLeave={() => !isMobile && setActivePhase(getCurrentPhaseIndex(timelineData!))}
                >
                  {/* Content Card - Enhanced */}
                  <div className={`${isMobile ? 'w-full order-2' : 'w-5/12'} ${
                    !isMobile && (index % 2 === 0 ? 'pr-6 md:pr-8' : 'pl-6 md:pl-8')
                  }`}>
                    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border-2 transition-all duration-500 group-hover:shadow-2xl ${
                      isActive 
                        ? 'border-green-500 shadow-lg shadow-green-500/20' 
                        : isCompleted
                        ? 'border-gray-500/50 shadow-lg'
                        : 'border-blue-500/50 shadow-lg'
                    } ${!isMobile && activePhase === index ? 'scale-105 z-10' : ''}`}>
                      
                      {/* Enhanced Phase Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse ${
                            isActive ? 'bg-green-500' : isCompleted ? 'bg-gray-500' : 'bg-blue-500'
                          }`}></div>
                          <span className={`text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full ${
                            isActive 
                              ? 'bg-green-500/20 text-green-300' 
                              : isCompleted
                              ? 'bg-gray-500/20 text-gray-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            Tahap {index + 1}
                          </span>
                        </div>
                        <div className={`text-xs font-semibold px-2 py-1 rounded ${
                          isActive 
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                            : isCompleted
                            ? 'bg-gray-500 text-white'
                            : 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        }`}>
                          {isActive ? 'BERJALAN' : isCompleted ? 'SELESAI' : 'MENUNGGU'}
                        </div>
                      </div>

                      {/* Enhanced Title */}
                      <h3 className={`text-lg md:text-xl font-bold mb-3 leading-tight ${
                        isActive ? 'text-white' : 'text-gray-200'
                      }`}>
                        {schedule.title}
                      </h3>

                      {/* Enhanced Date & Time */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs md:text-sm">
                            {formatDate(schedule.started_at)} - {formatDate(schedule.finished_at)}
                          </span>
                        </div>
                        
                        {/* Time Range - Only show if not 00:00-23:59 */}
                        {timeRange && (
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs md:text-sm">{timeRange}</span>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Progress & Days Info */}
                      <div className="space-y-3">
                        {isActive && (
                          <>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <span>Progress</span>
                              <span className="font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full animate-shimmer-fast"></div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Days Remaining */}
                        {(isActive || isUpcoming) && daysRemaining > 0 && (
                          <div className={`flex items-center space-x-2 text-xs ${
                            isActive ? 'text-green-300' : 'text-blue-300'
                          }`}>
                            <span className="text-lg">
                              {isActive ? '⏳' : '📅'}
                            </span>
                            <span>
                              {isActive ? `${daysRemaining} hari lagi` : `Dimulai dalam ${daysRemaining} hari`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Message */}
                      <div className={`text-xs md:text-sm mt-3 font-medium ${
                        isActive ? 'text-green-300' : isCompleted ? 'text-gray-400' : 'text-blue-300'
                      }`}>
                        {isActive && '🚀 Sedang berlangsung - Segera selesaikan tugas!'}
                        {isCompleted && '✅ Tahapan telah selesai'}
                        {isUpcoming && '⏰ Menunggu waktu pelaksanaan'}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Timeline Node - Responsive */}
                  <div className={`${isMobile ? 'order-1 mb-4' : 'absolute left-1/2 transform -translate-x-1/2'} z-20`}>
                    <div className={`relative ${isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'} rounded-2xl border-4 backdrop-blur-xl transition-all duration-500 transform group-hover:scale-110 ${
                      isActive 
                        ? 'scale-110 border-green-500 bg-green-500/20 shadow-2xl shadow-green-500/30' 
                        : isCompleted
                        ? 'border-gray-500 bg-gray-500/20 shadow-lg'
                        : 'border-blue-500 bg-blue-500/20 shadow-lg'
                    } ${!isMobile && activePhase === index ? 'scale-125' : ''}`}>
                      
                      {/* Icon */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                        isActive ? 'text-green-300' : isCompleted ? 'text-gray-300' : 'text-blue-300'
                      }`}>
                        {getIconComponent(schedule.icon, status)}
                      </div>

                      {/* Enhanced Pulse Animation for Active Phase */}
                      {isActive && (
                        <>
                          <div className="absolute -inset-2 border-2 border-green-500 rounded-2xl animate-ping opacity-60"></div>
                          <div className="absolute -inset-3 border border-green-300 rounded-2xl animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
                        </>
                      )}

                      {/* Phase Number */}
                      <div className={`absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-green-500 text-white' : isCompleted ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Connector Lines */}
                  {isMobile && index < timelineData!.data.timeline.schedules.length - 1 && (
                    <div className="order-3 mt-4 mb-2 flex justify-center">
                      <div className={`w-1 h-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-500/30'
                      } rounded-full`}></div>
                    </div>
                  )}

                  {/* Desktop Connector Lines */}
                  {!isMobile && index < timelineData!.data.timeline.schedules.length - 1 && (
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-12 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-500/30'
                    } ${index % 2 === 0 ? 'top-full' : 'bottom-full'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Footer */}
        <div className="mt-12 md:mt-16 max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { value: timelineData?.data.limit_kuota_overall.toLocaleString(), label: 'Total Kuota', icon: '👥' },
              { value: timelineData?.data.limit_kuota_perusahaan, label: 'Kuota/Perusahaan', icon: '🏢' },
              { value: timelineData?.data.timeline.schedules.length, label: 'Total Tahapan', icon: '📊' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl group"
              >
                <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Live Time Display */}
        <div className="mt-8 text-center px-4">
          <div className="inline-flex items-center space-x-3 md:space-x-4 bg-white/5 backdrop-blur-xl rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-white/10 transform transition-all duration-500 hover:scale-105">
            <div className="text-xl md:text-2xl font-mono font-bold text-white">
              {currentTime.toLocaleTimeString('id-ID')}
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <div className="text-gray-300 text-sm md:text-base">
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes orb-float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(180deg) scale(1.1); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
          50% { transform: translateX(20px) translateY(-30px) scale(1.05); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.08); }
        }
        @keyframes float-element {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(5px, -10px) rotate(120deg) scale(1.1); }
          66% { transform: translate(-5px, -5px) rotate(240deg) scale(0.9); }
        }
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-orb-float-1 { animation: orb-float-1 15s ease-in-out infinite; }
        .animate-orb-float-2 { animation: orb-float-2 12s ease-in-out infinite; }
        .animate-orb-float-3 { animation: orb-float-3 10s ease-in-out infinite; }
        .animate-float-element { animation: float-element 20s ease-in-out infinite; }
        .animate-shimmer-slow { animation: shimmer-slow 8s ease-in-out infinite; }
        .animate-shimmer-fast { animation: shimmer-fast 2s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite; 
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Timeline;