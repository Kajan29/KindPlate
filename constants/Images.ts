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
};
