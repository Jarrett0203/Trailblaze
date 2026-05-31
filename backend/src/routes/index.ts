import { Router } from "express";
import tripsRouter from "./trips";
import emailRouter from "./email"
import placesRouter from "./places"

const router = Router();

router.use("/trips", tripsRouter);
router.use("/email", emailRouter);
router.use("/places", placesRouter);

export default router;