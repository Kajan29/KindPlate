import { create } from "zustand";
import { AppLanguage, User, UserRole } from "@/types/food";
import { adminUser, currentUser } from "@data/mockData";

export const ROLE_LABELS: Record<UserRole, string> = {
  donor: "Community Donor",
  volunteer: "Volunteer Rider",
  recipient: "Recipient",
  ngo: "NGO Partner",
  admin: "App Administrator",
};

interface RegisterInput {
  name: string;
  email: string;
}

interface UserStore {
  user: User;
  isAuthenticated: boolean;
  /**
   * Whether the user has picked an in-app activity (Donate / Volunteer /
   * Inform a Place) yet. New sign-ups start as a normal user with no activity
   * chosen, so the Home tab shows the activity chooser first.
   */
  activityChosen: boolean;
  /**
   * Email/password sign-in (mock). Pass `asAdmin` to sign in through the same
   * login form as the app administrator (single-login for every role).
   */
  login: (asAdmin?: boolean) => void;
  /** Create an account as a normal user — no role is chosen here anymore. */
  register: (input: RegisterInput) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  /** Pick what to do inside the app; sets the role and reveals its dashboard. */
  chooseActivity: (role: UserRole) => void;
  /** Clear the chosen activity so the user can pick again. */
  resetActivity: () => void;
  setLanguage: (language: AppLanguage) => void;
}

/**
 * Current user / session state, backed by mock data. Authentication is
 * simulated. Registration creates a plain user; the activity (and therefore
 * the role) is chosen later, from inside the app.
 */
export const useUserStore = create<UserStore>((set) => ({
  user: currentUser,
  isAuthenticated: false,
  activityChosen: false,

  login: (asAdmin = false) =>
    set((state) => ({
      isAuthenticated: true,
      // Returning users already have a role, so skip the activity chooser.
      activityChosen: !asAdmin,
      user: asAdmin ? adminUser : state.user.role === "admin" ? currentUser : state.user,
    })),

  register: ({ name }) =>
    set(() => ({
      isAuthenticated: true,
      activityChosen: false,
      user: {
        ...currentUser,
        name: name.trim() || currentUser.name,
      },
    })),

  logout: () => set({ isAuthenticated: false, activityChosen: false }),

  setRole: (role) =>
    set((state) => ({ user: { ...state.user, role, roleLabel: ROLE_LABELS[role] } })),

  chooseActivity: (role) =>
    set((state) => ({
      activityChosen: true,
      user: { ...state.user, role, roleLabel: ROLE_LABELS[role] },
    })),

  resetActivity: () => set({ activityChosen: false }),

  setLanguage: (language) =>
    set((state) => ({ user: { ...state.user, language } })),
}));
