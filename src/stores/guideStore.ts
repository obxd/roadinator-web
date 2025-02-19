import { makeAutoObservable } from "mobx";

class GuideStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  openGuide() {
    this.isOpen = true;
  }

  closeGuide() {
    this.isOpen = false;
  }
}

export const guideStore = new GuideStore();
