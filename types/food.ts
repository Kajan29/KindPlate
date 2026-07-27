export interface FoodItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  expiresAt: string;
  createdAt: string;
  location: Location;
  donor: UserProfile;
  status: FoodStatus;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  distanceKm?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  totalDonations: number;
  totalPickups: number;
}

export type FoodCategory =
  | "fruits"
  | "vegetables"
  | "dairy"
  | "bakery"
  | "meals"
  | "snacks"
  | "beverages"
  | "other";

export type FoodStatus = "available" | "reserved" | "picked_up" | "expired";
