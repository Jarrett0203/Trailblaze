import { Request, Response } from "express";
import { User } from "../models/User";
import Trip from "../models/Trip";
import { fetchPlaceDetails } from "./placeController";

export const createTrip = async (req: Request, res: Response) => {
  try {
    const {
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      budget = 0,
      expenses = [],
      placesToVisit = [],
      itinerary = [],
      travelers = [],
      clerkUserId,
      userData = {},
    } = req.body;

    if (!clerkUserId) {
      return res.status(401).json({ error: "User id is required" });
    }
    if (
      !tripName ||
      !startDate ||
      !endDate ||
      !startDay ||
      !endDay ||
      !background
    ) {
      return res.status(400).json({ error: "Missing required trip fields" });
    }
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      const { email, name } = userData;
      if (!email) {
        return res.status(400).json({ error: "User email is required" });
      }
      user = new User({ clerkUserId, email, name });
      await user.save();
    }

    const trip = new Trip({
      tripName,
      startDate,
      endDate,
      startDay,
      endDay,
      background,
      host: user._id,
      travelers: [user._id, ...travelers],
      budget,
      expenses,
      placesToVisit,
      itinerary,
    });

    await trip.save();
    res.status(201).json({ message: "Trip created successfully!", trip });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

export const getTrips = async (req: Request, res: Response) => {
  try {
    const clerkUserId = req.query.clerkUserId?.toString();
    const email = req.query.email?.toString();

    if (!clerkUserId) return res.status(401).json({ error: "User id is required" });

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      if (!email) return res.status(400).json({ error: "User email is required" });
      user = new User({ clerkUserId, email, name: "" });
      await user.save();
    }

    const trips = await Trip.find({
      $or: [{ host: user._id }, { travelers: user._id }],
    }).populate("host travelers");

    res.status(200).json({ trips });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export const getTrip = async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const clerkUserId = req.query.clerkUserId?.toString();

  if (!clerkUserId) {
    return res.status(401).json({ error: "User id is required!" });
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const trip = await Trip.findById(tripId).populate("host travelers");
    if (!trip) {
      return res.status(404).json({ error: "Trip not found!" });
    }

    res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

export const addPlace = async (req: Request, res: Response) => {
  const { tripId } = req.params;
  const { placeId } = req.body;
  if (!placeId) {
    return res.status(400).json({ error: "Place id is required!" });
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ error: "Trip is not found!" });
  }

  try {
    const placeData = await fetchPlaceDetails(placeId, true);

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $push: { placesToVisit: placeData } },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Place added successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Add Place Error:", error);
    res.status(500).json({ error: "Failed to add place to trip!" });
  }
};

export const updateItinerary = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { placeId, date, placeData } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required!" });
    }
    if (!placeId && !placeData) {
      return res
        .status(400)
        .json({ error: "placeId and placeData are missing!" });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(400).json({ error: "Trip not found!" });
    }

    const activityData = {
      date,
      ...(placeData ?? (await fetchPlaceDetails(placeId, true))),
    };

    const existingItinerary = trip.itinerary.find((item) => item.date == date);
    let updatedTrip;
    if (existingItinerary) {
      updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $push: { "itinerary.$[elem].activities": activityData } },
        { arrayFilters: [{ "elem.date": date }], new: true },
      );
    } else {
      updatedTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $push: { itinerary: { date, activities: [activityData] } } },
        { new: true },
      );
    }

    res.status(200).json({
      message: "Activity added to itinerary successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error adding itinerary", error);
    res.status(500).json({ error: "Failed to add activity to itinerary!" });
  }
};

export const addExpense = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { description, category, price, splitOption, paidBy, date } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.expense.push({ description, category, price, splitOption, paidBy, date });
    await trip.save();

    return res
      .status(201)
      .json({ message: "Expense added", expense: trip.expense });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const editExpense = async (req: Request, res: Response) => {
  try {
    const { tripId, expenseId } = req.params;
    const { description, category, price, splitOption, paidBy } = req.body;

    const trip = await Trip.findOneAndUpdate(
      {
        _id: tripId,
        "expense._id": expenseId,
      },
      {
        $set: {
          "expense.$.description": description,
          "expense.$.category": category,
          "expense.$.price": price,
          "expense.$.splitOption": splitOption,
          "expense.$.paidBy": paidBy,
        },
      },
      { new: true },
    );

    if (!trip) {
      return res.status(404).json({ error: "Trip or expense not found" });
    }

    res
      .status(200)
      .json({ message: "Expense updated", expenses: trip.expense });
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { tripId, expenseId } = req.params;

    const trip = await Trip.findByIdAndUpdate(
      tripId,
      {
        $pull: { expense: { _id: expenseId } },
      },
      { new: true },
    );

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ message: "Expense deleted", expense: trip.expense });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
