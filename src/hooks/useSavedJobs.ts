import { useState, useEffect } from 'react';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);

  const loadJobs = () => {
    try {
      const jobs = JSON.parse(localStorage.getItem('magang_savedJobs') || '[]');
      setSavedJobs(jobs);
    } catch (e) {
      console.error('Error loading saved jobs:', e);
      setSavedJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();

    // Listen for storage events (in case updated from another tab/component)
    const handleStorageChange = () => loadJobs();
    window.addEventListener('savedJobsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('savedJobsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const saveJob = (job: any) => {
    try {
      const currentJobs = JSON.parse(localStorage.getItem('magang_savedJobs') || '[]');

      if (currentJobs.some((j: any) => j.id_posisi === job.id_posisi)) {
        return false; // Already saved
      }

      if (currentJobs.length >= 10) {
        alert('Maksimal 10 lowongan yang dapat disimpan.');
        return false;
      }

      const newJobs = [job, ...currentJobs];
      localStorage.setItem('magang_savedJobs', JSON.stringify(newJobs));
      setSavedJobs(newJobs);
      window.dispatchEvent(new Event('savedJobsUpdated'));
      return true;
    } catch (e) {
      console.error('Error saving job:', e);
      return false;
    }
  };

  const removeJob = (id: string) => {
    try {
      const currentJobs = JSON.parse(localStorage.getItem('magang_savedJobs') || '[]');
      const newJobs = currentJobs.filter((j: any) => j.id_posisi !== id);
      localStorage.setItem('magang_savedJobs', JSON.stringify(newJobs));
      setSavedJobs(newJobs);
      window.dispatchEvent(new Event('savedJobsUpdated'));
    } catch (e) {
      console.error('Error removing job:', e);
    }
  };

  const isJobSaved = (id: string) => {
    return savedJobs.some((j) => j.id_posisi === id);
  };

  return { savedJobs, saveJob, removeJob, isJobSaved };
};
