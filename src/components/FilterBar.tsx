import React, { useState, useEffect } from 'react';

const FilterBar = ({ filters, onFilterChange, loading, fetchProgress }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const provinces = [
  { code: '11', name: 'ACEH' },
  { code: '12', name: 'SUMATERA UTARA' },
  { code: '13', name: 'SUMATERA BARAT' },
  { code: '14', name: 'RIAU' },
  { code: '15', name: 'JAMBI' },
  { code: '16', name: 'SUMATERA SELATAN' },
  { code: '17', name: 'BENGKULU' },
  { code: '18', name: 'LAMPUNG' },
  { code: '19', name: 'KEPULAUAN BANGKA BELITUNG' },
  { code: '21', name: 'KEPULAUAN RIAU' },
  { code: '31', name: 'DKI JAKARTA' },
  { code: '32', name: 'JAWA BARAT' },
  { code: '33', name: 'JAWA TENGAH' },
  { code: '34', name: 'DI YOGYAKARTA' },
  { code: '35', name: 'JAWA TIMUR' },
  { code: '36', name: 'BANTEN' },
  { code: '51', name: 'BALI' },
  { code: '52', name: 'NUSA TENGGARA BARAT' },
  { code: '53', name: 'NUSA TENGGARA TIMUR' },
  { code: '61', name: 'KALIMANTAN BARAT' },
  { code: '62', name: 'KALIMANTAN TENGAH' },
  { code: '63', name: 'KALIMANTAN SELATAN' },
  { code: '64', name: 'KALIMANTAN TIMUR' },
  { code: '65', name: 'KALIMANTAN UTARA' },
  { code: '71', name: 'SULAWESI UTARA' },
  { code: '72', name: 'SULAWESI TENGAH' },
  { code: '73', name: 'SULAWESI SELATAN' },
  { code: '74', name: 'SULAWESI TENGGARA' },
  { code: '75', name: 'GORONTALO' },
  { code: '76', name: 'SULAWESI BARAT' },
  { code: '81', name: 'MALUKU' },
  { code: '82', name: 'MALUKU UTARA' },
  { code: '91', name: 'PAPUA' },
  { code: '92', name: 'PAPUA BARAT' },
  { code: '93', name: 'PAPUA SELATAN' },
  { code: '94', name: 'PAPUA TENGAH' },
  { code: '95', name: 'PAPUA PEGUNUNGAN' },
];


  const handleProgramStudiChange = (e) => {
    const newFilters = { ...localFilters, programStudi: e.target.value };
    setLocalFilters(newFilters);
  };

  const handleJabatanChange = (e) => {
    const newFilters = { ...localFilters, jabatan: e.target.value };
    setLocalFilters(newFilters);
  };

  const handleProvinsiChange = (e) => {
    const newFilters = { ...localFilters, provinsi: e.target.value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { programStudi: '', jabatan: '', provinsi: '32' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localFilters.programStudi !== filters.programStudi || localFilters.jabatan !== filters.jabatan) {
        onFilterChange(localFilters);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters.programStudi, localFilters.jabatan]);

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filter Lowongan</h3>
        <button
          onClick={handleReset}
          disabled={fetchProgress.isFetchingAll}
          className="btn-secondary text-sm"
        >
          Reset Filter
        </button>
      </div>
      
      {/* Progress Bar */}
      {fetchProgress.isFetchingAll && (
        <div className="mb-6 p-4 bg-primary-50 rounded border border-primary-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary-900">
              Mengambil data lowongan...
            </span>
            <span className="text-sm text-primary-700 font-semibold">
              {fetchProgress.current} / {fetchProgress.total} halaman
            </span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div 
              className="bg-primary-900 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(fetchProgress.current / fetchProgress.total) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Program Studi
          </label>
          <input
            type="text"
            value={localFilters.programStudi}
            onChange={handleProgramStudiChange}
            placeholder="Cari program studi..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={fetchProgress.isFetchingAll}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Posisi / Jabatan
          </label>
          <input
            type="text"
            value={localFilters.jabatan}
            onChange={handleJabatanChange}
            placeholder="Cari posisi..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={fetchProgress.isFetchingAll}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Provinsi
          </label>
          <select
            value={localFilters.provinsi}
            onChange={handleProvinsiChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            disabled={fetchProgress.isFetchingAll}
          >
            {provinces.map(province => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;