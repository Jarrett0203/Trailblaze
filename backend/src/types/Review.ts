import { AuthorAttribution } from "./AuthorAttribution";
import { GoogleDate } from "./GoogleDate";
import { LocalizedText } from "./LocalizedText";

export type Review = {
  name: string;
  relativePublishTimeDescription: string;
  text: LocalizedText;
  originalText: LocalizedText;
  rating: number;
  authorAttribution: AuthorAttribution;
  publishTime: string;
  flagContentUri: string;
  googleMapsUri: string;
  visitDate: GoogleDate;
};
