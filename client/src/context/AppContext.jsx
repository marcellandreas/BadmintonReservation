"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

// Set base URL sekali saja
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // currency
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "IDR";

  // state tambahan
  const [isOwner, setIsOwner] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // clerk
  const { user } = useUser();
  const { getToken } = useAuth();

  const getUser = async () => {
    try {
      const token = await getToken();
      if (!token) return; // jangan fetch kalau belum ada token

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(data, "apakah data terbaca");

      if (data.success) {
        setIsOwner(data.role === "owner");
        setCartItems(data.cartData || {});
        console.log("Data user berhasil diambil");
      } else {
        console.log("Gagal ambil data user, coba lagi 5 detik");
        setTimeout(getUser, 5000);
      }
    } catch (error) {
      console.error("Context error:", error);
      toast.error(error.message || "Gagal memuat data user");
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const value = {
    axios,
    getToken,
    user,
    currency,
    isOwner,
    cartItems,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
