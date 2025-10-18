"use client";

import Image from "next/image";
import React, { useState } from "react";
import { GiShuttlecock } from "react-icons/gi";
import { MdOutlineHome } from "react-icons/md";
import { TbTexture } from "react-icons/tb";

const Booking = () => {
  const [accordion, setAccordion] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleSelectTime = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDay = (date) =>
    date.toLocaleDateString("id-ID", { weekday: "long" });
  const formatDate = (date) =>
    date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });

  const toDateValue = (date) => date.toISOString().split("T")[0];

  return (
    <div className="min-h-[80vh] container mx-auto my-4">
      <h3 className="text-xl font-semibold mb-4">Pilih Lapangan</h3>

      {/* section selected date */}
      <section className="w-full bg-white/80 backdrop-blur-lg border border-slate-200 shadow-md rounded-2xl p-5 flex gap-4 overflow-x-auto items-center">
        {days.map((date, index) => {
          const dateValue = toDateValue(date);
          const isSelected = selectedDate === dateValue;

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(dateValue)}
              className={`min-w-[90px] text-center border border-slate-300/50 bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100 hover:shadow-md transition-all rounded-xl p-2 cursor-pointer ${
                isSelected ? "ring-2 ring-indigo-500 scale-105" : ""
              }`}
            >
              <h5 className="text-sm font-semibold text-slate-700 capitalize">
                {formatDay(date)}
              </h5>
              <span className="font-medium text-xs text-slate-600">
                {formatDate(date)}
              </span>
            </div>
          );
        })}
        <div className="flex items-center text-slate-400 font-semibold text-lg px-2">
          |
        </div>
        <div className="flex flex-col items-center">
          <label
            htmlFor="customDate"
            className="text-xs text-slate-600 mb-1 font-medium"
          >
            Pilih tanggal lain
          </label>
          <input
            id="customDate"
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={toDateValue(new Date())}
            max={(() => {
              const d = new Date();
              d.setMonth(d.getMonth() + 3);
              return toDateValue(d);
            })()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <span className="text-xs text-slate-400 mt-1">
            Maksimal 3 bulan dari hari ini
          </span>
        </div>
        <div className="flex items-center text-slate-400 font-semibold text-lg px-2">
          |
        </div>
        {selectedDate && (
          <div className="min-w-[120px] text-center  rounded-xl p-2">
            <h5 className="text-sm font-semibold text-slate-700 capitalize">
              Tanggal Booking
            </h5>
            <span className="font-medium text-xs text-slate-600">
              {formatDay(new Date(selectedDate + "T00:00:00"))}{" "}
              {formatDate(new Date(selectedDate + "T00:00:00"))}
            </span>
          </div>
        )}
      </section>

      {/* card lapangan 1 */}
      <div className=" mt-10 grid grid-cols-6 gap-x-5">
        <div className=" bg-amber-300 col-span-2">
          <Image src="/next.svg" alt="a" width={200} height={240} />
        </div>
        <div className=" col-span-4 bg-amber-300 p-5 ">
          <div>
            <h2 className=" font-bold text-2xl">Lapangan 1</h2>
            <div>lapangan dengan karpet flypower</div>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <GiShuttlecock /> <span>Badminton</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineHome /> <span>Indoor</span>
            </div>
            <div className="flex items-center gap-2">
              <TbTexture /> <span>Karpet dengan bahan vinyl</span>
            </div>
          </div>
          <button
            onClick={() => setAccordion(!accordion)}
            className=" bg-red-800 p-4 text-white font-semibolds rounded-xl cursor-pointer"
          >
            6 Jadwal Tersedia <span>^</span>
          </button>
          {/* accordion akan terbuka jika cts button (6 jadwal tersedia diclick) */}
          {accordion && (
            <div className="bg-white w-full p-5 mt-3 flex gap-4 flex-wrap">
              {/* 10:00 - 11:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">10:00 - 11:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 11:00 - 12:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">11:00 - 12:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 12:00 - 13:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">12:00 - 13:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 13:00 - 14:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">13:00 - 14:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 14:00 - 15:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">14:00 - 15:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 15:00 - 16:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">15:00 - 16:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 16:00 - 17:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">16:00 - 17:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 17:00 - 18:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">17:00 - 18:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 18:00 - 19:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">18:00 - 19:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 19:00 - 20:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">19:00 - 20:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 20:00 - 21:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">20:00 - 21:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 21:00 - 22:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">21:00 - 22:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 22:00 - 23:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">22:00 - 23:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* card lapangan 2 */}
      <div className=" mt-10 grid grid-cols-6 gap-x-5">
        <div className=" bg-amber-300 col-span-2">
          <Image src="/next.svg" alt="a" width={200} height={240} />
        </div>
        <div className=" col-span-4 bg-amber-300 p-5 ">
          <div>
            <h2 className=" font-bold text-2xl">Lapangan 1</h2>
            <div>lapangan dengan karpet flypower</div>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <GiShuttlecock /> <span>Badminton</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineHome /> <span>Indoor</span>
            </div>
            <div className="flex items-center gap-2">
              <TbTexture /> <span>Karpet dengan bahan vinyl</span>
            </div>
          </div>
          <button
            onClick={() => setAccordion(!accordion)}
            className=" bg-red-800 p-4 text-white font-semibolds rounded-xl cursor-pointer"
          >
            6 Jadwal Tersedia <span>^</span>
          </button>
          {/* accordion akan terbuka jika cts button (6 jadwal tersedia diclick) */}
          {accordion && (
            <div className="bg-white w-full p-5 mt-3 flex gap-4 flex-wrap">
              {/* 10:00 - 11:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">10:00 - 11:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 11:00 - 12:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">11:00 - 12:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 12:00 - 13:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">12:00 - 13:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 13:00 - 14:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">13:00 - 14:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 14:00 - 15:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">14:00 - 15:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 15:00 - 16:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">15:00 - 16:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 16:00 - 17:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">16:00 - 17:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 17:00 - 18:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">17:00 - 18:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 18:00 - 19:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">18:00 - 19:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 19:00 - 20:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">19:00 - 20:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 20:00 - 21:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">20:00 - 21:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 21:00 - 22:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">21:00 - 22:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 22:00 - 23:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">22:00 - 23:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* card lapangan 3 */}
      <div className=" mt-10 grid grid-cols-6 gap-x-5">
        <div className=" bg-amber-300 col-span-2">
          <Image src="/next.svg" alt="a" width={200} height={240} />
        </div>
        <div className=" col-span-4 bg-amber-300 p-5 ">
          <div>
            <h2 className=" font-bold text-2xl">Lapangan 1</h2>
            <div>lapangan dengan karpet flypower</div>
          </div>
          <div className="flex flex-col gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <GiShuttlecock /> <span>Badminton</span>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineHome /> <span>Indoor</span>
            </div>
            <div className="flex items-center gap-2">
              <TbTexture /> <span>Karpet dengan bahan vinyl</span>
            </div>
          </div>
          <button
            onClick={() => setAccordion(!accordion)}
            className=" bg-red-800 p-4 text-white font-semibolds rounded-xl cursor-pointer"
          >
            6 Jadwal Tersedia <span>^</span>
          </button>
          {/* accordion akan terbuka jika cts button (6 jadwal tersedia diclick) */}
          {accordion && (
            <div className="bg-white w-full p-5 mt-3 flex gap-4 flex-wrap">
              {/* 10:00 - 11:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">10:00 - 11:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 11:00 - 12:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">11:00 - 12:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 12:00 - 13:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">12:00 - 13:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 13:00 - 14:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">13:00 - 14:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 14:00 - 15:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">14:00 - 15:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 15:00 - 16:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">15:00 - 16:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 16:00 - 17:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">16:00 - 17:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 17:00 - 18:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">17:00 - 18:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 18:00 - 19:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">18:00 - 19:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 19:00 - 20:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">19:00 - 20:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 20:00 - 21:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">20:00 - 21:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>

              {/* 21:00 - 22:00 */}
              <div className="p-3 cursor-not-allowed w-32 h-24 flex justify-center items-center flex-col rounded-xl">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">21:00 - 22:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Booked
                </span>
              </div>

              {/* 22:00 - 23:00 */}
              <div className="p-3 border border-slate-900 w-32 h-24 flex justify-center items-center flex-col rounded-xl cursor-pointer">
                <span className="text-xs">60 menit</span>
                <h4 className="font-bold text-base">22:00 - 23:00</h4>
                <span className="text-base font-semibold text-gray-600">
                  Rp. 70.000
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
