import { utils, write } from 'xlsx';

const DB_NAME = 'MagangHubExportDB';
const DB_VERSION = 1;
const STORE_EXPORTS = 'exports';
const STORE_JOBS = 'jobs_export';

export class ExportService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store untuk history export
        if (!db.objectStoreNames.contains(STORE_EXPORTS)) {
          const exportsStore = db.createObjectStore(STORE_EXPORTS, { keyPath: 'id', autoIncrement: true });
          exportsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store untuk cache jobs (untuk export cepat)
        if (!db.objectStoreNames.contains(STORE_JOBS)) {
          const jobsStore = db.createObjectStore(STORE_JOBS, { keyPath: 'id_posisi' });
          jobsStore.createIndex('provinsi', 'provinsi', { unique: false });
          jobsStore.createIndex('last_updated', 'last_updated', { unique: false });
        }
      };
    });
  }

  // Simpan data jobs untuk export cepat
  async saveJobsForExport(provinceCode: string, jobs: any[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_JOBS], 'readwrite');
      const store = transaction.objectStore(STORE_JOBS);

      // Hapus jobs lama untuk provinsi ini
      const clearRequest = store.index('provinsi').openCursor(IDBKeyRange.only(provinceCode));

      clearRequest.onsuccess = () => {
        const cursor = clearRequest.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          // Simpan jobs baru
          const timestamp = Date.now();
          jobs.forEach(job => {
            store.put({
              ...job,
              provinsi: provinceCode,
              last_updated: timestamp
            });
          });
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Ambil semua jobs untuk export
  async getAllJobsForExport(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_JOBS], 'readonly');
      const store = transaction.objectStore(STORE_JOBS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Simpan history export
  async saveExportHistory(exportData: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_EXPORTS], 'readwrite');
      const store = transaction.objectStore(STORE_EXPORTS);

      const historyRecord = {
        ...exportData,
        timestamp: Date.now(),
        date: new Date().toISOString()
      };

      store.add(historyRecord);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Ambil history export terakhir
  async getLastExportHistory(): Promise<any> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_EXPORTS], 'readonly');
      const store = transaction.objectStore(STORE_EXPORTS);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev'); // Ambil yang terbaru

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Format data untuk Excel
  formatJobsForExcel(jobs: any[]): any[] {
    return jobs.map(job => {
      // Parse program studi
      let programStudi = '';
      try {
        const psList = JSON.parse(job.program_studi || '[]');
        programStudi = psList.map((ps: any) => ps.title).join(', ');
      } catch {
        programStudi = job.program_studi || '';
      }

      // Parse jenjang
      let jenjang = '';
      try {
        const jList = JSON.parse(job.jenjang || '[]');
        jenjang = jList.join(', ');
      } catch {
        jenjang = job.jenjang || '';
      }

      // Generate link lowongan
      const jobLink = `https://maganghub.kemnaker.go.id/lowongan/view/${job.id_posisi}`;

      return {
        'ID Posisi': job.id_posisi,
        'Posisi': job.posisi,
        'Perusahaan': job.perusahaan.nama_perusahaan,
        'Alamat Perusahaan': job.perusahaan.alamat,
        'Kota/Kabupaten': job.perusahaan.nama_kabupaten,
        'Provinsi': job.perusahaan.nama_provinsi,
        'Program Studi': programStudi,
        'Jenjang Pendidikan': jenjang,
        'Kuota': job.jumlah_kuota,
        'Terdaftar': job.jumlah_terdaftar,
        'Status': job.ref_status_posisi.nama_status_posisi,
        'Tanggal Mulai': job.jadwal.tanggal_mulai ? new Date(job.jadwal.tanggal_mulai).toLocaleDateString('id-ID') : '',
        'Tanggal Selesai': job.jadwal.tanggal_selesai ? new Date(job.jadwal.tanggal_selesai).toLocaleDateString('id-ID') : '',
        'Batas Pendaftaran': job.jadwal.tanggal_batas_pendaftaran ? new Date(job.jadwal.tanggal_batas_pendaftaran).toLocaleDateString('id-ID') : '',
        'Deskripsi Pekerjaan': job.deskripsi_posisi || '',
        'Link Lowongan': jobLink // Kolom baru untuk link lowongan
      };
    });
  }

  // Generate Excel file
  generateExcelFile(jobs: any[]): Blob {
    const worksheet = utils.json_to_sheet(this.formatJobsForExcel(jobs));
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Lowongan Magang');

    // Set column widths (ditambah kolom untuk Link Lowongan)
    const colWidths = [
      { wch: 20 }, // ID Posisi
      { wch: 30 }, // Posisi
      { wch: 30 }, // Perusahaan
      { wch: 40 }, // Alamat
      { wch: 20 }, // Kota
      { wch: 15 }, // Provinsi
      { wch: 30 }, // Program Studi
      { wch: 20 }, // Jenjang
      { wch: 8 },  // Kuota
      { wch: 10 }, // Terdaftar
      { wch: 15 }, // Status
      { wch: 12 }, // Mulai
      { wch: 12 }, // Selesai
      { wch: 15 }, // Batas Daftar
      { wch: 50 }, // Deskripsi
      { wch: 60 }  // Link Lowongan (kolom baru)
    ];
    worksheet['!cols'] = colWidths;

    // Tambahkan hyperlink untuk kolom Link Lowongan
    const range = utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const linkCell = utils.encode_cell({ r: row, c: 15 }); // Kolom P (index 15)
      if (worksheet[linkCell]) {
        worksheet[linkCell].l = { Target: worksheet[linkCell].v };
        worksheet[linkCell].s = {
          font: { color: { rgb: '0563C1' }, underline: true },
          fill: { fgColor: { rgb: 'FFFFFF' } }
        };
      }
    }

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Download Excel
  downloadExcel(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export utama
  async exportAllJobsToExcel(jobs: any[], customFilename?: string): Promise<void> {
    try {
      const blob = this.generateExcelFile(jobs);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = customFilename || `lowongan-magang-${timestamp}.xlsx`;

      this.downloadExcel(blob, filename);

      // Simpan history
      await this.saveExportHistory({
        totalJobs: jobs.length,
        filename: filename,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }

  // Get database size
  async getDatabaseSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_JOBS, STORE_EXPORTS], 'readonly');
      let totalSize = 0;

      const jobsStore = transaction.objectStore(STORE_JOBS);
      const jobsRequest = jobsStore.getAll();

      jobsRequest.onsuccess = () => {
        const jobs = jobsRequest.result;
        totalSize += new Blob([JSON.stringify(jobs)]).size;

        const exportsStore = transaction.objectStore(STORE_EXPORTS);
        const exportsRequest = exportsStore.getAll();

        exportsRequest.onsuccess = () => {
          const exports = exportsRequest.result;
          totalSize += new Blob([JSON.stringify(exports)]).size;
          resolve(totalSize);
        };
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Method untuk mendapatkan link lowongan individual
  getJobLink(jobId: string | number): string {
    return `https://maganghub.kemnaker.go.id/lowongan/view/${jobId}`;
  }
}

export const exportService = new ExportService();