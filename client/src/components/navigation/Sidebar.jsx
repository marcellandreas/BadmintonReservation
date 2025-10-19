"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { assets } from "@/assets/data";
import { useAppContext } from "@/context/AppContext";

const SideBar = ({ children }) => {
  const { isOwner, user } = useAppContext();
  const pathname = usePathname();

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: assets.dashboard,
    },
    {
      path: "/dashboard/add-product",
      label: "Add Product",
      icon: assets.squarePlus,
    },
    {
      path: "/dashboard/list-product",
      label: "List Product",
      icon: assets.list,
    },
  ];

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner]);

  return (
    <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row bg-white min-h-screen">
      {/* sidebar */}
      <div className="max-md:flexCenter flex flex-col justify-between bg-primary sm:m-3 md:min-w-[20%] md:min-h-[97vh] shadow rounded-xl">
        <div className="flex flex-col gap-y-6 max-md:items-center md:flex-col md:pt-5">
          <div className="w-full flex justify-between md:flex-col">
            {/* logo */}
            <div className="flex flex-1 p-3 lg:pl-12">
              <Link href="/" className="flex items-end">
                <img src={assets.logoImg} alt="Logo Image" className="h-12" />
                <div>
                  <span className="hidden sm:block font-extrabold text-3xl relative top-1 left-1">
                    Badminton
                  </span>
                  <span className="hidden sm:block font-extrabold text-xs relative left-1.5 tracking-[10px] uppercase text-solid">
                    Reservation
                  </span>
                </div>
              </Link>
            </div>

            {/* user mobile */}
            <div className="md:hidden flex items-center gap-3 md:bg-primary rounded-b-xl p-2 pl-5 lg:pl-10 md:mt-10">
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
          </div>

          {/* navigation */}
          <div className="flex md:flex-col md:gap-x-5 gap-y-8 md:mt-4">
            {navItems.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-x-2 p-5 lg:pl-12 text-[13px] font-bold sm:!text-sm cursor-pointer h-10 transition-all ${
                    isActive
                      ? "bg-solid/10 border-r-4 border-solidOne rounded-none"
                      : "rounded-xl hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={link.icon}
                    alt={link.label}
                    className="hidden md:block"
                    width={18}
                  />
                  <div>{link.label}</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* user desktop */}
        <div className="hidden md:flex items-center gap-3 md:bg-primary rounded-b-xl p-2 md:mt-10 border-t border-slate-900/15 justify-center">
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
      </div>

      {/* main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SideBar;
