import Court from "../models/Court.js";

// Get all courts
export const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.status(200).json({ success: true, data: courts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get court by ID
export const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res
        .status(404)
        .json({ success: false, message: "Court not found" });
    }
    res.status(200).json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new court (admin only)
export const createCourt = async (req, res) => {
  try {
    const newCourt = new Court(req.body);
    const savedCourt = await newCourt.save();
    res.status(201).json({ success: true, data: savedCourt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update court (admin only)
export const updateCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!court) {
      return res
        .status(404)
        .json({ success: false, message: "Court not found" });
    }

    res.status(200).json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete court (admin only)
export const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);

    if (!court) {
      return res
        .status(404)
        .json({ success: false, message: "Court not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available courts by date
export const getAvailableCourts = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    const courts = await Court.find({ isAvailable: true });

    res.status(200).json({ success: true, data: courts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
