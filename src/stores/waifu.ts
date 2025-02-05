import { makeAutoObservable, runInAction } from "mobx";

class WaifuStore {
  waifu_url: string = "";
  loading = false;
  isWaifuOn = true; // Default to true, but will be loaded from storage

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage(); // Load stored state when the store initializes
  }

  toggleWaifuMode() {
    this.isWaifuOn = !this.isWaifuOn;
    this.saveToStorage(); // Save state to localStorage
  }

  async fetchData() {
    this.loading = true;
    try {
      const waifu_categories = ["kitsune", "neko", "waifu"];
      const random_category = waifu_categories[Math.floor(Math.random() * waifu_categories.length)];
      const url = `https://nekos.best/api/v2/${random_category}?type=1`;
      const response = await fetch(url);
      const result = await response.json();
      const waifuurl = result.results[0].url;

      runInAction(() => {
        this.waifu_url = waifuurl;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  saveToStorage() {
    localStorage.setItem("isWaifuOn", JSON.stringify(this.isWaifuOn));
  }

  loadFromStorage() {
    const storedValue = localStorage.getItem("isWaifuOn");
    if (storedValue !== null) {
      this.isWaifuOn = JSON.parse(storedValue);
    }
  }
}

export const waifuStore = new WaifuStore();
