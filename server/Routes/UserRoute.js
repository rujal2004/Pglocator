const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// ✅ IMPORT CONTROLLER FUNCTIONS (THIS WAS MISSING)
const { 
  getAllTrips,
  addToWhisList,
  getAllPropety,
  getAllReservation
} = require('../Controllers/UserController');


// ✅ PUT SPECIFIC ROUTES FIRST
router.get("/:userId/properties", authMiddleware, getAllPropety);
router.get("/:userId/trips", authMiddleware, getAllTrips);
router.get("/:userId/reservations", authMiddleware, getAllReservation);

// 🔥 KEEP THIS LAST (dynamic route)
router.patch('/:userId/:listingId', authMiddleware, addToWhisList);

module.exports = router;