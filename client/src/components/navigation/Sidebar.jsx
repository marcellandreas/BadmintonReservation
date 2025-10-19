"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaChartLine,
  FaCalendarCheck,
  FaBuilding,
  FaClock,
} from "react-icons/fa";

const SideBar = ({ children }) => {
  const { isOwner, user } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: FaChartLine,
    },
    {
      path: "/dashboard/bookings",
      label: "Bookings",
      icon: FaCalendarCheck,
    },
    {
      path: "/dashboard/courts",
      label: "Courts",
      icon: FaBuilding,
    },
    {
      path: "/dashboard/timeslots",
      label: "Time Slots",
      icon: FaClock,
    },
  ];

  useEffect(() => {
    if (user && !isOwner) {
      router.push("/");
    }
  }, [isOwner, user, router]);

  if (!user || !isOwner) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="flex flex-col justify-between bg-white md:min-w-[260px] md:min-h-screen shadow-lg">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <span className="block font-extrabold text-xl text-gray-800">
                  Badminton
                </span>
                <span className="block text-xs text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* User Mobile */}
          <div className="md:hidden flex items-center gap-3 p-4 border-b border-gray-200">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: "42px",
                    height: "42px",
                  },
                },
              }}
            />
            <div className="text-sm font-semibold text-gray-800 capitalize">
              {user?.firstName} {user?.lastName}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex md:flex-col p-3 gap-2">
            {navItems.map((link) => {
              const isActive = pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="hidden md:block">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Desktop */}
        <div className="hidden md:flex items-center gap-3 p-4 border-t border-gray-200">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "42px",
                  height: "42px",
                },
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 capitalize truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default SideBar;
