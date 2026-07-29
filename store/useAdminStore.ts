import { create } from "zustand";
import {
  ActivityItem,
  AvailableVolunteer,
  DeliveryLifecycle,
  DisputeCase,
  Donation,
  ManagedUser,
  NgoPartner,
  PointsLedgerEntry,
  PointsRule,
  ReviewDonation,
} from "@/types/food";
import {
  adminActivity,
  availableVolunteers,
  deliveryLifecycles,
  disputeCases,
  managedUsers,
  ngoPartners,
  pointsLedger,
  pointsRules,
  reviewQueue,
} from "@data/mockData";
import { useDonationStore } from "./useDonationStore";

/** Where a donation is routed when the admin assigns it. */
export type Assignment =
  | { type: "volunteer"; id: string; name: string }
  | { type: "ngo"; id: string; name: string }
  | { type: "self" };

/** Statuses that mean an item has left the pending review queue. */
const DECIDED: ReadonlyArray<ReviewDonation["status"]> = [
  "approved",
  "assigned",
  "collected",
  "delivered",
  "rejected",
];

interface AdminStore {
  reviewQueue: ReviewDonation[];
  volunteers: AvailableVolunteer[];
  ngoPartners: NgoPartner[];
  pointsLedger: PointsLedgerEntry[];
  pointsRules: PointsRule[];
  managedUsers: ManagedUser[];
  disputes: DisputeCase[];
  deliveries: DeliveryLifecycle[];
  activity: ActivityItem[];

  approveDonation: (id: string) => void;
  rejectDonation: (id: string, reason?: string) => void;
  assignDonation: (id: string, assignment: Assignment) => void;
  /** Bridge a donor-posted donation into the admin review queue. */
  ingestDonation: (donation: Donation) => void;
  adjustPoints: (id: string, delta: number) => void;
  resolveDispute: (id: string, outcomeLabel: string) => void;
  setUserStatus: (id: string, status: ManagedUser["status"], verified?: boolean) => void;
}

function pushActivity(list: ActivityItem[], item: Omit<ActivityItem, "id" | "agoLabel">): ActivityItem[] {
  const entry: ActivityItem = { id: `af_${Date.now()}`, agoLabel: "now", ...item };
  return [entry, ...list].slice(0, 12);
}

/** Turn a donor-side Donation into an admin ReviewDonation card. */
function toReview(donation: Donation): ReviewDonation {
  const ms = new Date(donation.expiresAt).getTime() - Date.now();
  const minutesLeft = Number.isFinite(ms) ? Math.max(5, Math.round(ms / 60000)) : 240;
  return {
    id: `rq_${donation.id}`,
    sourceDonationId: donation.id,
    donorName: donation.donor.name,
    donorKind: "individual",
    title: donation.title,
    category: donation.category,
    quantity: donation.quantity,
    unit: donation.unit,
    prePackaged: true,
    cookedAtLabel: "Just posted",
    minutesLeft,
    occasion: "Donor listing",
    area: donation.location.area,
    distanceKm: donation.location.distanceKm ?? 0,
    description: donation.description,
    imageUrl: donation.imageUrl,
    status: minutesLeft <= 60 ? "expiring" : "pending",
  };
}

/**
 * Single source of truth for the admin experience. Every admin screen reads
 * from here so decisions stay in sync (approvals lower the dashboard count,
 * assignments create deliveries, etc.). New donor donations are bridged in via
 * `ingestDonation`, connecting the user and admin sides.
 */
export const useAdminStore = create<AdminStore>((set) => ({
  reviewQueue,
  volunteers: availableVolunteers,
  ngoPartners,
  pointsLedger,
  pointsRules,
  managedUsers,
  disputes: disputeCases,
  deliveries: deliveryLifecycles,
  activity: adminActivity,

  approveDonation: (id) =>
    set((state) => {
      const item = state.reviewQueue.find((d) => d.id === id);
      return {
        reviewQueue: state.reviewQueue.map((d) => (d.id === id ? { ...d, status: "approved" } : d)),
        activity: item
          ? pushActivity(state.activity, {
              icon: "checkmark-circle",
              text: `Approved “${item.title}” from ${item.donorName}`,
              tone: "sage",
            })
          : state.activity,
      };
    }),

  rejectDonation: (id) =>
    set((state) => {
      const item = state.reviewQueue.find((d) => d.id === id);
      return {
        reviewQueue: state.reviewQueue.map((d) => (d.id === id ? { ...d, status: "rejected" } : d)),
        activity: item
          ? pushActivity(state.activity, {
              icon: "close-circle",
              text: `Rejected “${item.title}”`,
              tone: "maroon",
            })
          : state.activity,
      };
    }),

  assignDonation: (id, assignment) =>
    set((state) => {
      const item = state.reviewQueue.find((d) => d.id === id);
      if (!item) return {};

      const handlerName =
        assignment.type === "self"
          ? "Donor self-delivery"
          : assignment.name;

      // Reflect the change on the donor's side when this originated there.
      if (item.sourceDonationId) {
        useDonationStore.getState().updateStatus(item.sourceDonationId, "assigned");
      }

      const delivery: DeliveryLifecycle = {
        id: `dl_${Date.now()}`,
        title: item.title,
        donor: item.donorName,
        recipient: `${item.area} community`,
        volunteer: handlerName,
        currentStep: 2, // Assigned
        flagged: false,
        updatedAgoLabel: "Just now",
      };

      return {
        reviewQueue: state.reviewQueue.map((d) => (d.id === id ? { ...d, status: "assigned" } : d)),
        deliveries: [delivery, ...state.deliveries],
        activity: pushActivity(state.activity, {
          icon: "bicycle",
          text: `Assigned “${item.title}” to ${handlerName}`,
          tone: "teal",
        }),
      };
    }),

  ingestDonation: (donation) =>
    set((state) => {
      if (state.reviewQueue.some((d) => d.sourceDonationId === donation.id)) return {};
      const review = toReview(donation);
      return {
        reviewQueue: [review, ...state.reviewQueue],
        activity: pushActivity(state.activity, {
          icon: "add-circle",
          text: `New donation posted by ${donation.donor.name}`,
          tone: "teal",
        }),
      };
    }),

  adjustPoints: (id, delta) =>
    set((state) => ({
      pointsLedger: state.pointsLedger.map((e) =>
        e.id === id ? { ...e, points: Math.max(0, e.points + delta) } : e
      ),
    })),

  resolveDispute: (id, outcomeLabel) =>
    set((state) => ({
      disputes: state.disputes.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)),
      activity: pushActivity(state.activity, {
        icon: "shield-checkmark",
        text: `Dispute resolved: ${outcomeLabel}`,
        tone: "sage",
      }),
    })),

  setUserStatus: (id, status, verified) =>
    set((state) => ({
      managedUsers: state.managedUsers.map((u) =>
        u.id === id ? { ...u, status, verified: verified ?? u.verified } : u
      ),
    })),
}));

/** True when a review item is still awaiting a decision. */
export function isPendingReview(item: ReviewDonation): boolean {
  return !DECIDED.includes(item.status);
}
