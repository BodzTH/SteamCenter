import { create } from "zustand";

type Store = {
  City: string;
  Area: string;
  Street: string;
  FullAddress: string;
  setCity: (city: string) => void;
  setArea: (area: string) => void;
  setStreet: (street: string) => void;
  setFullAddress: (address: string) => void;
};

export const useStore = create<Store>((set) => ({
  City: '',
  Area: '',
  Street: '',
  FullAddress: '',
  setCity: (city: string) => set({ City: city }),
  setArea: (area: string) => set({ Area: area }),
  setStreet: (street: string) => set({ Street: street }),
  setFullAddress: (address: string) => set({ FullAddress: address }),
}));