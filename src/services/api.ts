const API_BASE_URL = 'https://maganghub.kemnaker.go.id/be/v1/api/list';

export const fetchJobs = async (page = 1, limit = 20, provinceCode = '32') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vacancies-aktif?order_direction=ASC&page=${page}&limit=${limit}&kode_provinsi=${provinceCode}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};