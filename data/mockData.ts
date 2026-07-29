import {
  ActivityItem,
  AdminDonationStatus,
  AdminStat,
  ApprovalItem,
  AvailableVolunteer,
  Badge,
  CommunityNeed,
  CommunityStory,
  DeliveryLifecycle,
  DisputeCase,
  Donation,
  DonorKind,
  FoodCategory,
  HeatZone,
  Hotspot,
  ImpactStats,
  LeaderboardEntry,
  ManagedUser,
  MapPin,
  NgoPartner,
  OrgLeader,
  PersonalImpact,
  PointsLedgerEntry,
  PointsRule,
  RequestStep,
  ReviewDonation,
  User,
  VolunteerPickup,
} from "@/types/food";
import { AppImages } from "@constants/Images";

/**
 * Stable remote imagery (Unsplash) used across the mock experience.
 * Kept in one place so screens stay tidy.
 */
const IMG = {
  riceCurry:
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=70",
  lunchPacket:
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=70",
  fruitBasket:
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=70",
  snacks:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=70",
  produce:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=70",
  bread:
    "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=70",
  plate:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70",
  heroKitchen:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=70",
  storyElder:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=70",
  storyVolunteers:
    "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=70",
  storyMeal:
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=70",
};

const avatar = (n: number) => `https://i.pravatar.cc/200?img=${n}`;

/** Category presentation metadata used by cards, chips and the donate form. */
export const CATEGORY_META: Record<
  FoodCategory,
  { label: string; icon: string; description: string }
> = {
  veg: { label: "Veg", icon: "leaf", description: "Vegetarian meals" },
  non_veg: { label: "Non-Veg", icon: "fish", description: "Non-vegetarian meals" },
  dry_goods: {
    label: "Dry Goods",
    icon: "cube",
    description: "Rice, lentils, flour",
  },
  bakery: { label: "Bakery", icon: "pizza", description: "Bread & baked goods" },
  produce: { label: "Produce", icon: "nutrition", description: "Fresh fruit & veg" },
  prepared: {
    label: "Prepared",
    icon: "restaurant",
    description: "Hot prepared meals",
  },
};

export const currentUser: User = {
  id: "u_kajan",
  name: "Kajan Ratnam",
  role: "donor",
  roleLabel: "Community Donor",
  avatarUrl: avatar(12),
  verified: true,
  points: 1240,
  rank: "#12",
  level: 4,
  levelLabel: "Level 4 Donor",
  mealsShared: 482,
  familiesFed: 8,
  rating: 4.9,
  badgesUnlocked: 12,
  memberSince: "Mar 2024",
  language: "English",
};

export const activeDonations: Donation[] = [
  {
    id: "d1",
    title: "15 Lunch Packets — Veg",
    description: "Freshly cooked rice, sambar and vegetable curry, packed hot.",
    imageUrl: IMG.lunchPacket,
    category: "veg",
    quantity: 15,
    unit: "packets",
    status: "pending",
    createdAt: "2026-07-28T09:30:00Z",
    expiresAt: "2026-07-28T13:44:00Z",
    expiresInLabel: "Expires in 02:14:00",
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6685,
      longitude: 80.0074,
      address: "Temple Rd",
      area: "Nallur",
      city: "Jaffna",
      distanceKm: 0.4,
    },
  },
  {
    id: "d2",
    title: "Assorted Local Fruit Basket",
    description: "Ripe mangoes, bananas and guava from a home garden.",
    imageUrl: IMG.fruitBasket,
    category: "produce",
    quantity: 1,
    unit: "basket",
    status: "assigned",
    createdAt: "2026-07-28T08:00:00Z",
    expiresAt: "2026-07-29T08:00:00Z",
    expiresInLabel: "Rider arriving in 12 mins",
    riderEtaMins: 12,
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6612,
      longitude: 80.0255,
      address: "Kandy Rd",
      area: "Jaffna Central",
      city: "Jaffna",
      distanceKm: 1.1,
    },
  },
  {
    id: "d3",
    title: "Evening Snacks — 20 Pax",
    description: "Vadai, cutlets and short eats prepared this afternoon.",
    imageUrl: IMG.snacks,
    category: "bakery",
    quantity: 20,
    unit: "portions",
    status: "pending",
    createdAt: "2026-07-28T10:15:00Z",
    expiresAt: "2026-07-28T15:00:00Z",
    expiresInLabel: "Expires in 04:45:00",
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6740,
      longitude: 80.0090,
      address: "Point Pedro Rd",
      area: "Kokuvil",
      city: "Jaffna",
      distanceKm: 2.3,
    },
  },
];

