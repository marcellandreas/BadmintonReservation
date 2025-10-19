"use client";

import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import { UserButton, useClerk } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [open, setOpen] = useState(false);

  const { openSignIn } = useClerk();
  const { user, getToken, isOwner } = useAppContext();

  const OrderIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-receipt"
      >
        <path d="M4 2h16v20l-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2z" />
        <path d="M8 6h8" />
        <path d="M8 10h8" />
      </svg>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-black text-white fixed top-0 left-0 w-full z-50 transition-all duration-300 shadow-md`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 font-medium">
        <Link href="/" className="hover:text-red-600 transition-colors">
          Home
        </Link>
        <Link href="/booking" className="hover:text-red-600 transition-colors">
          Booking
        </Link>
        <Link href="/about" className="hover:text-red-600 transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-red-600 transition-colors">
          Contact
        </Link>

        {/* User Section */}
        <div className="flex gap-x-2 justify-center items-center">
          <div>
            {isOwner && (
              <Link
                href="/dashboard"
                className="btn-light ring-1 ring-slate-900/5 py-1 text-xs font-semibold"
              >
                Dashboard
              </Link>
            )}
          </div>
          {user ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "40px",
                    height: "40px",
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Booking"
                  labelIcon={<OrderIcon />}
                  onClick={() => (window.location.href = "/my-booking")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg
          width="24"
          height="18"
          viewBox="0 0 24 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="2" rx="1" fill="white" />
          <rect y="8" width="24" height="2" rx="1" fill="white" />
          <rect y="16" width="24" height="2" rx="1" fill="white" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-black text-white flex-col items-start gap-4 px-6 py-5 border-t border-neutral-800 md:hidden transition-all`}
      >
        <Link href="/" className="hover:text-red-600 transition">
          Home
        </Link>
        <Link href="/booking" className="hover:text-red-600 transition">
          Booking
        </Link>
        <Link href="/about" className="hover:text-red-600 transition">
          About
        </Link>
        <Link href="/contact" className="hover:text-red-600 transition">
          Contact
        </Link>

        {!user && (
          <button
            onClick={openSignIn}
            className="w-full text-center mt-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
