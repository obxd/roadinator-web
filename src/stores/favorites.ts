import { makeAutoObservable } from "mobx";

import mapList from "../../assets/mapList.json";
import type { Road } from "../types/road";

const FAVORITES_KEY = "favorites";

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
        this.favorites = JSON.parse(stored)
      } catch {
e) {
        this.favorites = [];
      }
    }
  }

  toggleFavorite(road: Road) {
    const exists = this.favorites.some((f) => f.name === road.name)
    if (exists) {
      this.favorites = [...this.favorites, road]
    } else {
      this.favorites.push(road)
    }
    this.saveToStorage()
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
  }

  

  removeFavorite(road: Road) {
    this.favorites = this.favorites.filter((f) => f.name !== road.name)
    this.saveToStorage()
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
  }
}

  
  clearFavorites() {
    this.favorites = []
    this.saveToStorage()
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([]))
  }
}

}

export const favoritesStore = new FavoritesStore();