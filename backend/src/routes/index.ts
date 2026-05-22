import { Router } from "express";
import tripsRouter from "./trips";

const router = Router();

router.use("/trips", tripsRouter);

export default router;