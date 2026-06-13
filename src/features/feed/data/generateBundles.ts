import type { ItineraryItem, TravelBundle, TripType } from '@/features/feed/types/travelBundle';
import { layout } from '@/features/shared/constants/theme';

const DESTINATIONS = [
  'Kyoto, Japan',
  'Santorini, Greece',
  'Banff, Canada',
  'Marrakech, Morocco',
  'Queenstown, New Zealand',
  'Reykjavik, Iceland',
  'Bali, Indonesia',
  'Lisbon, Portugal',
  'Cape Town, South Africa',
  'Patagonia, Chile',
  'Amalfi Coast, Italy',
  'Zion National Park, USA',
  'Swiss Alps, Switzerland',
  'Petra, Jordan',
  'Maldives',
] as const;

const TRIP_TYPES: TripType[] = ['adventure', 'relaxation', 'cultural', 'food'];

const BLURHASHES = [
  'LKO2?U%2Tw=w]~RBVZRi};RPxuwH',
  'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
  'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  'LKN]Rv%2Tw=w]~RBVZRi};RPxuwH',
  'LGF5?VYk^6#M@-5c,1J5@[or[Q6.',
] as const;

const ACTIVITIES = [
  'Sunrise hike',
  'Local food tour',
  'Museum visit',
  'Boat excursion',
  'Wine tasting',
  'Cultural workshop',
  'Scenic drive',
  'Beach relaxation',
] as const;

function createSeededRandom(seed: number): () => number {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  const index = Math.floor(random() * items.length);
  return items[index] as T;
}

function createItinerary(bundleIndex: number, random: () => number): ItineraryItem[] {
  const dayCount = 3 + Math.floor(random() * 3);

  return Array.from({ length: dayCount }, (_, dayIndex) => {
    const seed = bundleIndex * 10 + dayIndex;
    return {
      id: `itinerary-${bundleIndex}-${dayIndex}`,
      day: dayIndex + 1,
      title: pick(ACTIVITIES, random),
      description: `Day ${dayIndex + 1} experience in a curated travel bundle.`,
      imageUrl: `https://picsum.photos/seed/itinerary-${seed}/${layout.itineraryImageWidth}/${layout.itineraryImageHeight}`,
      blurhash: pick(BLURHASHES, random),
    };
  });
}

export function generateBundles(count: number): TravelBundle[] {
  const random = createSeededRandom(42);

  return Array.from({ length: count }, (_, index) => {
    const destination = pick(DESTINATIONS, random);
    const tripType = pick(TRIP_TYPES, random);
    const price = 899 + Math.floor(random() * 3200);
    const durationDays = 4 + Math.floor(random() * 8);
    const rating = 3.8 + random() * 1.2;

    return {
      id: `bundle-${index}`,
      destination,
      tripType,
      price,
      duration: `${durationDays} days`,
      rating: Math.round(rating * 10) / 10,
      heroImage: `https://picsum.photos/seed/hero-${index}/${layout.heroImageWidth}/${layout.heroImageHeight}`,
      heroBlurhash: pick(BLURHASHES, random),
      itinerary: createItinerary(index, random),
    };
  });
}
