import { makeAutoObservable } from "mobx";
import { Fzf } from "fzf";
import mapList from "../assets/mapList.json";
import type { Road, FilteredRoad } from "../types/road";

const MAX_FILTERED = 15;
const MAX_RECENT = 10;
const RECENT_KEY = "recentSearches";

const ROAD_TYPES = Array.from(
  new Set((mapList as Road[]).map((r) => r.data.type))
).sort();

const ROAD_TIERS = Array.from(
  new Set((mapList as Road[]).map((r) => r.data.tier))
).sort();

class MapsStore {
  textField = "";
  filteredResults: FilteredRoad[] = [];
  selectedRoad: FilteredRoad | null = null;
  selectedType = "";
  selectedTier = "";
  roadTypes = ROAD_TYPES;
  roadTiers = ROAD_TIERS;
  recentSearches: string[] = [];
  private fzf: Fzf<Road>;
  private allRoads: Road[];

  constructor() {
    makeAutoObservable(this);
    this.allRoads = mapList as Road[];
    this.fzf = new Fzf(this.allRoads, {
      selector: (item) => MapsStore.normalizeString(item.name),
    });
    this.loadRecentSearches();
  }

  private loadRecentSearches() {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        this.recentSearches = JSON.parse(stored);
      }
    } catch {
      this.recentSearches = [];
    }
  }

  private saveRecentSearches() {
    localStorage.setItem(RECENT_KEY, JSON.stringify(this.recentSearches));
  }

  addRecentSearch(term: string) {
    const normalized = term.trim();
    if (!normalized) return;
    
    this.recentSearches = [
      normalized,
      ...this.recentSearches.filter((s) => s !== normalized),
    ].slice(0, MAX_RECENT);
    this.saveRecentSearches();
  }

  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem(RECENT_KEY);
  }

  setTypeFilter(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  setTierFilter(tier: string) {
    this.selectedTier = tier;
    this.applyFilters();
  }

  private applyFilters() {
    if (this.textField.trim().length === 0) {
      this.filteredResults = [];
      this.selectedRoad = null;
      return;
    }

    const normalizedSearch = MapsStore.normalizeString(this.textField);
    let results = this.fzf.find(normalizedSearch).map((res) => ({
      ...res.item,
      matches: res.positions,
    }));

    if (this.selectedType) {
      results = results.filter((r) => r.data.type === this.selectedType);
    }

    if (this.selectedTier) {
      results = results.filter((r) => r.data.tier === this.selectedTier);
    }

    this.filteredResults = results.slice(0, MAX_FILTERED);

    if (this.filteredResults.length > 0) {
      this.selectRoad(this.filteredResults[0]);
    } else {
      this.selectedRoad = null;
    }
  }

  setTextField(value: string) {
    this.textField = value;
    if (value.trim()) {
      this.addRecentSearch(value.trim());
    }
    this.applyFilters();
  }

  selectRoad(road: FilteredRoad) {
    this.selectedRoad = road;
  }

  // Normalize function to treat '-' and spaces as the same character while keeping spaces valid
  static normalizeString(str: string): string {
    return str.replace(/-/g, " ").toLowerCase(); // Replace dashes with spaces but keep existing spaces
  }
}

export const mapsStore = new MapsStore();
