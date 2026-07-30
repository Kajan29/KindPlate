import { ImageSourcePropType } from "react-native";

/**
 * Local, bundled photography sourced from the KindPlate design set (authentic
 * Jaffna scenes). Using local assets keeps the hero imagery reliable offline.
 */
export const AppImages: Record<string, ImageSourcePropType> = {
  // Hands passing a food parcel at a sunset market — the emotional hero shot.
  heroParcel: require("../assets/images/hero-parcel.png"),
  // Volunteer on a motorbike handing a tiffin carrier to a family.
  volunteerDelivery: require("../assets/images/volunteer-delivery.png"),
  // Community sharing a meal under a banyan tree.
  communityMeal: require("../assets/images/community-meal.png"),
  // Elderly Tamil woman with a child on a village doorstep.
  elderChild: require("../assets/images/elder-child.png"),

  // Photographic app backgrounds (warm, on-theme community photography).
  // Children being served a hot meal — the primary, on-theme app backdrop.
  bgMealHall: require("../assets/backgrounds/meal-hall.jpg"),
  // A joyful cluster of smiling children — bright, uplifting.
  bgJoyfulKids: require("../assets/backgrounds/joyful-kids.jpg"),
  // A child in a doorway holding food — quiet, dignified.
  bgDoorwayChild: require("../assets/backgrounds/doorway-child.jpg"),
  // Two siblings in warm golden light.
  bgSiblings: require("../assets/backgrounds/siblings.jpg"),
};

/** Curated backdrops for the app-wide ScreenBackground surface. */
export const AppBackgrounds = {
  primary: AppImages.bgMealHall,
  joyful: AppImages.bgJoyfulKids,
  quiet: AppImages.bgDoorwayChild,
  warm: AppImages.bgSiblings,
} as const;
