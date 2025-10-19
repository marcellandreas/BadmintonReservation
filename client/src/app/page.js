"use client";

import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { axios } = useAppContext();
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axios.get("/api/court");
        setCourts(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    fetchCourts();
  }, [axios]);

  const steps = [
    { step: "1", title: "Choose Date", desc: "Pick the perfect day to play." },
    {
      step: "2",
      title: "Select Time & Court",
      desc: "Find your ideal slot and court.",
    },
    { step: "3", title: "Confirm Booking", desc: "Get ready for your match!" },
  ];

  return (
    <main className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-between px-8 md:px-20 py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/14605729/pexels-photo-14605729.jpeg"
            alt="Badminton court"
            className="w-full h-full object-cover    bg-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-lg space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Smash Your Day with <span className="text-red-500">Badmintoon</span>
          </h1>
          <p className="text-gray-300">
            Book courts, challenge friends, and enjoy your game anytime.
          </p>
          <button
            onClick={() => (window.location.href = "/booking")}
            className="bg-red-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-400 transition-all"
          >
            Book Now
          </button>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 md:px-20 text-center bg-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-gray-700 rounded-2xl p-6 flex-1 shadow-lg"
            >
              <div className="text-red-500 text-4xl font-bold mb-3">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Courts Preview */}
      <section className="py-20 px-8 md:px-20 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Courts
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4">
          {courts.map((court, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="min-w-[300px] rounded-2xl overflow-hidden shadow-lg bg-gray-800 flex-shrink-0"
            >
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-red-500">{court.name}</h3>
                <p className="text-gray-300 text-sm">{court.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 md:px-20 bg-red-500 text-white text-center rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play?</h2>
        <p className="mb-6 text-gray-100">
          Book your court now and enjoy a smooth badminton experience.
        </p>
        <button
          onClick={() => (window.location.href = "/booking")}
          className="bg-white text-red-500 font-semibold px-8 py-4 rounded-full hover:bg-gray-200 transition-all"
        >
          Book Now
        </button>
      </section>
    </main>
  );
}
