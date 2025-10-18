import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import TimeSlot from "../models/TimeSlot.js";

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("court")
      .populate("timeSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("court")
      .populate("timeSlot")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("court")
      .populate("timeSlot");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this booking" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { courtId, timeSlotId, bookingDate } = req.body;

    if (!courtId || !timeSlotId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Court ID, TimeSlot ID, and booking date are required",
      });
    }

    // Check if court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return res
        .status(404)
        .json({ success: false, message: "Court not found" });
    }

    // Check if timeslot exists
    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot) {
      return res
        .status(404)
        .json({ success: false, message: "TimeSlot not found" });
    }

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      court: courtId,
      timeSlot: timeSlotId,
      bookingDate: new Date(bookingDate),
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This court is already booked for the selected date and time",
      });
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.userId,
      court: courtId,
      timeSlot: timeSlotId,
      bookingDate: new Date(bookingDate),
      totalPrice: timeSlot.price,
      status: "pending",
      paymentStatus: "unpaid",
    });

    const savedBooking = await newBooking.save();

    // Populate with court and timeslot details
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("court")
      .populate("timeSlot");

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("court")
      .populate("timeSlot");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Payment status is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    )
      .populate("court")
      .populate("timeSlot");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Check if user is authorized
    if (booking.user.toString() !== req.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
