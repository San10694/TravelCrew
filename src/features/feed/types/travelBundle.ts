export type TripType = 'adventure' | 'relaxation' | 'cultural' | 'food';

export type ItineraryItem = {
  id: string;
  day: number;
  title: string;
  description: string;
  imageUrl: string;
  blurhash: string;
};

export type TravelBundle = {
  id: string;
  destination: string;
  tripType: TripType;
  price: number;
  duration: string;
  rating: number;
  heroImage: string;
  heroBlurhash: string;
  itinerary: ItineraryItem[];
};
