import { create } from "zustand";
import { User, Role } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  login: (user: User, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Set cookie for Next.js Middleware route guarding
      document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `userRole=${user.role}; path=/; max-age=604800; SameSite=Lax`;
    }
    set({ user, token, isLoading: false });
  },

  updateUser: (updatedUser: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedUser };
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser));
      }
      set({ user: newUser });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "userRole=; path=/; max-age=0; SameSite=Lax";
    }
    set({ user: null, token: null, isLoading: false });
  },

  initialize: () => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
          const user = JSON.parse(storedUser);
          set({ user, token, isLoading: false });
          return;
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    set({ user: null, token: null, isLoading: false });
  },
}));
