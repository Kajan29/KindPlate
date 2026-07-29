/**
 * KindPlate domain models — a food redistribution network connecting donors,
 * volunteers, recipients and NGOs across Northern Sri Lanka.
 */

export type UserRole = "donor" | "volunteer" | "recipient" | "ngo" | "admin";

export type FoodCategory =
  | "veg"
  | "non_veg"
  | "dry_goods"
  | "bakery"
  | "produce"
  | "prepared";

export type DonationStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "expired";

export type NeedType = "need" | "surplus";
export type Urgency = "critical" | "high" | "normal";
export type AppLanguage = "English" | "தமிழ்" | "සිංහල";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  distanceKm?: number;
}

export interface DonorRef {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Donation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  status: DonationStatus;
  createdAt: string;
  expiresAt: string;
  /** Human friendly countdown, e.g. "02:14:00" or "Expires in 4h". */
  expiresInLabel: string;
  /** ETA in minutes for an assigned rider, when applicable. */
  riderEtaMins?: number;
  donor: DonorRef;
  location: GeoLocation;
}

export interface CommunityNeed {
  id: string;
  title: string;
  area: string;
  distanceKm: number;
  requestedAgoLabel: string;
  mealsNeeded: number;
  description: string;
  urgency: Urgency;
  type: NeedType;
}

export interface MapPin {
  id: string;
  type: NeedType;
  /** Geographic location of the pin, used to place it on the map. */
  latitude: number;
  longitude: number;
  title: string;
  subtitle: string;
  actionText: string;
  description: string;
  urgency: Urgency;
}

export interface ImpactStats {
  mealsSaved: number;
  familiesFed: number;
  co2SavedTons: number;
  donorsCount: number;
}

export interface PersonalImpact {
  mealsShared: number;
  rankLabel: string;
  points: number;
  familiesReached: number;
  level: number;
  levelLabel: string;
  nextMilestone: string;
  nextMilestoneProgress: number; // 0–100
}

export interface CommunityStory {
  id: string;
  quote: string;
  author: string;
  role: string;
  /** Local bundled image (require) or a remote { uri } source. */
  image: import("react-native").ImageSourcePropType;
  rating: number;
}

export interface Badge {
  id: string;
  name: string;
  /** Ionicons / MaterialCommunityIcons name. */
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface Hotspot {
  id: string;
  area: string;
  requestsPending: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  meals: number;
}

export type FreshnessLevel = "fresh" | "urgent" | "expired";

export interface VolunteerPickup {
  id: string;
  org: string;
  area: string;
  distanceKm: number;
  tags: string[];
  freshnessLabel: string;
  freshnessLevel: FreshnessLevel;
  imageUrl: string;
}

export interface RequestStep {
  key: string;
  label: string;
  icon: string;
  done: boolean;
}

export interface ApprovalItem {
  id: string;
  title: string;
  from: string;
  note: string;
  agoLabel: string;
  categoryLabel: string;
  imageUrl: string;
}

export interface OrgLeader {
  id: string;
  rank: number;
  name: string;
  points: number;
  tons: number;
}

export interface HeatZone {
  id: string;
  area: string;
  level: "high" | "moderate";
  families: number;
  /** Geographic center of the zone, used to place markers on the map. */
  latitude: number;
  longitude: number;
}

// ---------------------------------------------------------------------------
// Admin / App-owner domain models
// ---------------------------------------------------------------------------

/** The kind of entity a donation came from — drives the donor-type iconography. */
export type DonorKind =
  | "restaurant"
  | "hotel"
  | "supermarket"
  | "event"
  | "individual";

/** The full lifecycle a donation moves through from the admin's perspective. */
export type AdminDonationStatus =
  | "pending"
  | "approved"
  | "assigned"
  | "collected"
  | "delivered"
  | "rejected"
  | "expiring";

export type BadgeTone = "sage" | "maroon" | "teal" | "warning" | "error" | "neutral";

/** Tap-through summary tile on the admin dashboard. */
export interface AdminStat {
  key: string;
  label: string;
  value: number;
  icon: string;
  tone: BadgeTone;
  /** Optional route pushed when the card is tapped. */
  route?: string;
}

/** Quick-glance activity feed row. */
export interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  agoLabel: string;
  tone: BadgeTone;
}

/** A donation as it appears in the admin review queue. */
export interface ReviewDonation {
  id: string;
  donorName: string;
  donorKind: DonorKind;
  title: string;
  category: FoodCategory;
  quantity: number;
  unit: string;
  /** True when already packed into parcels, false when it needs containers. */
  prePackaged: boolean;
  cookedAtLabel: string;
  /** Minutes remaining until the 6-hour cooked-food freshness limit. */
  minutesLeft: number;
  occasion: string;
  area: string;
  distanceKm: number;
  description: string;
  imageUrl: string;
  status: AdminDonationStatus;
  /** Links back to a donor-posted Donation when it originated on the user side. */
  sourceDonationId?: string;
}

/** A volunteer that can be assigned to collect a donation. */
export interface AvailableVolunteer {
  id: string;
  name: string;
  avatarUrl: string;
  hasVehicle: boolean;
  vehicleLabel: string;
  /** How many active deliveries they are already handling. */
  activeLoad: number;
  rating: number;
  points: number;
  distanceKm: number;
}

/** A partner NGO that can receive a routed donation. */
export interface NgoPartner {
  id: string;
  name: string;
  area: string;
  activeCases: number;
}

/** A row in the points & rewards ledger. */
export interface PointsLedgerEntry {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  points: number;
  contributions: number;
}

/** A configurable rule in the points/rewards engine. */
export interface PointsRule {
  id: string;
  label: string;
  detail: string;
  points: string;
  icon: string;
}

/** A user managed from the admin User & Role screen. */
export interface ManagedUser {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  verified: boolean;
  status: "active" | "pending" | "suspended";
  meta: string;
}

/** A flagged issue in the dispute-resolution queue. */
export interface DisputeCase {
  id: string;
  title: string;
  reason: string;
  donationRef: string;
  reporter: string;
  agoLabel: string;
  severity: "high" | "medium" | "low";
  status: "open" | "resolved";
}

/** A donation tracked through the delivery lifecycle stepper. */
export interface DeliveryLifecycle {
  id: string;
  title: string;
  donor: string;
  recipient: string;
  volunteer: string;
  /** 0=Posted, 1=Approved, 2=Assigned, 3=Collected, 4=Delivered. */
  currentStep: number;
  flagged: boolean;
  proofPhoto?: string;
  updatedAgoLabel: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl: string;
  verified: boolean;
  points: number;
  rank: string;
  level: number;
  levelLabel: string;
  mealsShared: number;
  familiesFed: number;
  rating: number;
  badgesUnlocked: number;
  memberSince: string;
  language: AppLanguage;
}
