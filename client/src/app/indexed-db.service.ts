import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBDatabase | undefined;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    const request = indexedDB.open('profileDB', 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };

    request.onsuccess = (event) => {
      this.db = request.result;
    };

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result;
      const store = this.db.createObjectStore('profiles', {
        autoIncrement: true,
        keyPath: 'id',
      });
      store.createIndex('profileData', 'profileData', { unique: false });
    };
  }

  storeProfileData(profileData: any) {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return;
    }
    const transaction = this.db.transaction(['profiles'], 'readwrite');
    const store = transaction.objectStore('profiles');
    store.add({ profileData });
  }

  async getStoredProfileData(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!this.db) {
        console.error('IndexedDB is not initialized.');
        reject([]);
      }
      const transaction = this.db!.transaction(['profiles'], 'readonly');
      const store = transaction.objectStore('profiles');
      const request = store.getAll();
      request.onsuccess = (event) => {
        const storedData = request.result;
        this.clearStoredProfileData()
          .then(() => {
            console.log('IndexedDB data cleared after retrieval.');
          })
          .catch((error) => {
            console.error('Error clearing IndexedDB:', error);
          });
        resolve(storedData);
      };
      request.onerror = (event) => {
        console.error('Error retrieving profile data:', event);
        reject([]);
      };
    });
  }

  async clearStoredProfileData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        console.error('IndexedDB is not initialized.');
        reject();
      }
      const transaction = this.db!.transaction(['profiles'], 'readwrite');
      const store = transaction.objectStore('profiles');
      const request = store.clear();
      request.onsuccess = (event) => {
        resolve();
      };
      request.onerror = (event) => {
        console.error('Error clearing profile data:', event);
        reject();
      };
    });
  }
}
