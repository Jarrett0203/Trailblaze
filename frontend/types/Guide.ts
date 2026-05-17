export type FeaturedGuide = {
  id: string;
  place: string;
  description: string;
  image: string;
  user: {
    name: string;
    avatar: string;
    views: number;
  };
};

export type Guide = {
  id: string;
  name: string;
  image: string;
  description: string;
  attributes: {
    location: string;
    type: string;
    bestTime: string;
    attractions: string[];
  }
}

export const guides: Guide[] = [
  {
    id: "1",
    name: "Fushimi Inari Taisha",
    image: "https://images.unsplash.com/photo-1584830286962-07c9d5256c80?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "The iconic Shinto shrine famous for thousands of vermilion torii gates winding up the forested Mount Inari. A timeless symbol of Kyoto and one of Japan's most photographed landmarks.",
    attributes: {
      location: "Fushimi, Kyoto",
      type: "Heritage / Shrine",
      bestTime: "November - March",
      attractions: ["Senbon Torii Gates", "Mt. Inari Hike", "Fox Shrines"],
    },
  },
  {
    id: "2",
    name: "Hakone",
    image: "https://images.unsplash.com/photo-1583901362846-13c55e045708?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A mountain resort town renowned for its natural hot springs, sweeping views of Mount Fuji, and open-air art museums. The perfect escape from Tokyo.",
    attributes: {
      location: "Kanagawa Prefecture",
      type: "Hot Spring / Nature",
      bestTime: "October - April",
      attractions: ["Lake Ashi", "Hakone Ropeway", "Owakudani Valley", "Onsen"],
    },
  },
  {
    id: "3",
    name: "Nara Park",
    image: "https://images.unsplash.com/photo-1723569199334-c702187819e0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A UNESCO World Heritage Site where over 1,200 free-roaming sacred deer share the park with ancient temples and towering lantern-lined pathways.",
    attributes: {
      location: "Nara, Nara Prefecture",
      type: "Heritage / Nature",
      bestTime: "October - March",
      attractions: ["Todai-ji Temple", "Kasuga Grand Shrine", "Free-roaming Deer"],
    },
  },
  {
    id: "4",
    name: "Okinawa",
    image: "https://images.unsplash.com/photo-1664888882993-5bc4b906db5e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "A tropical island paradise with crystal-clear turquoise waters, vibrant coral reefs, and a unique Ryukyu culture distinct from mainland Japan.",
    attributes: {
      location: "Okinawa Prefecture",
      type: "Beach / Culture",
      bestTime: "May - October",
      attractions: ["Kerama Islands", "Shurijo Castle", "Snorkeling & Diving"],
    },
  },
];

export const featuredGuides: FeaturedGuide[] = [
  {
    id: '1',
    place: "Arashiyama, Kyoto",
    description:
      "Bamboo groves, temple trails and a river town wrapped in timeless calm.",
    image:
      "https://res-4.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1514372943/kyoto/Kyoto1112_1",
    user: {
      name: "Yuki Tanaka",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      views: 612,
    },
  },
  {
    id: '2',
    place: "Hakone, Kanagawa",
    description:
      "Soak in an onsen with Mount Fuji framed perfectly on the horizon.",
    image:
      "https://res-3.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1517190738/kanagawa/Kanagawa2663_1",
    user: {
      name: "Kenji Mori",
      avatar: "https://randomuser.me/api/portraits/men/92.jpg",
      views: 934,
    },
  },
  {
    id: '3',
    place: "Yakushima Island",
    description:
      "Ancient cedar forests, misty peaks and wild coastlines straight from a Miyazaki film.",
    image:
      "https://res-1.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1514405767/kagoshima/Kagoshima1783_2",
    user: {
      name: "Hana Fujiwara",
      avatar: "https://randomuser.me/api/portraits/women/70.jpg",
      views: 278,
    },
  },
];
