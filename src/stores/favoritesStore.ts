import { makeAutoObservable } from "mobx";
import type { Road } from "../types/road";
import mapList from "../../assets/mapList.json";

import { favoritesStore } from "./favoritesStore";

const FAVORITES_KEY = "roadinator_favorites";

class FavoritesStore {
  favorites: Road[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFavorites();
  }

  toggleFavorite(road: Road) {
    const index = this.favorites.findIndex((f) => f.name === road.name);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(road);
    }
    this.saveFavorites();
  }

  isFavorite(roadName: string): boolean {
    return this.favorites.some((f) => f.name === roadName);
  }

  private loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        this.favorites = JSON.parse(stored);
      }
    } catch {
      this.favorites = [];
    }
  }

  private saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
  }
}

export const favoritesStore = new FavoritesStore();
