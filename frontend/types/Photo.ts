import { AuthorAttribution } from "./AuthorAttribution"

export type Photo = {
  name: string,
  widthPx: number,
  heightPx: number,
  authorAttributions: AuthorAttribution[],
  flagContentUri: string,
  googleMapsUri: string
}

