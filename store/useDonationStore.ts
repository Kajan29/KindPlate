import { create } from "zustand";
import { Donation, DonationStatus, FoodCategory } from "@/types/food";
import { activeDonations, donationHistory, currentUser } from "@data/mockData";

interface NewDonationInput {
  title: string;
  description: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  expiresInLabel: string;
  imageUrl: string;
  area: string;
}

interface DonationStore {
  donations: Donation[];
  history: Donation[];
  addDonation: (input: NewDonationInput) => Donation;
  updateStatus: (id: string, status: DonationStatus) => void;
  removeDonation: (id: string) => void;
}

/**
 * Donation state backed entirely by in-memory mock data so the app runs
 * without any backend configured.
 */
export const useDonationStore = create<DonationStore>((set, get) => ({
  donations: activeDonations,
  history: donationHistory,

  addDonation: (input) => {
    const now = new Date();
    const donation: Donation = {
      id: `d_${Date.now()}`,
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl,
      category: input.category,
      quantity: input.quantity,
      unit: input.unit,
      status: "pending",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      expiresInLabel: input.expiresInLabel,
      donor: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
      location: {
        latitude: 9.6685,
        longitude: 80.0074,
        address: input.area,
        area: input.area,
        city: "Jaffna",
        distanceKm: 0,
      },
    };
    set((state) => ({ donations: [donation, ...state.donations] }));
    return donation;
  },

  updateStatus: (id, status) =>
    set((state) => ({
      donations: state.donations.map((d) =>
        d.id === id ? { ...d, status } : d
      ),
    })),

  removeDonation: (id) =>
    set((state) => ({
      donations: state.donations.filter((d) => d.id !== id),
    })),
}));
