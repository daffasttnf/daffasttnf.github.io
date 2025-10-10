export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Hapus formatCompactNumber, kita pakai formatNumber saja