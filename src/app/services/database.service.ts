import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MessageData {
  name: string;
  email: string;
  category: string;
  message: string;
  attachment?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbName = 'messagesDB';
  private storeName = 'messages';
  private db: IDBDatabase | null = null;
  messages$ = new BehaviorSubject<MessageData[]>([]);

  constructor() {
    this.initDB();
  }

  private async initDB() {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = () => {
      console.error('Error opening database');
    };

    request.onsuccess = () => {
      this.db = request.result;
      console.log('Database opened successfully');
      this.loadMessages();
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'timestamp' });
        console.log('Object store created');
      }
    };
  }

  async saveMessage(message: MessageData): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(message);

      request.onsuccess = async () => {
        await this.loadMessages();
        resolve(true);
      };

      request.onerror = () => {
        console.error('Error saving message');
        resolve(false);
      };
    });
  }

  private async loadMessages() {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      const messages = request.result as MessageData[];
      this.messages$.next(messages.sort((a, b) => b.timestamp - a.timestamp));
    };

    request.onerror = () => {
      console.error('Error getting messages');
    };
  }

  getMessages(): Promise<MessageData[]> {
    return Promise.resolve(this.messages$.value);
  }
}
