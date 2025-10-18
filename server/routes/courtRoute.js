import express from "express";
import {
  getAllCourts,
  getAvailableCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from "../controllers/courtController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const courtRouter = express.Router();

// Public routes
courtRouter.get("/", getAllCourts);
courtRouter.get("/available", getAvailableCourts);
courtRouter.get("/:id", getCourtById);

// Admin routes
courtRouter.post("/", authMiddleware, createCourt);
courtRouter.put("/:id", authMiddleware, updateCourt);
courtRouter.delete("/:id", authMiddleware, deleteCourt);

export default courtRouter;
