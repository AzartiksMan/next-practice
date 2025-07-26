import type { UserData } from "@/shared/types/userData.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: UserData | null;
  setUser: (user: UserData) => void;
  logout: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "my-counter-store",
    }
  )
);
