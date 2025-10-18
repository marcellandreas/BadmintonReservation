const express = require('express');
const router = express.Router();
const timeSlotController = require('../controller/timeSlotController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', timeSlotController.getAllTimeSlots);
router.get('/available', timeSlotController.getAvailableTimeSlots);
router.get('/:id', timeSlotController.getTimeSlotById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, timeSlotController.createTimeSlot);
router.put('/:id', authMiddleware, adminMiddleware, timeSlotController.updateTimeSlot);
router.delete('/:id', authMiddleware, adminMiddleware, timeSlotController.deleteTimeSlot);

module.exports = router;