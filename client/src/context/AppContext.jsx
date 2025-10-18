'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_BACKEND_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

   // currency 
   const currency = process.env.NEXT_CURRENCY;

     // clerk
  const { user } = useUser();
  const { getToken } = useAuth();

  const getUser = async () => {
  try {
    const { data } = await axios.get("/api/user", {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    console.log(data, "apakah data terbaca")
    if (data.success) {
      setIsOwner(data.role === "owner");
      console.log(isOwner, "after login");
      setCartItems(data.cartData || {});
      console.log("data success apakah bisa?");
    } else {
      console.log("else dari data success");
      // Retry fetch user details after 5 sec
      setTimeout(() => {
        getUser();
      }, 5000);
    }
  } catch (error) {
    console.log("context error");
    toast.error(error.message);
  }
};

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

 const value = {
   axios, getToken, user, currency
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);