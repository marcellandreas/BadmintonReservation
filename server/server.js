import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controller/ClerkWebHooks.js";

import userRouter from "./routes/userRoute.js";

const port = process.env.PORT || 5000;
await connectDB();

const app = express();
app.use(cors());

// PENTING: Webhook route HARUS sebelum express.json()
// Dan pakai express.raw() untuk preserve raw body
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Middleware setup (SETELAH webhook route)
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API Successfully Connected"));

// define api routes
app.use("/api/user", userRouter);

// Start server
app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
