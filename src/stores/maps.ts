import { makeAutoObservable } from "mobx";
import { Fzf } from "fzf";
import mapList from "../assets/mapList.json";
import type { Road, FilteredRoad } from "../types/road";

const MAX_FILTERED = 15;

class MapsStore {
  textField = "";
  filteredResults: FilteredRoad[] = [];
  selectedRoad: FilteredRoad | null = null;
  private fzf: Fzf<Road>;

  constructor() {
    makeAutoObservable(this);
    this.fzf = new Fzf(mapList as Road[], {
      selector: (item) => MapsStore.normalizeString(item.name),
    });
  }

  setTextField(value: string) {
    this.textField = value;

    if (this.textField.trim().length === 0) {
      this.filteredResults = [];
      this.selectedRoad = null;
      return;
    }

    const normalizedSearch = MapsStore.normalizeString(this.textField);

    this.filteredResults = this.fzf
      .find(normalizedSearch)
      .slice(0, MAX_FILTERED)
      .map((res) => ({
        ...res.item,
        matches: res.positions,
      }));
      
    if(this.filteredResults) this.selectRoad(this.filteredResults[0]);
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