/** Community listings that appear in the map & explore surfaces. */
export const communityNeeds: CommunityNeed[] = [
  {
    id: "n1",
    title: "Nallur Community Center",
    area: "Nallur",
    distanceKm: 2.4,
    requestedAgoLabel: "Requested 2h ago",
    mealsNeeded: 10,
    description: "Prepared hot meals or dry rations",
    urgency: "critical",
    type: "need",
  },
  {
    id: "n2",
    title: "Jaffna Central Kitchen",
    area: "Jaffna Central",
    distanceKm: 0.8,
    requestedAgoLabel: "Active now",
    mealsNeeded: 25,
    description: "Vegetarian rice and curry available",
    urgency: "normal",
    type: "surplus",
  },
  {
    id: "n3",
    title: "Vadamarachchi Relief Point",
    area: "Point Pedro",
    distanceKm: 8.1,
    requestedAgoLabel: "Requested 15m ago",
    mealsNeeded: 50,
    description: "Lentils, rice and flour for 50 families",
    urgency: "high",
    type: "need",
  },
  {
    id: "n4",
    title: "Chundikuli Girls' Home",
    area: "Chundikuli",
    distanceKm: 3.2,
    requestedAgoLabel: "Requested 40m ago",
    mealsNeeded: 18,
    description: "Nutritious dinner for residents",
    urgency: "high",
    type: "need",
  },
];

export const mapPins: MapPin[] = [
  {
    id: "n1",
    type: "need",
    latitude: 9.6745,
    longitude: 80.0311,
    title: "Nallur Community Center",
    subtitle: "2.4 km away • Requested 2h ago",
    actionText: "10 Meals Needed",
    description: "Prepared hot meals or dry rations",
    urgency: "critical",
  },
  {
    id: "n2",
    type: "surplus",
    latitude: 9.661,
    longitude: 80.025,
    title: "Jaffna Central Kitchen",
    subtitle: "0.8 km away • Active now",
    actionText: "25 Surplus Meals",
    description: "Vegetarian rice and curry available",
    urgency: "normal",
  },
  {
    id: "n3",
    type: "need",
    latitude: 9.75,
    longitude: 80.16,
    title: "Vadamarachchi Relief Point",
    subtitle: "8.1 km away • Requested 15m ago",
    actionText: "Bulk Dry Goods",
    description: "Lentils, rice and flour for 50 families",
    urgency: "high",
  },
  {
    id: "n4",
    type: "need",
    latitude: 9.659,
    longitude: 80.029,
    title: "Chundikuli Girls' Home",
    subtitle: "3.2 km away • Requested 40m ago",
    actionText: "18 Meals Needed",
    description: "Nutritious dinner for residents",
    urgency: "high",
  },
];

export const impactStats: ImpactStats = {
  mealsSaved: 12482,
  familiesFed: 850,
  co2SavedTons: 4.2,
  donorsCount: 500,
};

export const personalImpact: PersonalImpact = {
  mealsShared: 42,
  rankLabel: "Top 5%",
  points: 1240,
  familiesReached: 8,
  level: 4,
  levelLabel: "Level 4 Donor",
  nextMilestone: "Golden Heart",
  nextMilestoneProgress: 85,
};

export const hotspots: Hotspot[] = [
  { id: "h1", area: "Nallur", requestsPending: 12 },
  { id: "h2", area: "Kokuvil", requestsPending: 7 },
  { id: "h3", area: "Chundikuli", requestsPending: 5 },
];

