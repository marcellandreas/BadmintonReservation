import express from "express";
import { getUserProfile } from "../controller/userController.js";
import authUser from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authUser, getUserProfile);

export default userRouter;