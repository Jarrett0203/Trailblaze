import { PlaceToVisit } from "./PlaceToVisit";

export const tripBackground = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export type Traveler = {
  _id: string;
  clerkUserId: string;
  email: string;
  name: string;
  __v: number;
};

export type Trip = {
  _id: string;
  tripName: string;
  startDate: string;
  endDate: string;
  startDay: string;
  endDay: string;
  background: string;
  host: Traveler;
  travelers: Traveler[];
  budget: number;
  placesToVisit: PlaceToVisit[];
  itinerary: any[];
  expense: any[];
  createdAt?: string;
  __v?: number;
};

export type FormattedTrip = {
  id: string;
  name: string;
  date: string;
  image: string; 
  places: number;
  daysLeft: number;
}