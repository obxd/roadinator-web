import { makeAutoObservable } from "mobx";

class DarkModeStore {
  isDarkMode = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle("dark", this.isDarkMode);
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem("darkMode", JSON.stringify(this.isDarkMode));
  }

  loadFromStorage() {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      this.isDarkMode = JSON.parse(storedDarkMode);
      document.documentElement.classList.toggle("dark", this.isDarkMode);
    }
  }
}

export const darkModeStore = new DarkModeStore();
