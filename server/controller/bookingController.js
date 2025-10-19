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
    if (
      booking.user._id.toString() !== req.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { bookingDate, items, notes } = req.body;

    // Validation
    if (!bookingDate || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Booking date and items array are required",
      });
    }

    // Validate userId from middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.courtId || !item.timeSlotId || !item.price) {
        return res.status(400).json({
          success: false,
          message: "Each item must have courtId, timeSlotId, and price",
        });
      }
    }

    const parsedDate = new Date(bookingDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date format",
      });
    }

    // Validate courts, timeslots, and check for conflicts
    const validatedItems = [];

    for (const item of items) {
      const court = await Court.findById(item.courtId);
      if (!court) {
        return res.status(404).json({
          success: false,
          message: `Court not found for ID: ${item.courtId}`,
        });
      }

      const timeSlot = await TimeSlot.findById(item.timeSlotId);
      if (!timeSlot) {
        return res.status(404).json({
          success: false,
          message: `TimeSlot not found for ID: ${item.timeSlotId}`,
        });
      }

      // Check existing bookings
      const existingBooking = await Booking.findOne({
        "items.court": item.courtId,
        "items.timeSlot": item.timeSlotId,
        bookingDate: parsedDate,
        status: { $ne: "cancelled" },
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: `Court "${court.name}" is already booked for the selected time`,
        });
      }

      validatedItems.push({
        court: item.courtId,
        timeSlot: item.timeSlotId,
        price: item.price,
      });
    }

    // Calculate total
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    // Create single booking with multiple items
    const newBooking = new Booking({
      user: req.userId,
      items: validatedItems,
      bookingDate: parsedDate,
      totalPrice,
      status: "pending",
      paymentStatus: "unpaid",
      notes: notes || "",
    });

    const savedBooking = await newBooking.save();

    // Populate
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate("user", "name email")
      .populate("items.court")
      .populate("items.timeSlot");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
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
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
