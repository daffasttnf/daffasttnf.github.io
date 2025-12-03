import React, { useState, useEffect } from 'react';
import { exportService } from '../services/exportService';

interface ExportSectionProps {
  allJobs: any[];
  onSaveJobs?: (jobs: any[]) => void;
  provinceName?: string;
}

const ExportSection: React.FC<ExportSectionProps> = ({ allJobs, onSaveJobs, provinceName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<any>(null);
  const [dbSize, setDbSize] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadExportInfo();
  }, []);

  const loadExportInfo = async () => {
    try {
      await exportService.init();
      const lastExportHistory = await exportService.getLastExportHistory();
      setLastExport(lastExportHistory);

      const size = await exportService.getDatabaseSize();
      setDbSize(size);
    } catch (error) {
      console.error('Error loading export info:', error);
    }
  };

  const handleExport = async () => {
    if (allJobs.length === 0) {
      alert('Tidak ada data lowongan untuk di-export');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Simulasi progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simpan jobs untuk export cepat di masa depan
      if (onSaveJobs) {
        onSaveJobs(allJobs);
      }

      // Export ke Excel
      const date = new Date().toISOString().split('T')[0];
      const safeProvinceName = provinceName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Semua_Provinsi';
      const filename = `Lowongan_Magang_${safeProvinceName}_${date}.xlsx`;

      await exportService.exportAllJobsToExcel(allJobs, filename);

      setProgress(100);

      // Update info setelah export
      setTimeout(() => {
        loadExportInfo();
        setIsExporting(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal mengexport data. Silakan coba lagi.');
      setIsExporting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Info Section */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data Lowongan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Total Data:</span>
              <span className="font-semibold text-gray-900">{allJobs.length.toLocaleString()} lowongan</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Database:</span>
              <span className="font-semibold text-gray-900">{formatFileSize(dbSize)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Terakhir Export:</span>
              <span className="font-semibold text-gray-900">
                {lastExport ? formatDate(lastExport.timestamp) : 'Belum pernah'}
              </span>
            </div>
          </div>

          {lastExport && (
            <div className="mt-2 text-xs text-gray-500">
              File: <span className="font-mono">{lastExport.filename}</span>
              • {lastExport.totalJobs.toLocaleString()} data
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleExport}
            disabled={isExporting || allJobs.length === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center space-x-2 min-w-[140px] justify-center"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Excel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isExporting && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Mempersiapkan file Excel...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Info Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <strong>Tips:</strong> Data yang diexport adalah data dari <strong>{provinceName || 'Semua Provinsi'}</strong> yang sedang Anda pilih.
            File akan dinamai sesuai provinsi tersebut agar mudah dikelola.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;