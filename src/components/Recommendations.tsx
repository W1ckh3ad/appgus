import { useNavigate } from 'react-router-dom';
import { Statue, epochs } from '../App';

type RecommendationsProps = {
  currentStatue: Statue;
};

// Import statues data - in a real app this would come from a prop or context
const allStatuesData: Record<string, Statue> = {
  'faustkaempfer-quirinal': {
    id: 'faustkaempfer-quirinal',
    name: 'Faustkämpfer von Quirinal',
    description:
      'Bronzener sitzender Athlet mit sichtbaren Schlagspuren – ein seltenes Meisterwerk des hellenistischen Realismus.',
    period: 'Hellenismus',
    location: 'Museo Nazionale Romano, Rom',
    artist: 'Unbekannt',
    year: '4.–3. Jh. v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800',
    material: 'Bronze',
    foundLocation: 'Rom, Italien',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
  },
  ringergruppe: {
    id: 'ringergruppe',
    name: 'Ringergruppe',
    description:
      'Zwei Athleten im Bodenkampf – eingefroren im Moment maximaler Spannung und Technik.',
    period: 'Hellenismus',
    location: 'Uffizien, Florenz',
    artist: 'Unbekannt',
    year: '3. Jh. v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=800',
    material: 'Marmor',
    foundLocation: 'Rom, Italien',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
    damages: [],
  },
  'hera-tempel-paestum': {
    id: 'hera-tempel-paestum',
    name: 'Hera-Tempel in Paestum',
    description:
      'Frühklassischer dorischer Tempel mit massiven Travertinsäulen – archaische Monumentalität Süditaliens.',
    period: 'Klassik',
    location: 'Paestum, Italien',
    artist: 'Unbekannt',
    year: 'um 560 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    material: 'Travertin',
    foundLocation: 'Paestum, Italien',
    foundCoordinates: { lat: 40.4237, lng: 15.0069 },
  },
  'winged-victory': {
    id: 'winged-victory',
    name: 'Geflügelter Sieg von Samothrake',
    description: 'Die Nike von Samothrake feiert einen hellenistischen Seesieg.',
    period: 'Hellenismus',
    location: 'Louvre, Paris',
    artist: 'Unbekannt',
    year: '200-190 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1565024145823-e88d3ae41642?w=800',
    material: 'Parischer Marmor',
    foundLocation: 'Samothrake, Griechenland',
    foundCoordinates: { lat: 40.4897, lng: 25.513 },
    damages: [
      {
        part: 'Kopf',
        description: 'Der Kopf der Statue fehlt bis heute.',
        imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800',
      },
    ],
  },
  'torso-belvedere': {
    id: 'torso-belvedere',
    name: 'Torso von Belvedere',
    description:
      'Monumentaler Torso, vermutlich Herakles, der trotz fehlender Gliedmaßen enorme Spannung und Anatomie vermittelt.',
    period: 'Klassik',
    location: 'Nationalmuseum Rom',
    artist: 'Myron',
    year: '460-450 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1575912180747-2a9b04de8870?w=800',
    material: 'Marmor',
    foundLocation: 'Hadrians Villa, Tivoli, Italien',
    foundCoordinates: { lat: 41.9409, lng: 12.7739 },
  },
};

export function Recommendations({ currentStatue }: RecommendationsProps) {
  const navigate = useNavigate();
  const currentEpoch = epochs[currentStatue.period];
  const currentEpochLabel = currentEpoch?.name ?? currentStatue.period;

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
