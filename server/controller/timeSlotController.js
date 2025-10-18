const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');

// Get all timeslots
exports.getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find().sort({ startTime: 1 });
    res.status(200).json({ success: true, data: timeSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get timeslot by ID
exports.getTimeSlotById = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'TimeSlot not found' });
    }
    res.status(200).json({ success: true, data: timeSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new timeslot (admin only)
exports.createTimeSlot = async (req, res) => {
  try {
    const newTimeSlot = new TimeSlot(req.body);
    const savedTimeSlot = await newTimeSlot.save();
    res.status(201).json({ success: true, data: savedTimeSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update timeslot (admin only)
exports.updateTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'TimeSlot not found' });
    }
    
    res.status(200).json({ success: true, data: timeSlot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete timeslot (admin only)
exports.deleteTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);
    
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'TimeSlot not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available timeslots by date and court
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, courtId } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    
    // Get all timeslots
    const timeSlots = await TimeSlot.find({ isAvailable: true });
    
    // If courtId is provided, check bookings for that court on that date
    if (courtId) {
      const bookings = await Booking.find({
        court: courtId,
        bookingDate: new Date(date),
        status: { $ne: 'cancelled' }
      });
      
      // Filter out booked timeslots
      const bookedTimeSlotIds = bookings.map(booking => booking.timeSlot.toString());
      const availableTimeSlots = timeSlots.filter(
        timeSlot => !bookedTimeSlotIds.includes(timeSlot._id.toString())
      );
      
      return res.status(200).json({ success: true, data: availableTimeSlots });
    }
    
    res.status(200).json({ success: true, data: timeSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};