export const communityStories: CommunityStory[] = [
  {
    id: "s1",
    quote:
      "KindPlate changed how we see surplus. I shared extra produce from my garden and it went straight to a local family. My heart was full.",
    author: "Arul",
    role: "Local Resident",
    image: AppImages.elderChild,
    rating: 5,
  },
  {
    id: "s2",
    quote:
      "Being a volunteer driver is so rewarding. The app makes it easy to find where help is needed most. Efficiency with a human soul.",
    author: "Meera",
    role: "Volunteer",
    image: AppImages.volunteerDelivery,
    rating: 5,
  },
  {
    id: "s3",
    quote:
      "As a restaurant owner, wasting food used to hurt. Now my surplus fuels students and elders in the neighbourhood. Truly a blessing.",
    author: "Jaffna Bistro",
    role: "Business Donor",
    image: AppImages.communityMeal,
    rating: 5,
  },
];

export const badges: Badge[] = [
  { id: "b1", name: "First Plate", icon: "restaurant", description: "Shared your first meal", unlocked: true },
  { id: "b2", name: "Kind Streak", icon: "flame", description: "7 days of giving", unlocked: true },
  { id: "b3", name: "Century Club", icon: "ribbon", description: "100 meals shared", unlocked: true },
  { id: "b4", name: "Local Hero", icon: "shield-checkmark", description: "Top donor in your area", unlocked: true },
  { id: "b5", name: "Golden Heart", icon: "heart", description: "500 meals milestone", unlocked: false },
  { id: "b6", name: "Green Guardian", icon: "leaf", description: "1 ton CO₂ saved", unlocked: false },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: "l1", name: "Priya Selvam", avatarUrl: avatar(45), points: 2140, meals: 640 },
  { id: "l2", name: "Nirmala T.", avatarUrl: avatar(32), points: 1890, meals: 590 },
  { id: "l3", name: "Jaffna Bistro", avatarUrl: avatar(15), points: 1720, meals: 512 },
  { id: "l4", name: "Kajan Ratnam", avatarUrl: avatar(12), points: 1240, meals: 482 },
  { id: "l5", name: "Suresh K.", avatarUrl: avatar(51), points: 1180, meals: 430 },
];

/** Past, completed donations for history views. */
export const donationHistory: Donation[] = [
  {
    id: "h_d1",
    title: "30 Rice & Curry Meals",
    description: "Community kitchen surplus delivered to Nallur center.",
    imageUrl: IMG.riceCurry,
    category: "prepared",
    quantity: 30,
    unit: "meals",
    status: "delivered",
    createdAt: "2026-07-21T11:00:00Z",
    expiresAt: "2026-07-21T15:00:00Z",
    expiresInLabel: "Delivered",
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6685,
      longitude: 80.0074,
      address: "Temple Rd",
      area: "Nallur",
      city: "Jaffna",
      distanceKm: 0.4,
    },
  },
  {
    id: "h_d2",
    title: "Fresh Vegetable Crates",
    description: "Surplus produce from the Sunday market shared with 12 families.",
    imageUrl: IMG.produce,
    category: "produce",
    quantity: 3,
    unit: "crates",
    status: "delivered",
    createdAt: "2026-07-18T07:30:00Z",
    expiresAt: "2026-07-18T18:00:00Z",
    expiresInLabel: "Delivered",
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6612,
      longitude: 80.0255,
      address: "Market St",
      area: "Jaffna Central",
      city: "Jaffna",
      distanceKm: 1.1,
    },
  },
  {
    id: "h_d3",
    title: "Bakery Boxes",
    description: "End-of-day bread and buns handed to the girls' home.",
    imageUrl: IMG.bread,
    category: "bakery",
    quantity: 8,
    unit: "boxes",
    status: "delivered",
    createdAt: "2026-07-12T19:00:00Z",
    expiresAt: "2026-07-13T08:00:00Z",
    expiresInLabel: "Delivered",
    donor: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl },
    location: {
      latitude: 9.6740,
      longitude: 80.009,
      address: "Chundikuli",
      area: "Chundikuli",
      city: "Jaffna",
      distanceKm: 3.2,
    },
  },
];

