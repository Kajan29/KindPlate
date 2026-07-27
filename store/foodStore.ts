import { create } from "zustand";
import { FoodItem } from "@types/food";
import { foodService } from "@services/foodService";

interface FoodStore {
  foodItems: FoodItem[];
  isLoading: boolean;
  error: string | null;

  fetchFoodItems: () => Promise<void>;
  fetchByCategory: (category: string) => Promise<void>;
  addFoodItem: (item: Omit<FoodItem, "id" | "createdAt">) => Promise<void>;
  removeFoodItem: (id: string) => Promise<void>;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => Promise<void>;
  reserveFoodItem: (id: string) => Promise<void>;
  markAsPickedUp: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useFoodStore = create<FoodStore>((set, get) => ({
  foodItems: [],
  isLoading: false,
  error: null,

  fetchFoodItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await foodService.getFoodItems();
      set({ foodItems: items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch food items",
        isLoading: false,
      });
    }
  },

  fetchByCategory: async (category: string) => {
    set({ isLoading: true, error: null });
    try {
      const items = await foodService.getFoodItemsByCategory(category);
      set({ foodItems: items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch food items",
        isLoading: false,
      });
    }
  },

  addFoodItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await foodService.createFoodItem(item);
      set((state) => ({
        foodItems: [newItem, ...state.foodItems],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add food item",
        isLoading: false,
      });
    }
  },

  removeFoodItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await foodService.deleteFoodItem(id);
      set((state) => ({
        foodItems: state.foodItems.filter((item) => item.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to remove food item",
        isLoading: false,
      });
    }
  },

  updateFoodItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await foodService.updateFoodItem(id, updates);
      set((state) => ({
        foodItems: state.foodItems.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update food item",
        isLoading: false,
      });
    }
  },

  reserveFoodItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await foodService.reserveFoodItem(id);
      set((state) => ({
        foodItems: state.foodItems.map((item) =>
          item.id === id ? { ...item, status: "reserved" as const } : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to reserve food item",
        isLoading: false,
      });
    }
  },

  markAsPickedUp: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await foodService.markAsPickedUp(id);
      set((state) => ({
        foodItems: state.foodItems.map((item) =>
          item.id === id ? { ...item, status: "picked_up" as const } : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to mark as picked up",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
