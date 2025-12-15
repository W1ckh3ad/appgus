import { useNavigate } from 'react-router-dom';
import { Statue, epochs } from '../App';

type RecommendationsProps = {
  currentStatue: Statue;
  allStatues: Record<string, Statue>;
};

export function Recommendations({ currentStatue, allStatues }: RecommendationsProps) {
  const navigate = useNavigate();
  const currentEpoch = epochs[currentStatue.period];
  const currentEpochLabel = currentEpoch?.name ?? currentStatue.period;

  // Calculate recommendations based on period and location
  const getRecommendations = (): Statue[] => {
    const allStatuesList = Object.values(allStatues);
    const recommendations: Array<{ statue: Statue; score: number }> = [];

    allStatuesList.forEach((statue) => {
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

        if (distance < 500)
          score += 8; // Within 500km
        else if (distance < 1000)
          score += 5; // Within 1000km
        else if (distance < 2000) score += 2; // Within 2000km
      }

      // Greece/Greek connection
      const currentIsGreek =
        currentStatue.foundLocation.toLowerCase().includes('greece') ||
        currentStatue.period.toLowerCase().includes('greek');
      const statueIsGreek =
        statue.foundLocation.toLowerCase().includes('greece') ||
        statue.period.toLowerCase().includes('greek');
      if (currentIsGreek && statueIsGreek) score += 5;

      // Italy/Roman connection
      const currentIsItalian =
        currentStatue.foundLocation.toLowerCase().includes('italy') ||
        currentStatue.foundLocation.toLowerCase().includes('rome');
      const statueIsItalian =
        statue.foundLocation.toLowerCase().includes('italy') ||
        statue.foundLocation.toLowerCase().includes('rome');
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
      <h3 className="text-neutral-900 dark:text-white tracking-wide uppercase text-xs mb-4">
        Das könnte dir auch gefallen
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
        Basierend auf der Epoche {currentEpochLabel} und Fundorten in der Nähe von{' '}
        {currentStatue.foundLocation}
      </p>
      <div className="space-y-3">
        {recommendations.map((statue) => (
          <button
            key={statue.id}
            onClick={() => navigate(`/statue/${statue.id}`)}
            className="w-full text-left bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 hover:border-neutral-900 dark:hover:border-white/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
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
                <p className="text-neutral-900 dark:text-white mb-1">{statue.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {statue.artist ?? 'Unbekannt'}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  {(epochs[statue.period]?.name ?? statue.period) +
                    ' • ' +
                    statue.foundLocation}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
