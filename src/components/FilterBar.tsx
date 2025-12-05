import React, { useState, useRef, useEffect } from "react";

interface Filters {
  programStudi: string;
  jabatan: string;
  provinsi: string;
  kota: string;
  perusahaan: string;
  jenjang: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  loading: boolean;
  fetchProgress: {
    current: number;
    total: number;
    isFetchingAll: boolean;
  };
  availableCities: string[];
  availableCompanies: string[];
  availableJenjang: string[];
}

// Komponen Searchable Dropdown yang reusable
interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left flex items-center justify-between transition-colors ${disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-900 hover:border-gray-400"
          } ${value ? "text-gray-900" : "text-gray-500"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""
            }`}
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
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Cari ${placeholder.toLowerCase()}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Tidak ada hasil ditemukan
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${value === option
                    ? "bg-blue-50 text-primary-900 font-medium"
                    : "text-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm break-words">{option}</span>
                    {value === option && (
                      <svg
                        className="w-4 h-4 text-primary-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  loading,
  fetchProgress,
  availableCities,
  availableCompanies,
  availableJenjang,
}) => {
  const handleProgramStudiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      programStudi: e.target.value,
    });
  };

  const handleJabatanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      jabatan: e.target.value,
    });
  };

  const handleProvinsiChange = (value: string) => {
    onFilterChange({
      ...filters,
      provinsi: value,
      kota: "",
      perusahaan: "",
    });
  };

  const handleKotaChange = (value: string) => {
    onFilterChange({
      ...filters,
      kota: value === "SEMUA KOTA" ? "" : value, // Jika "Semua" dipilih, set ke string kosong
      perusahaan: "", // Reset perusahaan ketika kota berubah
    });
  };
  const handlePerusahaanChange = (value: string) => {
    onFilterChange({
      ...filters,
      perusahaan: value === "Semua Perusahaan" ? "" : value,
    });
  };

  const handleJenjangChange = (value: string) => {
    onFilterChange({
      ...filters,
      jenjang: value === "Semua Jenjang" ? "" : value,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      programStudi: "",
      jabatan: "",
      provinsi: "ALL",
      kota: "",
      perusahaan: "",
      jenjang: "",
    });
  };

  const hasActiveFilters =
    filters.programStudi ||
    filters.jabatan ||
    filters.kota ||
    filters.perusahaan ||
    filters.jenjang ||
    filters.provinsi !== "ALL";

  // Data provinsi
  const provinsiOptions = [
    "Semua Provinsi",
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bengkulu",
    "Lampung",
    "Kepulauan Bangka Belitung",
    "Kepulauan Riau",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
    "Papua Barat Daya",
  ];

  const provinsiValues: { [key: string]: string } = {
    "Semua Provinsi": "ALL",
    Aceh: "11",
    "Sumatera Utara": "12",
    "Sumatera Barat": "13",
    Riau: "14",
    Jambi: "15",
    "Sumatera Selatan": "16",
    Bengkulu: "17",
    Lampung: "18",
    "Kepulauan Bangka Belitung": "19",
    "Kepulauan Riau": "21",
    "DKI Jakarta": "31",
    "Jawa Barat": "32",
    "Jawa Tengah": "33",
    "DI Yogyakarta": "34",
    "Jawa Timur": "35",
    Banten: "36",
    Bali: "51",
    "Nusa Tenggara Barat": "52",
    "Nusa Tenggara Timur": "53",
    "Kalimantan Barat": "61",
    "Kalimantan Tengah": "62",
    "Kalimantan Selatan": "63",
    "Kalimantan Timur": "64",
    "Kalimantan Utara": "65",
    "Sulawesi Utara": "71",
    "Sulawesi Tengah": "72",
    "Sulawesi Selatan": "73",
    "Sulawesi Tenggara": "74",
    Gorontalo: "75",
    "Sulawesi Barat": "76",
    Maluku: "81",
    "Maluku Utara": "82",
    Papua: "91",
    "Papua Barat": "92",
    "Papua Selatan": "94",
    "Papua Tengah": "95",
    "Papua Pegunungan": "96",
    "Papua Barat Daya": "97",
  };

  const getProvinsiName = (code: string) => {
    return (
      Object.keys(provinsiValues).find((key) => provinsiValues[key] === code) ||
      "Pilih Provinsi"
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
      {/* Progress Bar untuk Fetching Data */}
      {fetchProgress.isFetchingAll && (
        <div className="mb-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Mengambil data lowongan...</span>
            <span>
              {fetchProgress.current} / {fetchProgress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(fetchProgress.current / fetchProgress.total) * 100
                  }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Filter Program Studi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program Studi
          </label>
          <input
            type="text"
            value={filters.programStudi}
            onChange={handleProgramStudiChange}
            placeholder="Cari program studi..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            disabled={loading}
          />
        </div>

        {/* Filter Jabatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posisi/Jabatan
          </label>
          <input
            type="text"
            value={filters.jabatan}
            onChange={handleJabatanChange}
            placeholder="Cari posisi..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            disabled={loading}
          />
        </div>

        {/* Filter Provinsi - Searchable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provinsi
          </label>
          <SearchableDropdown
            value={getProvinsiName(filters.provinsi)}
            onChange={(value) => handleProvinsiChange(provinsiValues[value])}
            options={provinsiOptions}
            placeholder="Pilih Provinsi"
            disabled={loading}
          />
        </div>

        {/* Filter Kota - Searchable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kota/Kabupaten

          </label>
          <SearchableDropdown
            value={filters.kota}
            onChange={handleKotaChange}
            options={["SEMUA KOTA", ...availableCities]} // Tambahkan opsi "Semua"
            placeholder="SEMUA KOTA"
            disabled={loading || availableCities.length === 0}
          />
          {availableCities.length === 0 && !loading && (
            <p className="text-xs text-gray-500 mt-1">
              Pilih provinsi terlebih dahulu
            </p>
          )}
        </div>

        {/* Filter Perusahaan - Searchable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Perusahaan
            {availableCompanies.length > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({availableCompanies.length})
              </span>
            )}
          </label>
          <SearchableDropdown
            value={filters.perusahaan}
            onChange={handlePerusahaanChange}
            options={["Semua Perusahaan", ...availableCompanies]} // Tambahkan opsi "Semua"
            placeholder="Semua Perusahaan"
            disabled={
              loading ||
              availableCompanies.length === 0 ||
              filters.provinsi === "1"
            }
          />
          {filters.provinsi === "1" && !loading && (
            <p className="text-xs text-gray-500 mt-1">
              Pilih provinsi terlebih dahulu
            </p>
          )}
          {filters.provinsi !== "1" &&
            availableCompanies.length === 0 &&
            !loading && (
              <p className="text-xs text-gray-500 mt-1">
                {filters.kota
                  ? `Tidak ada perusahaan di ${filters.kota}`
                  : "Pilih kota untuk melihat perusahaan"}
              </p>
            )}
        </div>

        {/* Filter Jenjang - Searchable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenjang Pendidikan

          </label>
          <SearchableDropdown
            value={filters.jenjang}
            onChange={handleJenjangChange}
            options={["Semua Jenjang", ...availableJenjang]}
            placeholder="Semua Jenjang"
            disabled={loading || availableJenjang.length === 0 || filters.provinsi === "1"}
          />
          {filters.provinsi === "1" && !loading && (
            <p className="text-xs text-gray-500 mt-1">
              Pilih provinsi terlebih dahulu
            </p>
          )}
          {filters.provinsi !== "1" && availableJenjang.length === 0 && !loading && (
            <p className="text-xs text-gray-500 mt-1">
              Tidak ada data jenjang
            </p>
          )}
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2 transition-colors"
            disabled={loading}
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
      )}
    </div>
  );
};

export default FilterBar;
