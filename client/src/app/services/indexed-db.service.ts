import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private db: IDBDatabase | undefined;
  private profileDataSubject = new BehaviorSubject<any[]>([]);

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
      this.fetchAndEmitProfileData();
    };

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result;
      this.createProfileDataStore();
    };
  }

  private createProfileDataStore() {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return;
    }
    const store = this.db.createObjectStore('profiles', {
      autoIncrement: true,
      keyPath: 'id',
    });
    store.createIndex('profileData', 'profileData', { unique: false });
  }

  private fetchAndEmitProfileData() {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return;
    }
    const transaction = this.db.transaction(['profiles'], 'readonly');
    const store = transaction.objectStore('profiles');
    const request = store.getAll();
    request.onsuccess = (event) => {
      const storedData = request.result;
      this.profileDataSubject.next(storedData);
    };
    request.onerror = (event) => {
      console.error('Error retrieving profile data:', event);
    };
  }

  private executeRequest(request: IDBRequest): Observable<void> {
    return from(
      new Promise<void>((resolve, reject) => {
        request.onsuccess = (event) => {
          this.fetchAndEmitProfileData();
          resolve();
        };
        request.onerror = (event) => {
          console.error('Error:', event);
          reject();
        };
      })
    );
  }

  storeProfileData(profileData: any): Observable<void> {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return new Observable<void>((observer) => {
        observer.error('IndexedDB is not initialized.');
      });
    }
    const transaction = this.db.transaction(['profiles'], 'readwrite');
    const store = transaction.objectStore('profiles');
    const request = store.add({ profileData });
    return this.executeRequest(request);
  }

  getProfileData(): Observable<any[]> {
    return this.profileDataSubject.asObservable();
  }

  clearStoredProfileData(): Observable<void> {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return new Observable<void>((observer) => {
        observer.error('IndexedDB is not initialized.');
      });
    }
    const transaction = this.db.transaction(['profiles'], 'readwrite');
    const store = transaction.objectStore('profiles');
    const request = store.clear();
    return this.executeRequest(request);
  }
}