// ---------------------------------------------------------------------------
// Volunteer dashboard
// ---------------------------------------------------------------------------
export const volunteerPickups: VolunteerPickup[] = [
  {
    id: "vp1",
    org: "Jaffna Heritage Hotel",
    area: "Nallur",
    distanceKm: 1.2,
    tags: ["Vegetarian", "Hot Meal"],
    freshnessLabel: "45m",
    freshnessLevel: "fresh",
    imageUrl: IMG.riceCurry,
  },
  {
    id: "vp2",
    org: "Grand Bazaar Fruits",
    area: "Jaffna Central",
    distanceKm: 2.8,
    tags: ["Fruits"],
    freshnessLabel: "12m",
    freshnessLevel: "urgent",
    imageUrl: IMG.fruitBasket,
  },
  {
    id: "vp3",
    org: "Tilco City Hotel",
    area: "Chundikuli",
    distanceKm: 3.5,
    tags: ["Prepared", "Bulk"],
    freshnessLabel: "1h 10m",
    freshnessLevel: "fresh",
    imageUrl: IMG.plate,
  },
];

export const volunteerRoute = {
  greeting: "Hello, Arul",
  pickupsToday: 3,
  routeKm: 12,
  currentArea: "Nallur Area",
  peopleFed: 142,
  foodSavedKg: 48,
  deliveries: 12,
};

// ---------------------------------------------------------------------------
// Recipient dashboard
// ---------------------------------------------------------------------------
export const requestSteps: RequestStep[] = [
  { key: "posted", label: "Posted", icon: "create-outline", done: true },
  { key: "approved", label: "Approved", icon: "checkmark-circle-outline", done: true },
  { key: "assigned", label: "Assigned", icon: "person-outline", done: true },
  { key: "collected", label: "Collected", icon: "cube-outline", done: false },
  { key: "delivered", label: "Delivered", icon: "bicycle-outline", done: false },
];

export const recipientDriver = {
  name: "Ravi Kumaran",
  etaLabel: "Estimated arrival in 15 mins",
  avatarUrl: avatar(52),
};

// ---------------------------------------------------------------------------
// NGO dashboard
// ---------------------------------------------------------------------------
export const ngoSummary = {
  totalImpact: 12482,
  impactDeltaLabel: "+14% vs last month",
  volunteers: 342,
  co2Tons: 4.2,
};

export const approvalQueue: ApprovalItem[] = [
  {
    id: "aq1",
    title: "50x Mixed Vegetable Curry",
    from: "Jaffna City Hotel Kitchen",
    note: "Prepared for a cancelled banquet. All fresh and temperature-controlled.",
    agoLabel: "2h ago",
    categoryLabel: "VEG",
    imageUrl: IMG.riceCurry,
  },
  {
    id: "aq2",
    title: "Assorted Fresh Fruits",
    from: "Nallur Local Market vendor",
    note: "End of day surplus. Perfect for immediate consumption or juicing.",
    agoLabel: "4h ago",
    categoryLabel: "FRESH",
    imageUrl: IMG.fruitBasket,
  },
  {
    id: "aq3",
    title: "Bakery Boxes — 30 units",
    from: "Local Bakery Jaffna",
    note: "Freshly baked bread and buns, packed for distribution.",
    agoLabel: "5h ago",
    categoryLabel: "BAKERY",
    imageUrl: IMG.bread,
  },
];

export const orgLeaderboard: OrgLeader[] = [
  { id: "o1", rank: 1, name: "Cargills Food City", points: 842, tons: 2.1 },
  { id: "o2", rank: 2, name: "Jetwing Jaffna", points: 715, tons: 1.4 },
  { id: "o3", rank: 3, name: "Tilco City Hotel", points: 680, tons: 0.9 },
  { id: "o4", rank: 4, name: "Local Bakery Jaffna", points: 420, tons: 0.3 },
];

export const heatZones: HeatZone[] = [
  {
    id: "z1",
    area: "Thirunelveli North",
    level: "high",
    families: 120,
    latitude: 9.6829,
    longitude: 80.0169,
  },
  {
    id: "z2",
    area: "Chundikuli District",
    level: "moderate",
    families: 45,
    latitude: 9.6641,
    longitude: 80.0255,
  },
  {
    id: "z3",
    area: "Nallur",
    level: "high",
    families: 88,
    latitude: 9.6745,
    longitude: 80.0311,
  },
];

