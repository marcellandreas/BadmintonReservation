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
import authMiddleware from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Protected routes (require authentication)
bookingRouter.get("/my-bookings", authMiddleware, getUserBookings);
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/:id", authMiddleware, getBookingById);
bookingRouter.put("/:id/cancel", authMiddleware, cancelBooking);

// Admin routes
bookingRouter.get("/", authMiddleware, getAllBookings);
bookingRouter.put("/:id/status", authMiddleware, updateBookingStatus);
bookingRouter.put("/:id/payment", authMiddleware, updatePaymentStatus);

export default bookingRouter;
