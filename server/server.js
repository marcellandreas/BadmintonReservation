import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import { clerkMiddleware } from "@clerk/express";

// import router
import userRouter from "./routes/userRoute.js";
import clerkWebhooks from "./controller/ClerkWebHooks.js";
import bookingRouter from "./routes/bookingRoute.js";
import courtRouter from "./routes/courtRoute.js";
import timeSlotRouter from "./routes/timeSlotRoute.js";

const port = process.env.PORT || 5000;

await connectDB();

const app = express();
app.use(cors());

// middleware setup
app.use(express.json());

// clrek
app.use(clerkMiddleware());

// api to listen clerk webhooks
app.post("/api/clerk", clerkWebhooks);

// route endpoint
app.get("/", (req, res) => res.send("Api Successfully Connected"));

// define api routes
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/court", courtRouter);
app.use("/api/timeslot", timeSlotRouter);

// start
app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);

console.log(Math.floor(Date.now() / 1000), "berapa");
