import { FoodItem } from "@types/food";
import { Config } from "@constants/Config";

/**
 * Food service handles all API communication related to food items.
 * Currently uses mock data, but ready to connect to a real API.
 */
class FoodService {
  private baseUrl = Config.API_BASE_URL;

  async getFoodItems(): Promise<FoodItem[]> {
    // TODO: Replace with real API call
    // const response = await fetch(`${this.baseUrl}/food`);
    // return response.json();
    return [];
  }

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    // TODO: Replace with real API call
    // const response = await fetch(`${this.baseUrl}/food/${id}`);
    // return response.json();
    return null;
  }

  async createFoodItem(item: Omit<FoodItem, "id" | "createdAt">): Promise<FoodItem> {
    // TODO: Replace with real API call
    // const response = await fetch(`${this.baseUrl}/food`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(item),
    // });
    // return response.json();
    throw new Error("Not implemented");
  }

  async reserveFoodItem(id: string): Promise<void> {
    // TODO: Replace with real API call
    throw new Error("Not implemented");
  }
}

export const foodService = new FoodService();
