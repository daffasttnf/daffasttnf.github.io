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

export const fetchJobById = async (id: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/vacancies-aktif?keyword=${id}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job detail');
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching job detail:', error);
    throw error;
  }
};