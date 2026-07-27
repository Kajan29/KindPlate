import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@config/firebase";
import { FoodItem, FoodStatus } from "@types/food";
import { Config } from "@constants/Config";

const foodCollection = collection(db, Config.COLLECTIONS.FOOD_ITEMS);

/**
 * Food service handles all Firebase Firestore communication for food items.
 */
class FoodService {
  /**
   * Fetch all available food items, ordered by creation date (newest first).
   */
  async getFoodItems(): Promise<FoodItem[]> {
    const q = query(
      foodCollection,
      where("status", "==", "available"),
      orderBy("createdAt", "desc"),
      limit(Config.PAGINATION_LIMIT)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FoodItem[];
  }

  /**
   * Fetch a single food item by its ID.
   */
  async getFoodItemById(id: string): Promise<FoodItem | null> {
    const docRef = doc(db, Config.COLLECTIONS.FOOD_ITEMS, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as FoodItem;
  }

  /**
   * Create a new food item in Firestore.
   */
  async createFoodItem(
    item: Omit<FoodItem, "id" | "createdAt">
  ): Promise<FoodItem> {
    const newItem = {
      ...item,
      createdAt: Timestamp.now().toDate().toISOString(),
      status: "available" as FoodStatus,
    };

    const docRef = await addDoc(foodCollection, newItem);
    return { id: docRef.id, ...newItem } as FoodItem;
  }

  /**
   * Reserve a food item (mark as reserved).
   */
  async reserveFoodItem(id: string): Promise<void> {
    const docRef = doc(db, Config.COLLECTIONS.FOOD_ITEMS, id);
    await updateDoc(docRef, {
      status: "reserved" as FoodStatus,
    });
  }

  /**
   * Mark a food item as picked up.
   */
  async markAsPickedUp(id: string): Promise<void> {
    const docRef = doc(db, Config.COLLECTIONS.FOOD_ITEMS, id);
    await updateDoc(docRef, {
      status: "picked_up" as FoodStatus,
    });
  }

  /**
   * Update a food item.
   */
  async updateFoodItem(
    id: string,
    updates: Partial<FoodItem>
  ): Promise<void> {
    const docRef = doc(db, Config.COLLECTIONS.FOOD_ITEMS, id);
    await updateDoc(docRef, updates);
  }

  /**
   * Delete a food item from Firestore.
   */
  async deleteFoodItem(id: string): Promise<void> {
    const docRef = doc(db, Config.COLLECTIONS.FOOD_ITEMS, id);
    await deleteDoc(docRef);
  }

  /**
   * Fetch food items by category.
   */
  async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    const q = query(
      foodCollection,
      where("category", "==", category),
      where("status", "==", "available"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FoodItem[];
  }

  /**
   * Fetch food items by donor ID.
   */
  async getFoodItemsByDonor(donorId: string): Promise<FoodItem[]> {
    const q = query(
      foodCollection,
      where("donor.id", "==", donorId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FoodItem[];
  }
}

export const foodService = new FoodService();
