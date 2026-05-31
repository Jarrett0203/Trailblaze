export type PlaceToVisit = {
  name: string,
  phoneNumber?: string,
  website?: string,
  openingHours: string[],
  photos: string[],
  reviews: [
    {
      authorName: string,
      rating: number,
      text: string
    }
  ],
  types: string[],
  formattedAddress: string,
  briefDescription?: string,
  location: {
    lat: number,
    lng: number,
  },
  viewport: {
    low: {
      lat: number,
      lng: number
    },
    high: {
      lat: number,
      lng: number
    }
  }
}