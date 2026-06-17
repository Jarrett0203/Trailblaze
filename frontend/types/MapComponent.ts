import { PlaceToVisit } from "./PlaceToVisit";

export interface MapHandle {
  fitToPlaces: (places: PlaceToVisit[]) => void;
  moveToPlace: (place: PlaceToVisit) => void;
}

export interface MapComponentProps {
  places: PlaceToVisit[];
  selectedIndex: number;
}