// ---------------------------------------------------------------------------
// Admin / App-owner
// ---------------------------------------------------------------------------

/** The signed-in administrator profile (single-login, elevated role). */
export const adminUser: User = {
  id: "u_admin",
  name: "KindPlate Admin",
  role: "admin",
  roleLabel: "App Administrator",
  avatarUrl: avatar(68),
  verified: true,
  points: 0,
  rank: "—",
  level: 99,
  levelLabel: "Operations",
  mealsShared: 0,
  familiesFed: 0,
  rating: 5,
  badgesUnlocked: 0,
  memberSince: "Jan 2024",
  language: "English",
};

/** Presentation metadata for each donor kind — distinct scannable icons. */
export const DONOR_KIND_META: Record<
  DonorKind,
  { label: string; icon: string }
> = {
  restaurant: { label: "Restaurant", icon: "restaurant" },
  hotel: { label: "Hotel", icon: "bed" },
  supermarket: { label: "Supermarket", icon: "cart" },
  event: { label: "Event", icon: "sparkles" },
  individual: { label: "Individual", icon: "person" },
};

/** Status → color/label mapping reused across every admin surface. */
export const ADMIN_STATUS_META: Record<
  AdminDonationStatus,
  { label: string; tone: "sage" | "maroon" | "teal" | "warning" | "error" | "neutral" }
> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "sage" },
  assigned: { label: "Assigned", tone: "teal" },
  collected: { label: "Collected", tone: "teal" },
  delivered: { label: "Delivered", tone: "sage" },
  rejected: { label: "Rejected", tone: "error" },
  expiring: { label: "Expiring Soon", tone: "error" },
};

export const adminStats: AdminStat[] = [
  { key: "pending", label: "Pending Approvals", value: 6, icon: "hourglass-outline", tone: "warning", route: "/(admin)/review" },
  { key: "active", label: "Active Deliveries", value: 4, icon: "bicycle-outline", tone: "teal", route: "/admin/tracking" },
  { key: "expiring", label: "Expiring Soon", value: 2, icon: "alarm-outline", tone: "error", route: "/(admin)/review" },
  { key: "zones", label: "High-Demand Zones", value: 3, icon: "flame-outline", tone: "maroon", route: "/(admin)/demand" },
];

export const adminActivity: ActivityItem[] = [
  { id: "af1", icon: "add-circle", text: "New donation posted by Jaffna Heritage Hotel", agoLabel: "2m", tone: "teal" },
  { id: "af2", icon: "bicycle", text: "Volunteer Ravi accepted pickup #123", agoLabel: "8m", tone: "sage" },
  { id: "af3", icon: "checkmark-done", text: "Delivery #118 completed at Nallur Center", agoLabel: "21m", tone: "sage" },
  { id: "af4", icon: "alarm", text: "Fruit basket from Grand Bazaar expiring soon", agoLabel: "26m", tone: "warning" },
  { id: "af5", icon: "flag", text: "Missing proof photo flagged on delivery #114", agoLabel: "42m", tone: "maroon" },
];

