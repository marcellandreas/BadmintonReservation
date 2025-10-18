import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/BadmintonReservation`);
    console.log("success / Database connected");
  } catch (error) {
    console.log(" Database connected Failed", error.message);
  }
};

export default connectDB;
