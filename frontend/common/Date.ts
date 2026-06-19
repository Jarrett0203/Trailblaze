import dayjs from "dayjs";
import { Trip } from "../types/Trip";

  export function generateTripDates(trip: Trip) {
    const start = dayjs(trip.startDate || new Date());
    const end = dayjs(trip.endDate || new Date());
    const days = [];

    for (
      let day = start;
      day.isBefore(end) || day.isSame(end);
      day = day.add(1, "day")
    ) {
      days.push(day);
    }

    return days.map((day) => ({
      label: day.format("ddd D/M"),
      value: day.format("YYYY-MM-DD"),
    }));
  }