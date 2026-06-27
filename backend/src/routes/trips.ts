import { Router } from "express";
import { addPlace, createTrip, getTrip, updateItinerary } from '../controllers/tripController';

const router = Router();

router.post("/", createTrip);
router.get("/:tripId", getTrip);
router.post("/:tripId/places", addPlace);
router.post("/:tripId/itinerary", updateItinerary)

export default router;
