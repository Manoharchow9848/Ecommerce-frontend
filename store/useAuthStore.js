import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  cart: null,
  orders: null,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/auth/check",{
        headers: {
          Authorization: `Bearer ${token}`,
          
          
        },
      });
      set({
        authUser: res.data,
        isAuthenticated: true,
        cart: res.data.cart || null,
      });
      
    } catch (error) {
      set({
        authUser: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("token");
     
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({
        authUser: res.data.user,
        isAuthenticated: true,
        cart: res.data.user.cart || null,
      });
      const token = res.data.token;
      console.log(token);
      
      localStorage.setItem("token", token);
      toast.success(res.data.message);
      console.log(res.data.user);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong during login"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },
  register: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during registration"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout:async()=>{
    try {
      localStorage.removeItem("token");
      set({
        authUser: null,
        isAuthenticated: false,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during logout"
      );
      
    }

  },
  getOrders: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/auth/orders",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ orders: res.data.orders });
      
    } catch (error) {
      
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while fetching orders"
      );
    }
  }
}));
