import { Sparkles } from "lucide-react";
import { Statue } from "../App";

type RecommendationsProps = {
  currentStatue: Statue;
  darkMode: boolean;
};

// Import statues data - in a real app this would come from a prop or context
const allStatuesData: Record<string, Statue> = {
  david: {
    id: "david",
    name: "David",
    description:
      "Michelangelos David gilt als Ikone der Renaissance-Bildhauerei.",
    period: "Renaissance",
    location: "Galleria dell'Accademia, Florenz",
    artist: "Michelangelo",
    year: "1501-1504",
    imageUrl:
      "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800",
    foundLocation: "Florenz, Italien",
    foundCoordinates: { lat: 43.7696, lng: 11.2558 },
  },
  venus: {
    id: "venus",
    name: "Venus de Milo",
    description:
      "Die Venus von Milo ist eine hellenistische Darstellung der Göttin Aphrodite.",
    period: "Hellenistische Epoche",
    location: "Louvre, Paris",
    artist: "Alexandros von Antiochia",
    year: "150-125 v. Chr.",
    imageUrl:
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=800",
    foundLocation: "Insel Milos, Griechenland",
    foundCoordinates: { lat: 36.7213, lng: 24.4259 },
    damages: [
      {
        part: "Beide Arme",
        description: "Die Arme fehlten bereits bei der Entdeckung 1820.",
        imageUrl:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      },
    ],
  },
  thinker: {
    id: "thinker",
    name: "Der Denker",
    description:
      "Der Denker von Auguste Rodin verkörpert konzentrierte Selbstreflexion.",
    period: "Moderne",
    location: "Musée Rodin, Paris",
    artist: "Auguste Rodin",
    year: "1880-1882",
    imageUrl:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
    foundLocation: "Paris, Frankreich (Entstehung)",
    foundCoordinates: { lat: 48.8566, lng: 2.3522 },
  },
  "winged-victory": {
    id: "winged-victory",
    name: "Geflügelter Sieg von Samothrake",
    description:
      "Die Nike von Samothrake feiert einen hellenistischen Seesieg.",
    period: "Hellenistische Epoche",
    location: "Louvre, Paris",
    artist: "Unbekannt",
    year: "200-190 v. Chr.",
    imageUrl:
      "https://images.unsplash.com/photo-1565024145823-e88d3ae41642?w=800",
    foundLocation: "Samothrake, Griechenland",
    foundCoordinates: { lat: 40.4897, lng: 25.513 },
    damages: [
      {
        part: "Kopf",
        description: "Der Kopf der Statue fehlt bis heute.",
        imageUrl:
          "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800",
      },
    ],
  },
  discobolus: {
    id: "discobolus",
    name: "Diskobolos",
    description: "Der Diskuswerfer zeigt den Höhepunkt klassischer Athletik.",
    period: "Klassisches Griechenland",
    location: "Nationalmuseum Rom",
    artist: "Myron",
    year: "460-450 v. Chr.",
    imageUrl:
      "https://images.unsplash.com/photo-1575912180747-2a9b04de8870?w=800",
    foundLocation: "Hadrians Villa, Tivoli, Italien",
    foundCoordinates: { lat: 41.9409, lng: 12.7739 },
  },
  laocoon: {
    id: "laocoon",
    name: "Laokoon und seine Söhne",
    description: "Die Gruppe zeigt Laokoon im Kampf gegen Meeresschlangen.",
    period: "Hellenistische Epoche",
    location: "Vatikanische Museen, Vatikanstadt",
    artist: "Agesander, Athenodoros und Polydoros",
    year: "200 v. Chr. - 70 n. Chr.",
    imageUrl:
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800",
    foundLocation: "Rom, Italien",
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
  },
};

export function Recommendations({
  currentStatue,
  darkMode,
}: RecommendationsProps) {
  // Calculate recommendations based on period and location
  const getRecommendations = (): Statue[] => {
    const allStatues = Object.values(allStatuesData);
    const recommendations: Array<{ statue: Statue; score: number }> = [];

    allStatues.forEach((statue) => {
      if (statue.id === currentStatue.id) return;

      let score = 0;

      // Same period gets high score
      if (statue.period === currentStatue.period) {
        score += 10;
      }

      // Similar geographic region - only if both have coordinates
      if (currentStatue.foundCoordinates && statue.foundCoordinates) {
        const distance = calculateDistance(
          currentStatue.foundCoordinates,
          statue.foundCoordinates
        );

        if (distance < 500) score += 8; // Within 500km
        else if (distance < 1000) score += 5; // Within 1000km
        else if (distance < 2000) score += 2; // Within 2000km
      }

      // Greece/Greek connection
      const currentIsGreek =
        currentStatue.foundLocation.toLowerCase().includes("greece") ||
        currentStatue.period.toLowerCase().includes("greek");
      const statueIsGreek =
        statue.foundLocation.toLowerCase().includes("greece") ||
        statue.period.toLowerCase().includes("greek");
      if (currentIsGreek && statueIsGreek) score += 5;

      // Italy/Roman connection
      const currentIsItalian =
        currentStatue.foundLocation.toLowerCase().includes("italy") ||
        currentStatue.foundLocation.toLowerCase().includes("rome");
      const statueIsItalian =
        statue.foundLocation.toLowerCase().includes("italy") ||
        statue.foundLocation.toLowerCase().includes("rome");
      if (currentIsItalian && statueIsItalian) score += 5;

      if (score > 0) {
        recommendations.push({ statue, score });
      }
    });

    // Sort by score and return top 3
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.statue);
  };

  // Simple distance calculation (Haversine formula)
  const calculateDistance = (
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number => {
    if (!coord1 || !coord2) return Infinity;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-neutral-900 dark:text-white">
          Das könnte dir auch gefallen
        </h3>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        Basierend auf der Epoche {currentStatue.period} und Fundorten in der
        Nähe von {currentStatue.foundLocation}
      </p>
      <div className="space-y-3">
        {recommendations.map((statue) => (
          <div
            key={statue.id}
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all cursor-pointer"
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
                <img
                  src={statue.imageUrl}
                  alt={statue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-neutral-900 dark:text-white mb-1">
                  {statue.name}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {statue.artist}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {statue.period} • {statue.foundLocation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
