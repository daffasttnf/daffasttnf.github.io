const DB_NAME = 'MagangHubCache';
const DB_VERSION = 1;
const STORE_NAME = 'provinceData';
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CachedProvinceData {
  provinceCode: string;
  data: any[];
  timestamp: number;
  totalPages: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'provinceCode' });
        }
      };
    });
  }

  async saveProvinceData(
    provinceCode: string,
    data: any[],
    totalPages: number
  ): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const cacheEntry: CachedProvinceData = {
        provinceCode,
        data,
        timestamp: Date.now(),
        totalPages,
      };

      const request = store.put(cacheEntry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error saving to cache');
    });
  }

  async getProvinceData(
    provinceCode: string
  ): Promise<{
    data: any[] | null;
    isFresh: boolean;
    timestamp: number | null;
    totalPages: number | null;
  }> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(provinceCode);

      request.onsuccess = () => {
        const result = request.result as CachedProvinceData;
        if (!result) {
          resolve({
            data: null,
            isFresh: false,
            timestamp: null,
            totalPages: null,
          });
          return;
        }

        const isFresh = Date.now() - result.timestamp < CACHE_DURATION_MS;
        resolve({
          data: result.data,
          isFresh,
          timestamp: result.timestamp,
          totalPages: result.totalPages,
        });
      };

      request.onerror = () => reject('Error reading from cache');
    });
  }

  async clearCache(): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Error clearing cache');
    });
  }
}

export const indexedDBService = new IndexedDBService();
