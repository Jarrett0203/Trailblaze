import { Router } from "express";
import { addExpense, addPlace, createTrip, deleteExpense, editExpense, getTrip, getTrips, updateItinerary } from '../controllers/tripController';

const router = Router();

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:tripId", getTrip);
router.post("/:tripId/places", addPlace);
router.post("/:tripId/itinerary", updateItinerary);
router.post("/:tripId/expenses", addExpense);
router.patch("/:tripId/expenses/:expenseId", editExpense);
router.delete("/:tripId/expenses/:expenseId", deleteExpense);

export default router;
