import { makeAutoObservable } from "mobx";
import mapList from "../assets/mapList.json";

class MapsStore {
  textField = "";

  constructor() {
    makeAutoObservable(this);
  }

  setTextField(value: string) {
    this.textField = value;
  }
}

export const mapsStore = new MapsStore();
