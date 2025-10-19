const timeSlots = [
  {
    startTime: "08:00",
    endTime: "09:00",
    duration: 60,
    price: 50000,
    isAvailable: true,
  },
  {
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    price: 50000,
    isAvailable: true,
  },
  {
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    price: 60000,
    isAvailable: true,
  },
  {
    startTime: "11:00",
    endTime: "12:00",
    duration: 60,
    price: 60000,
    isAvailable: true,
  },
  {
    startTime: "12:00",
    endTime: "13:00",
    duration: 60,
    price: 70000,
    isAvailable: true,
  },
  {
    startTime: "13:00",
    endTime: "14:00",
    duration: 60,
    price: 70000,
    isAvailable: true,
  },
  {
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    price: 70000,
    isAvailable: true,
  },
  {
    startTime: "15:00",
    endTime: "16:00",
    duration: 60,
    price: 80000,
    isAvailable: true,
  },
  {
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    price: 80000,
    isAvailable: true,
  },
  {
    startTime: "17:00",
    endTime: "18:00",
    duration: 60,
    price: 100000,
    isAvailable: true,
  },
  {
    startTime: "18:00",
    endTime: "19:00",
    duration: 60,
    price: 100000,
    isAvailable: true,
  },
  {
    startTime: "19:00",
    endTime: "20:00",
    duration: 60,
    price: 120000,
    isAvailable: true,
  },
  {
    startTime: "20:00",
    endTime: "21:00",
    duration: 60,
    price: 120000,
    isAvailable: true,
  },
  {
    startTime: "21:00",
    endTime: "22:00",
    duration: 60,
    price: 100000,
    isAvailable: true,
  },
  {
    startTime: "22:00",
    endTime: "23:00",
    duration: 60,
    price: 80000,
    isAvailable: true,
  },
];

const courts = [
  {
    name: "Court 1 - Flypower Premium",
    description:
      "Lapangan badminton dengan karpet Flypower premium, penerangan LED profesional, dan AC. Cocok untuk latihan kompetitif dan turnamen.",
    features: [
      "Karpet Flypower Premium",
      "Penerangan LED 1000 Lux",
      "Full AC",
      "Sound System",
      "Tribun Penonton 50 orang",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl Flypower",
    price: 80000, // Base price (bisa override dari timeslot)
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
  },
  {
    name: "Court 2 - Professional",
    description:
      "Lapangan standar internasional dengan karpet kualitas tinggi. Dilengkapi dengan sistem pencahayaan optimal untuk permainan malam.",
    features: [
      "Karpet Victor Professional",
      "Penerangan LED 800 Lux",
      "Ventilasi Optimal",
      "Kursi Wasit",
      "Locker Room",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl Victor",
    price: 75000,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83af502bd?w=800&q=80",
  },
  {
    name: "Court 3 - Standard Plus",
    description:
      "Lapangan indoor dengan karpet berkualitas baik. Ideal untuk latihan rutin dan bermain santai bersama teman.",
    features: [
      "Karpet BWF Standard",
      "Penerangan LED 600 Lux",
      "Kipas Angin",
      "Water Dispenser",
      "Bangku Pemain",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl Standard",
    price: 70000,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
  },
  {
    name: "Court 4 - Economy",
    description:
      "Lapangan indoor dengan fasilitas standar. Cocok untuk pemula dan latihan casual dengan harga terjangkau.",
    features: [
      "Karpet Standard",
      "Penerangan Cukup",
      "Ventilasi Natural",
      "Bangku Pemain",
      "Toilet Bersama",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl",
    price: 60000,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83af502bd?w=800&q=80",
  },
  {
    name: "Court 5 - VIP Exclusive",
    description:
      "Lapangan VIP dengan fasilitas lengkap dan private. Dilengkapi ruang tunggu khusus, AC, dan sound system premium.",
    features: [
      "Karpet Li-Ning Premium",
      "Penerangan LED 1200 Lux",
      "Full AC Private",
      "Premium Sound System",
      "Private Lounge",
      "Mini Bar",
      "Shower Room Private",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl Li-Ning",
    price: 150000,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
  },
  {
    name: "Court 6 - Tournament Arena",
    description:
      "Lapangan khusus turnamen dengan standar internasional BWF. Dilengkapi sistem streaming dan tribun besar.",
    features: [
      "Karpet BWF Certified",
      "Penerangan LED 1500 Lux",
      "Full AC",
      "Streaming Camera",
      "Score Board Digital",
      "Tribun 100 orang",
      "VIP Lounge",
    ],
    courtType: "Indoor",
    surfaceType: "Karpet Vinyl BWF Standard",
    price: 200000,
    isAvailable: true,
    image:
      "https://images.unsplash.com/photo-1553778263-73a83af502bd?w=800&q=80",
  },
];

import mongoose from "mongoose";
import "dotenv/config";
import Court from "./models/Court.js";
import TimeSlot from "./models/TimeSlot.js";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGO_URI}/BadmintonReservation`);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional)
    await Court.deleteMany({});
    await TimeSlot.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert TimeSlots
    const insertedTimeSlots = await TimeSlot.insertMany(timeSlots);
    console.log(`✅ Inserted ${insertedTimeSlots.length} timeslots`);

    // Insert Courts
    const insertedCourts = await Court.insertMany(courts);
    console.log(`✅ Inserted ${insertedCourts.length} courts`);

    console.log("\n🎉 Seed data completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - TimeSlots: ${insertedTimeSlots.length}`);
    console.log(`   - Courts: ${insertedCourts.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
