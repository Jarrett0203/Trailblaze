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
    latitude: number,
    longitude: number,
  },
  viewport: {
    low: {
      latitude: number,
      longitude: number
    },
    high: {
      latitude: number,
      longitude: number
    }
  }
}