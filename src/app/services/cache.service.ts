import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  public setCacheData(users: User[], page: number): void {
    if (this.isLocalStorageFull()) {
      localStorage.clear();
    }
    const localStorageItems = localStorage.getItem('users');
    const parsedItems = localStorageItems ? JSON.parse(localStorageItems) : {};
    const localStorageUsers = { ...parsedItems, [page]: users };
    try {
      localStorage.setItem('users', JSON.stringify(localStorageUsers));
    } catch (error) {
      //console.log('there is an error while setting cache data', error);
      localStorage.clear();
      localStorage.setItem('users', JSON.stringify({ [page]: users }));
    }
  }
  public getCacheData(): { [key: string]: User[] } {
    const localStorageItems = localStorage.getItem('users');
    const parsedItems = localStorageItems
      ? JSON.parse(localStorageItems)
      : null;
    return parsedItems;
  }

  public clearCache(key: string = 'users'): void {
    localStorage.removeItem(key);
  }
  private isLocalStorageFull(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return e instanceof DOMException && e.code === 22;
    }
  }
}
