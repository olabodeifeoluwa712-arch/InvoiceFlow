import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      otpId: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setCurrentUser: (user) => set({ currentUser: user }),
      setOtpId: (id) => set({ otpId: id }),
      // Clear everything on logout
      logout: () => set({ accessToken: null, currentUser: null }),
    }),
    {
      name: 'auth-storage', // Key name in localStorage
    }
  )
);

export default useAuthStore
