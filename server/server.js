import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controller/ClerkWebHooks.js";

import userRouter from "./routes/userRoute.js";
// import courtRouter from "./routes/courtRoute.js";
// import timeSlotRouter from "./routes/timeSlotRoute.js";
// import bookingRouter from "./routes/bookingRoute.js";

const port = process.env.PORT || 5000;
await connectDB();

const app = express();
app.use(cors());

// middleware setup
app.use(express.json());
app.use(clerkMiddleware());

// api to listen clerk webhooks
app.post("/api/clerk", clerkWebhooks);

// Routes
app.get("/", (req, res) => res.send("API Successfully Connected"));

// define api routes

app.use("/api/user", userRouter);
// app.use("/api/courts", courtRouter);
// app.use("/api/timeslots", timeSlotRouter);
// app.use("/api/bookings", bookingRouter);

// Start server
app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
