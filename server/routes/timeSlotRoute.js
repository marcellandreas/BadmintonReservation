import express from "express";
import {
  getAllTimeSlots,
  getAvailableTimeSlots,
  getTimeSlotById,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} from "../controller/timeSlotController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const timeSlotRouter = express.Router();

// Public routes
timeSlotRouter.get("/", getAllTimeSlots);
timeSlotRouter.get("/available", getAvailableTimeSlots);
timeSlotRouter.get("/:id", getTimeSlotById);

// Admin routes
timeSlotRouter.post("/", authMiddleware, createTimeSlot);
timeSlotRouter.put("/:id", authMiddleware, updateTimeSlot);
timeSlotRouter.delete("/:id", authMiddleware, deleteTimeSlot);

export default timeSlotRouter;
