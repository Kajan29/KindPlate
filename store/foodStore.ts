import { create } from "zustand";
import { FoodItem } from "@types/food";
import { mockFoodItems } from "@data/mockFood";

interface FoodStore {
  foodItems: FoodItem[];
  isLoading: boolean;
  error: string | null;

  fetchFoodItems: () => void;
  addFoodItem: (item: FoodItem) => void;
  removeFoodItem: (id: string) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
}

export const useFoodStore = create<FoodStore>((set) => ({
  foodItems: mockFoodItems,
  isLoading: false,
  error: null,

  fetchFoodItems: () => {
    set({ isLoading: true, error: null });
    // Simulating API call with mock data
    setTimeout(() => {
      set({ foodItems: mockFoodItems, isLoading: false });
    }, 500);
  },

  addFoodItem: (item) => {
    set((state) => ({
      foodItems: [item, ...state.foodItems],
    }));
  },

  removeFoodItem: (id) => {
    set((state) => ({
      foodItems: state.foodItems.filter((item) => item.id !== id),
    }));
  },

  updateFoodItem: (id, updates) => {
    set((state) => ({
      foodItems: state.foodItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },
}));
