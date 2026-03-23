import { makeAutoObservable } from "mobx";
import { Fzf } from "fzf";
import mapList from "../assets/mapList.json";
import type { Road, FilteredRoad } from "../types/road";

const MAX_FILTERED = 15;
const MAX_HISTORY = 10;
const SEARCH_HISTORY_KEY = "roadinator_search_history";
const ROAD_HISTORY_KEY = "roadinator_road_history";

class MapsStore {
  textField = "";
  filteredResults: FilteredRoad[] = [];
  selectedRoad: FilteredRoad | null = null;
  searchHistory: string[] = [];
  roadHistory: string[] = [];
  private fzf: Fzf<Road[]>;
  private allRoads: Road[];

  constructor() {
    makeAutoObservable(this);
    this.allRoads = mapList as Road[];
    this.fzf = new Fzf(this.allRoads, {
      selector: (item) => MapsStore.normalizeString(item.name),
    });
    this.loadHistory();
  }

  private loadHistory() {
    try {
      const searchHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (searchHistory) this.searchHistory = JSON.parse(searchHistory);
    } catch {
      this.searchHistory = [];
    }
    try {
      const roadHistory = localStorage.getItem(ROAD_HISTORY_KEY);
      if (roadHistory) this.roadHistory = JSON.parse(roadHistory);
    } catch {
      this.roadHistory = [];
    }
  }

  private saveSearchHistory() {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(this.searchHistory));
  }

  private saveRoadHistory() {
    localStorage.setItem(ROAD_HISTORY_KEY, JSON.stringify(this.roadHistory));
  }

  addSearchHistory(term: string) {
    const normalized = term.trim();
    if (!normalized) return;
    this.searchHistory = [
      normalized,
      ...this.searchHistory.filter((s) => s !== normalized),
    ].slice(0, MAX_HISTORY);
    this.saveSearchHistory();
  }

  addRoadHistory(roadName: string) {
    if (!roadName) return;
    this.roadHistory = [
      roadName,
      ...this.roadHistory.filter((r) => r !== roadName),
    ].slice(0, MAX_HISTORY);
    this.saveRoadHistory();
  }

  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }

  clearRoadHistory() {
    this.roadHistory = [];
    localStorage.removeItem(ROAD_HISTORY_KEY);
  }

  private applyFilters() {
    if (this.textField.trim().length === 0) {
      this.filteredResults = [];
      this.selectedRoad = null;
      return;
    }

    const normalizedSearch = MapsStore.normalizeString(this.textField);
    const results = this.fzf.find(normalizedSearch).map((res) => {
      const item = res.item as Road;
      return {
        ...item,
        matches: Array.from(res.positions),
      };
    });

    this.filteredResults = results.slice(0, MAX_FILTERED);

    if (this.filteredResults.length > 0) {
      this.selectRoad(this.filteredResults[0]);
    } else {
      this.selectedRoad = null;
    }
  }

  setTextField(value: string) {
    this.textField = value;
    this.applyFilters();
  }

  selectRoad(road: FilteredRoad) {
    this.selectedRoad = road;
  }

  static normalizeString(str: string): string {
    return str.replace(/-/g, " ").toLowerCase();
  }
}

export const mapsStore = new MapsStore();
