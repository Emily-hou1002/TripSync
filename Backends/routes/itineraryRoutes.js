// routes/itineraryRoutes.js
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

router.get('/', itineraryController.getAllItineraries);
router.get('/:id', itineraryController.getItineraryById);
router.post('/', itineraryController.createItinerary);
router.put('/:id', itineraryController.updateItinerary);
router.delete('/:id', itineraryController.deleteItinerary);

module.exports = router;
