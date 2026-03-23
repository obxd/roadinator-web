import { makeAutoObservable } from "mobx";
import { Fzf } from "fzf";
import mapList from "../assets/mapList.json";
import type { Road, FilteredRoad } from "../types/road";

const MAX_FILTERED = 15;

class MapsStore {
  textField = "";
  filteredResults: FilteredRoad[] = [];
  selectedRoad: FilteredRoad | null = null;
  private fzf: Fzf<Road[]>;
  private allRoads: Road[];

  constructor() {
    makeAutoObservable(this);
    this.allRoads = mapList as Road[];
    this.fzf = new Fzf(this.allRoads, {
      selector: (item) => MapsStore.normalizeString(item.name),
    });
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
