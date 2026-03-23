import { makeAutoObservable } from "mobx";
import type { Road } from "../types/road";

const FAVORITES_KEY = "roadinator_favorites";

class FavoritesStore {
  favorites: Road[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  loadFromStorage() {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        this.favorites = JSON.parse(stored);
      } catch {
        this.favorites = [];
      }
    }
  }

  toggleFavorite(road: Road) {
    const exists = this.favorites.some((f) => f.name === road.name);
    if (exists) {
      this.favorites = this.favorites.filter((f) => f.name !== road.name);
    } else {
      this.favorites = [...this.favorites, road];
    }
    this.saveToStorage();
  }

  removeFavorite(road: Road) {
    this.favorites = this.favorites.filter((f) => f.name !== road.name);
    this.saveToStorage();
  }

  clearFavorites() {
    this.favorites = [];
    this.saveToStorage();
  }

  isFavorite(roadName: string): boolean {
    return this.favorites.some((f) => f.name === roadName);
  }

  private saveToStorage() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
  }
}

export const favoritesStore = new FavoritesStore();
