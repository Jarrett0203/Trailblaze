import { Router } from "express";
import {
  autoComplete,
  getPhoto,
  getPhotoFromLocation,
  getPlaceDetailsFromPlaceId,
  getPlaceIdFromLocation,
} from "../controllers/placeController";

const router = Router();

router.post("/autocomplete", autoComplete);
router.get("/photo", getPhoto);
router.get("/place-photo", getPhotoFromLocation);
router.get("/text-search", getPlaceIdFromLocation);
router.get("/details/:placeId", getPlaceDetailsFromPlaceId);

export default router;