export const reviewQueue: ReviewDonation[] = [
  {
    id: "rq1",
    donorName: "Jaffna Heritage Hotel",
    donorKind: "hotel",
    title: "50x Mixed Vegetable Curry",
    category: "prepared",
    quantity: 50,
    unit: "portions",
    prePackaged: false,
    cookedAtLabel: "Cooked 10:40 AM",
    minutesLeft: 82,
    occasion: "Cancelled banquet",
    area: "Nallur",
    distanceKm: 1.2,
    description:
      "Prepared for a cancelled banquet. All fresh, temperature-controlled and ready for immediate pickup.",
    imageUrl: IMG.riceCurry,
    status: "pending",
  },
  {
    id: "rq2",
    donorName: "Grand Bazaar Fruits",
    donorKind: "supermarket",
    title: "Assorted Fresh Fruit Crates",
    category: "produce",
    quantity: 4,
    unit: "crates",
    prePackaged: true,
    cookedAtLabel: "Packed 11:15 AM",
    minutesLeft: 34,
    occasion: "End-of-day surplus",
    area: "Jaffna Central",
    distanceKm: 2.8,
    description:
      "End of day surplus, perfect for immediate distribution or juicing. Pre-boxed and ready.",
    imageUrl: IMG.fruitBasket,
    status: "expiring",
  },
  {
    id: "rq3",
    donorName: "Anusha & Family",
    donorKind: "individual",
    title: "Home-cooked Rice & Sambar — 15 pax",
    category: "veg",
    quantity: 15,
    unit: "packets",
    prePackaged: true,
    cookedAtLabel: "Cooked 11:50 AM",
    minutesLeft: 168,
    occasion: "Family function",
    area: "Kokuvil",
    distanceKm: 3.1,
    description:
      "Leftover from a family function, freshly packed into individual lunch parcels.",
    imageUrl: IMG.lunchPacket,
    status: "pending",
  },
  {
    id: "rq4",
    donorName: "Tilco City Hotel",
    donorKind: "hotel",
    title: "Evening Short-Eats — 20 pax",
    category: "bakery",
    quantity: 20,
    unit: "portions",
    prePackaged: false,
    cookedAtLabel: "Cooked 12:20 PM",
    minutesLeft: 210,
    occasion: "Buffet surplus",
    area: "Chundikuli",
    distanceKm: 3.5,
    description:
      "Vadai, cutlets and short eats from the lunch buffet. Needs containers on pickup.",
    imageUrl: IMG.snacks,
    status: "pending",
  },
  {
    id: "rq5",
    donorName: "Wedding @ Green Grass Hall",
    donorKind: "event",
    title: "Biryani & Curry — 80 pax",
    category: "non_veg",
    quantity: 80,
    unit: "portions",
    prePackaged: false,
    cookedAtLabel: "Cooked 09:30 AM",
    minutesLeft: 18,
    occasion: "Wedding surplus",
    area: "Thirunelveli",
    distanceKm: 4.4,
    description:
      "Large surplus from a wedding. Time-critical — needs bulk collection immediately.",
    imageUrl: IMG.riceCurry,
    status: "expiring",
  },
];

export const availableVolunteers: AvailableVolunteer[] = [
  {
    id: "av1",
    name: "Ravi Kumaran",
    avatarUrl: avatar(52),
    hasVehicle: true,
    vehicleLabel: "Van",
    activeLoad: 1,
    rating: 4.9,
    points: 1820,
    distanceKm: 0.8,
  },
  {
    id: "av2",
    name: "Meera Jeya",
    avatarUrl: avatar(45),
    hasVehicle: true,
    vehicleLabel: "Scooter",
    activeLoad: 0,
    rating: 4.8,
    points: 1540,
    distanceKm: 1.6,
  },
  {
    id: "av3",
    name: "Suresh K.",
    avatarUrl: avatar(51),
    hasVehicle: false,
    vehicleLabel: "On foot",
    activeLoad: 2,
    rating: 4.6,
    points: 980,
    distanceKm: 2.2,
  },
  {
    id: "av4",
    name: "Nirmala T.",
    avatarUrl: avatar(32),
    hasVehicle: true,
    vehicleLabel: "Three-wheeler",
    activeLoad: 1,
    rating: 4.9,
    points: 2010,
    distanceKm: 3.0,
  },
];

export const ngoPartners: NgoPartner[] = [
  { id: "np1", name: "Sarvodaya Jaffna", area: "Nallur", activeCases: 4 },
  { id: "np2", name: "Red Cross — Northern", area: "Jaffna Central", activeCases: 7 },
  { id: "np3", name: "Caritas HUDEC", area: "Chundikuli", activeCases: 2 },
];

export const pointsLedger: PointsLedgerEntry[] = [
  { id: "pl1", name: "Nirmala T.", role: "volunteer", avatarUrl: avatar(32), points: 2010, contributions: 96 },
  { id: "pl2", name: "Priya Selvam", role: "donor", avatarUrl: avatar(45), points: 2140, contributions: 64 },
  { id: "pl3", name: "Ravi Kumaran", role: "volunteer", avatarUrl: avatar(52), points: 1820, contributions: 88 },
  { id: "pl4", name: "Jaffna Bistro", role: "donor", avatarUrl: avatar(15), points: 1720, contributions: 51 },
  { id: "pl5", name: "Kajan Ratnam", role: "donor", avatarUrl: avatar(12), points: 1240, contributions: 48 },
  { id: "pl6", name: "Suresh K.", role: "volunteer", avatarUrl: avatar(51), points: 980, contributions: 40 },
];

