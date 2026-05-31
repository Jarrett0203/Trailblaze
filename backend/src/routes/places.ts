import axios from "axios";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/autocomplete", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ error: "Failed to fetch autocomplete results" });
  }
});

router.get("/details/:placeId", async (req: Request, res: Response) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": req.header('X-Goog-FieldMask'),
        }
      }
    )

    res.json(response.data);
  } catch (error) {
    console.error("Place details error:", error);
    res.status(500).json({ error: "Failed to fetch place details"});
  }
})


router.get("/photo", async (req: Request, res: Response) => {
  const {photoName, maxWidthPx = 800} = req.query;

  if (!photoName) {
    return res.status(400).json({ error: "Photo name is required!"});
  }

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/${photoName}/media`,
      {
        params: {
          maxWidthPx,
          key: process.env.GOOGLE_API_KEY,
          skipHttpRedirect: true
        }
      }
    )
    const { photoUri } = response.data;
    res.json({ photoUri });
  } catch (error) {
    console.error("Photo proxy error: ", error);
    res.status(500).json({ error: "Failed to fetch photo"})
  }
})

export default router;