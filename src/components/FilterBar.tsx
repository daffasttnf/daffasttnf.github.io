import { useState, useEffect } from "react";

interface FilterBarProps {
  filters: {
    programStudi: string;
    jabatan: string;
    provinsi: string;
  };
  onFilterChange: (filters: any) => void;
  loading: boolean;
  fetchProgress: {
    current: number;
    total: number;
    isFetchingAll: boolean;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  fetchProgress,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const provinces = [
    { code: "11", name: "ACEH" },
    { code: "12", name: "SUMATERA UTARA" },
    { code: "13", name: "SUMATERA BARAT" },
    { code: "14", name: "RIAU" },
    { code: "15", name: "JAMBI" },
    { code: "16", name: "SUMATERA SELATAN" },
    { code: "17", name: "BENGKULU" },
    { code: "18", name: "LAMPUNG" },
    { code: "19", name: "KEPULAUAN BANGKA BELITUNG" },
    { code: "21", name: "KEPULAUAN RIAU" },
    { code: "31", name: "DKI JAKARTA" },
    { code: "32", name: "JAWA BARAT" },
    { code: "33", name: "JAWA TENGAH" },
    { code: "34", name: "DI YOGYAKARTA" },
    { code: "35", name: "JAWA TIMUR" },
    { code: "36", name: "BANTEN" },
    { code: "51", name: "BALI" },
    { code: "52", name: "NUSA TENGGARA BARAT" },
    { code: "53", name: "NUSA TENGGARA TIMUR" },
    { code: "61", name: "KALIMANTAN BARAT" },
    { code: "62", name: "KALIMANTAN TENGAH" },
    { code: "63", name: "KALIMANTAN SELATAN" },
    { code: "64", name: "KALIMANTAN TIMUR" },
    { code: "65", name: "KALIMANTAN UTARA" },
    { code: "71", name: "SULAWESI UTARA" },
    { code: "72", name: "SULAWESI TENGAH" },
    { code: "73", name: "SULAWESI SELATAN" },
    { code: "74", name: "SULAWESI TENGGARA" },
    { code: "75", name: "GORONTALO" },
    { code: "76", name: "SULAWESI BARAT" },
    { code: "81", name: "MALUKU" },
    { code: "82", name: "MALUKU UTARA" },
    { code: "91", name: "PAPUA" },
    { code: "92", name: "PAPUA BARAT" },
    { code: "93", name: "PAPUA SELATAN" },
    { code: "94", name: "PAPUA TENGAH" },
    { code: "95", name: "PAPUA PEGUNUNGAN" },
  ];

  const handleProgramStudiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, programStudi: e.target.value };
    setLocalFilters(newFilters);
    // Langsung panggil onFilterChange untuk reset pagination
    onFilterChange(newFilters);
  };

  const handleJabatanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, jabatan: e.target.value };
    setLocalFilters(newFilters);
    // Langsung panggil onFilterChange untuk reset pagination
    onFilterChange(newFilters);
  };

  const handleProvinsiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...localFilters, provinsi: e.target.value };
    setLocalFilters(newFilters);
    // Langsung panggil onFilterChange untuk reset pagination
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = { programStudi: "", jabatan: "", provinsi: "32" };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Effect untuk sync localFilters dengan props filters (jika ada perubahan dari luar)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-900 to-purple-900 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Filter Lowongan</h3>
            <p className="text-sm text-gray-500 mt-1">
              Temukan magang yang sesuai dengan kriteria Anda
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={fetchProgress.isFetchingAll}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-300 w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Progress Bar */}
      {fetchProgress.isFetchingAll && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-900">
                Mengambil data lowongan...
              </span>
            </div>
            <span className="text-sm text-blue-700 font-bold bg-blue-100 px-3 py-1 rounded-full">
              {fetchProgress.current} / {fetchProgress.total} halaman
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{
                width: `${
                  (fetchProgress.current / fetchProgress.total) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Program Studi */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v6l9-5-9-5-9 5 9 5z"
              />
            </svg>
            <span>Program Studi</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.programStudi}
              onChange={handleProgramStudiChange}
              placeholder="isi program studi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
              disabled={fetchProgress.isFetchingAll}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-4 h-4"
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
            </div>
          </div>
        </div>

        {/* Posisi / Jabatan */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
            <span>Posisi / Jabatan</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.jabatan}
              onChange={handleJabatanChange}
              placeholder="Cari posisi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
              disabled={fetchProgress.isFetchingAll}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-4 h-4"
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
            </div>
          </div>
        </div>

        {/* Provinsi */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Provinsi</span>
          </label>
          <div className="relative">
            <select
              value={localFilters.provinsi}
              onChange={handleProvinsiChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white appearance-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
              disabled={fetchProgress.isFetchingAll}
            >
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;