export const pointsRules: PointsRule[] = [
  { id: "pr1", label: "Prepared meal donation", detail: "Per approved cooked-food post", points: "+50", icon: "restaurant" },
  { id: "pr2", label: "Dry goods / produce", detail: "Per approved dry donation", points: "+30", icon: "cube" },
  { id: "pr3", label: "Completed delivery", detail: "Per verified drop-off (volunteer)", points: "+40", icon: "bicycle" },
  { id: "pr4", label: "Hard-to-reach zone bonus", detail: "Extra for high-demand areas", points: "+25", icon: "flame" },
  { id: "pr5", label: "On-time freshness bonus", detail: "Delivered within safe window", points: "+15", icon: "alarm" },
];

export const managedUsers: ManagedUser[] = [
  { id: "mu1", name: "Jaffna Heritage Hotel", role: "donor", avatarUrl: avatar(15), verified: true, status: "active", meta: "Hotel • 51 donations" },
  { id: "mu2", name: "Ravi Kumaran", role: "volunteer", avatarUrl: avatar(52), verified: true, status: "active", meta: "Van verified • 88 pickups" },
  { id: "mu3", name: "Anusha & Family", role: "recipient", avatarUrl: avatar(20), verified: false, status: "pending", meta: "ID pending review" },
  { id: "mu4", name: "Sarvodaya Jaffna", role: "ngo", avatarUrl: avatar(60), verified: false, status: "pending", meta: "New NGO partner request" },
  { id: "mu5", name: "Suresh K.", role: "volunteer", avatarUrl: avatar(51), verified: true, status: "active", meta: "No vehicle • 40 pickups" },
  { id: "mu6", name: "Fake Vendor X", role: "donor", avatarUrl: avatar(9), verified: false, status: "suspended", meta: "Reported • quality issues" },
];

export const disputeCases: DisputeCase[] = [
  {
    id: "dc1",
    title: "No proof photo uploaded",
    reason: "Delivery marked complete without a proof-of-delivery photo.",
    donationRef: "#114 • Bakery Boxes",
    reporter: "System check",
    agoLabel: "42m ago",
    severity: "medium",
    status: "open",
  },
  {
    id: "dc2",
    title: "Delivery overdue",
    reason: "Volunteer has not updated status for over 1 hour after pickup.",
    donationRef: "#121 • Fruit Crates",
    reporter: "Auto-monitor",
    agoLabel: "1h ago",
    severity: "high",
    status: "open",
  },
  {
    id: "dc3",
    title: "Recipient complaint",
    reason: "Recipient reported quantity received was less than posted.",
    donationRef: "#109 • Rice & Curry",
    reporter: "Nallur Center",
    agoLabel: "3h ago",
    severity: "low",
    status: "open",
  },
];

export const deliveryLifecycles: DeliveryLifecycle[] = [
  {
    id: "dl1",
    title: "15 Lunch Packets — Veg",
    donor: "Anusha & Family",
    recipient: "Nallur Community Center",
    volunteer: "Ravi Kumaran",
    currentStep: 3,
    flagged: false,
    updatedAgoLabel: "Updated 4m ago",
  },
  {
    id: "dl2",
    title: "Assorted Fruit Crates",
    donor: "Grand Bazaar Fruits",
    recipient: "Chundikuli Girls' Home",
    volunteer: "Meera Jeya",
    currentStep: 2,
    flagged: true,
    updatedAgoLabel: "No update in 1h",
  },
  {
    id: "dl3",
    title: "30 Rice & Curry Meals",
    donor: "Jaffna Heritage Hotel",
    recipient: "Vadamarachchi Relief Point",
    volunteer: "Nirmala T.",
    currentStep: 4,
    flagged: false,
    proofPhoto: IMG.riceCurry,
    updatedAgoLabel: "Delivered 20m ago",
  },
];

export { IMG as MockImages };
