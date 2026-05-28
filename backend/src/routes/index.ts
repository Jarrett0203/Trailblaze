import { Router } from "express";
import tripsRouter from "./trips";
import emailRouter from "./email"

const router = Router();

router.use("/trips", tripsRouter);
router.use("/email", emailRouter);

export default router;