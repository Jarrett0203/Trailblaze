export type Guide = {
  place: string,
  description: string,
  image: string,
  user: {
    name: string,
    avatar: string,
    views: number
  }
}

export const guides: Guide[] = [
  {
    place: 'Arashiyama, Kyoto',
    description:
      'Bamboo groves, temple trails and a river town wrapped in timeless calm.',
    image:
      'https://res-4.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1514372943/kyoto/Kyoto1112_1',
    user: {
      name: 'Yuki Tanaka',
      avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
      views: 612,
    },
  },
  {
    place: 'Hakone, Kanagawa',
    description:
      'Soak in an onsen with Mount Fuji framed perfectly on the horizon.',
    image:
      'https://res-3.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1517190738/kanagawa/Kanagawa2663_1',
    user: {
      name: 'Kenji Mori',
      avatar: 'https://randomuser.me/api/portraits/men/92.jpg',
      views: 934,
    },
  },
  {
    place: 'Yakushima Island',
    description:
      'Ancient cedar forests, misty peaks and wild coastlines straight from a Miyazaki film.',
    image:
      'https://res-1.cloudinary.com/jnto/image/upload/w_1000,h_667,c_fill,f_auto,fl_lossy,q_auto/v1514405767/kagoshima/Kagoshima1783_2',
    user: {
      name: 'Hana Fujiwara',
      avatar: 'https://randomuser.me/api/portraits/women/70.jpg',
      views: 278,
    },
  },
];