const API_BASE_URL = 'https://maganghub.kemnaker.go.id/be/v1/api';

export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistik_front_page`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};