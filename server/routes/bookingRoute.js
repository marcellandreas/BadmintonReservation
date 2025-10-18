import express from "express";
import {
  getUserBookings,
  createBooking,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
} from "../controller/bookingController.js";
import  authMiddleware from "../middleware/authMiddleware.js";

const routerBooking = express.Router();

// Protected routes (require authentication)
routerBooking.get("/my-bookings", authMiddleware, getUserBookings);
routerBooking.post("/", authMiddleware, createBooking);
routerBooking.get("/:id", authMiddleware, getBookingById);
routerBooking.put("/:id/cancel", authMiddleware, cancelBooking);

// Admin routes
routerBooking.get("/", authMiddleware, getAllBookings);
routerBooking.put("/:id/status", authMiddleware, updateBookingStatus);
routerBooking.put("/:id/payment", authMiddleware, updatePaymentStatus);

export default routerBooking;
