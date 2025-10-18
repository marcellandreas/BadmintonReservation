const express = require('express');
const router = express.Router();
const courtController = require('../controller/courtController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', courtController.getAllCourts);
router.get('/available', courtController.getAvailableCourts);
router.get('/:id', courtController.getCourtById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, courtController.createCourt);
router.put('/:id', authMiddleware, adminMiddleware, courtController.updateCourt);
router.delete('/:id', authMiddleware, adminMiddleware, courtController.deleteCourt);

module.exports = router;