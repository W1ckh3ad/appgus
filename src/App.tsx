import { Bookmark, Clock, Home, Moon, Scan, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bookmarks } from './components/Bookmarks';
import { History } from './components/History';
import { Scanner } from './components/Scanner';
import { StatueViewer } from './components/StatueViewer';

export type Vector3Tuple = [number, number, number];

export type StatueModelConfig = {
  file: string;
  scale?: number;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  camera?: {
    position?: Vector3Tuple;
    fov?: number;
  };
  controls?: {
    minDistance?: number;
    maxDistance?: number;
  };
};

export type StatueNarrative = {
  description: string;
  images?: string[];
};
export type StatueNarrativeComplex = {
  description: string;
  images?: {
    title: string;
    description?: string;
    path: string;
  }[];
};

export type Statue = {
  id: string;
  name: string;
  description: string;
  period: string;
  location: string;
  year: string;
  imageUrl: string;
  material: string;
  foundLocation: string;
  foundCoordinates: { lat: number; lng: number };
  foundLocationImages?: string[];
  damages?: Array<{
    part: string;
    description: string;
    imageUrl: string;
  }>;
  model?: StatueModelConfig;
  mythologie?: StatueNarrativeComplex;
  kunstepoche?: StatueNarrative;
};

const createModelConfig = (
  file: string,
  overrides?: Partial<StatueModelConfig>
): StatueModelConfig => {
  return {
    file,
    scale: overrides?.scale ?? 1,
    position: (overrides?.position ?? [0, -1.2, 0]) as Vector3Tuple,
    rotation: (overrides?.rotation ?? [0, 0, 0]) as Vector3Tuple,
    camera: {
      position: (overrides?.camera?.position ?? [0, 1.4, 4.5]) as Vector3Tuple,
      fov: overrides?.camera?.fov ?? 40,
    },
    controls: {
      minDistance: overrides?.controls?.minDistance ?? 1.5,
      maxDistance: overrides?.controls?.maxDistance ?? 6,
    },
  };
};

const statuesData: Record<string, Statue> = {
  david: {
    id: 'david',
    name: 'David',
    description:
      "Michelangelos David ist ein Meisterwerk der Renaissance und entstand zwischen 1501 und 1504. Die 5,17 Meter hohe Marmorskulptur zeigt den biblischen Helden David als stehenden Akt. Ursprünglich für den Dom von Florenz gedacht, steht sie heute in der Galleria dell'Accademia.",
    period: 'Renaissance',
    location: "Galleria dell'Accademia, Florenz",
    year: '1501-1504',
    imageUrl: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800',
    material: 'Carrara-Marmor',
    foundLocation: 'Florenz, Italien',
    foundCoordinates: { lat: 43.7696, lng: 11.2558 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1470123383396-1d514bff6432?w=800',
    ],
    model: createModelConfig('/models/david.glb', {
      position: [0, -1.6, 0],
      scale: 1.1,
    }),
    mythologie: {
      description:
        'David steht als biblischer Held für Mut gegen übermächtige Gegner. In Florenz wurde er zum Symbol republikanischer Freiheit – die Bürger sahen im jungen Hirtenjungen den Geist ihrer Stadt.',
      images: [
        {
          title: 'Symbol Florenz',
          description: 'Blick auf Florenz – Sinnbild für den republikanischen Mut.',
          path: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
        },
        {
          title: 'Hirtenmotiv',
          description:
            'Darstellung jugendlicher Stärke, inspiriert vom biblischen David.',
          path: 'https://images.unsplash.com/photo-1494797710133-75ad8b1dd613?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Die hochklassische Renaissance verbindet perfekte Anatomie mit innerer Spannung. Michelangelos bewusst unvollkommene Proportionen kompensieren die Blickperspektive des Betrachters.',
      images: [
        'https://images.unsplash.com/photo-1506485338023-6ce5f36692c2?w=800',
        'https://images.unsplash.com/photo-1468109320504-028c953b2a8f?w=800',
      ],
    },
  },
  venus: {
    id: 'venus',
    name: 'Venus de Milo',
    description:
      'Die Venus von Milo ist eine hellenistische Marmorskulptur, die Aphrodite, die griechische Göttin der Liebe und Schönheit, darstellt. Entstanden zwischen 150 und 125 v. Chr., ist sie für ihre fehlenden Arme berühmt und gilt als Ideal weiblicher Anmut.',
    period: 'Hellenistische Epoche',
    location: 'Louvre, Paris',
    year: '150-125 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=800',
    material: 'Parischer Marmor',
    foundLocation: 'Insel Milos, Griechenland',
    foundCoordinates: { lat: 36.7213, lng: 24.4259 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800',
    ],
    damages: [
      {
        part: 'Beide Arme',
        description:
          'Die Arme der Statue fehlten bereits bei ihrer Entdeckung im Jahr 1820. Der rechte Arm war vermutlich erhoben und hielt vielleicht einen Apfel, während die Position des linken Arms bis heute diskutiert wird.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      },
    ],
    model: createModelConfig('/models/venus.glb', {
      position: [0, -1.4, 0],
      scale: 1.05,
    }),
    mythologie: {
      description:
        'Die Erzählung der Aphrodite knüpft an Geburt aus dem Meeresschaum an. Die fehlenden Arme regen seit Jahrhunderten Fantasie an: Hielt sie den Apfel des Paris oder justierte sie ihr Gewand?',
      images: [
        {
          title: 'Meeresschaum',
          description: 'Sanfte Welle als Verweis auf Aphrodites mythische Geburt.',
          path: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
        },
        {
          title: 'Apfel des Paris',
          description: 'Stillleben, das den berühmten Schönheitswettbewerb evoziert.',
          path: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Die hellenistische Epoche betont Bewegung und sinnliche Formen. Sanfte S-Kurven und das nasse Gewand verleihen der Figur jene elegante Schwerelosigkeit, die Sammler*innen fasziniert.',
      images: [
        'https://images.unsplash.com/photo-1521551211900-0a7f66f0de93?w=800',
        'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?w=800',
      ],
    },
  },
  thinker: {
    id: 'thinker',
    name: 'Der Denker',
    description:
      'Der ursprünglich als "Der Dichter" betitelte Denker wurde von Auguste Rodin geschaffen und zeigt eine nackte männliche Figur auf einem Felsen, den Kopf nachdenklich auf die Hand gestützt. Die Skulptur gehört zu den bekanntesten der Welt.',
    period: 'Moderne',
    location: 'Musée Rodin, Paris',
    year: '1880-1882',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    material: 'Bronze (Guss 1904)',
    foundLocation: 'Paris, Frankreich (Entstehung)',
    foundCoordinates: { lat: 48.8566, lng: 2.3522 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1469478715127-2f0fc0d1b0d1?w=800',
    ],
    model: createModelConfig('/models/thinker.glb', {
      position: [0, -1.1, 0],
      scale: 1,
      controls: { minDistance: 1.2, maxDistance: 5 },
    }),
    mythologie: {
      description:
        'Rodin plante den Denker ursprünglich als Dante, der das Eingangstor zur Hölle überblickt. Das Motiv bündelt die existenzielle Frage, wie Körperlichkeit und Geist miteinander ringen.',
      images: [
        {
          title: 'Gedankentiefe',
          description: 'Abstraktes Lichtspiel für die innere Reise Dantes.',
          path: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        },
        {
          title: 'Tor zur Hölle',
          description: 'Dunkle Texturen erinnern an Rodins ursprüngliches Portal.',
          path: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Die Moderne löst sich von idealisierten Helden. Plastische Oberflächen lassen Werkzeugspuren sichtbar werden – Gedanken sind hier Bewegung, kein poliertes Dogma.',
      images: [
        'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      ],
    },
  },
  'winged-victory': {
    id: 'winged-victory',
    name: 'Geflügelter Sieg von Samothrake',
    description:
      'Die Geflügelte Siegesgöttin von Samothrake, auch Nike von Samothrake genannt, ist eine hellenistische Marmorskulptur der Siegesgöttin Nike. Sie entstand im 2. Jahrhundert v. Chr., steht auf einem Schiffsbogen und erinnert an einen maritimen Triumph.',
    period: 'Hellenistische Epoche',
    location: 'Louvre, Paris',
    year: '200-190 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1565024145823-e88d3ae41642?w=800',
    material: 'Parischer Marmor',
    foundLocation: 'Samothrake, Griechenland',
    foundCoordinates: { lat: 40.4897, lng: 25.513 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1526481280695-3c469c04b657?w=800',
    ],
    damages: [
      {
        part: 'Kopf',
        description:
          'Der Kopf der Nike wurde nie gefunden. Forschende gehen davon aus, dass er leicht nach rechts gedreht war und über das Meer blickte.',
        imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800',
      },
      {
        part: 'Arme',
        description:
          'Beide Arme fehlen. Der rechte Arm war wahrscheinlich in einer Geste des Sieges oder des Grußes erhoben.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      },
    ],
    model: createModelConfig('/models/winged-victory.glb', {
      position: [0, -1.3, 0],
      scale: 1.15,
      camera: { position: [0, 1.2, 5], fov: 38 },
    }),
    mythologie: {
      description:
        'Nike landet auf dem Bug eines Siegerschiffes und trägt die Botschaft göttlicher Gunst. Auch ohne Kopf schreitet sie vorwärts – ein Sinnbild für Triumphe gegen jede Widrigkeit.',
      images: [
        {
          title: 'Maritimer Triumph',
          description: 'Küstenlandschaft als Echo des Siegerschiffes.',
          path: 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800',
        },
        {
          title: 'Göttlicher Sturm',
          description: 'Windgepeitschte Wolken spiegeln Nikes Dynamik.',
          path: 'https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Hellenistische Bildhauerei setzt auf dramatische Diagonalen und wehende Draperien. Die Statue wirkt wie ein eingefrorener Sturm und zeigt die technische Meisterschaft rhodischer Werkstätten.',
      images: [
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
      ],
    },
  },
  discobolus: {
    id: 'discobolus',
    name: 'Diskobolos',
    description:
      'Der Diskobolos, der berühmte Diskuswerfer, verkörpert den Höhepunkt klassisch-griechischer Athletik. Er hält den Moment gespannter Energie kurz vor dem Wurf fest und zeigt perfekte Anatomie sowie dynamische Bewegung.',
    period: 'Klassisches Griechenland',
    location: 'Nationalmuseum Rom',
    year: '460-450 v. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1575912180747-2a9b04de8870?w=800',
    material: 'Römische Marmor-Replik',
    foundLocation: 'Hadrians Villa, Tivoli, Italien',
    foundCoordinates: { lat: 41.9409, lng: 12.7739 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
    ],
    model: createModelConfig('/models/discobolus.glb', {
      position: [0, -1.2, 0],
      controls: { minDistance: 1.4, maxDistance: 5.5 },
    }),
    mythologie: {
      description:
        'Der Athlet verkörpert den Mythos des kalokagathia – die Einheit von körperlicher und geistiger Tüchtigkeit. Im Moment vor dem Wurf sammelt sich Energie wie in einer Spiralfeder.',
      images: [
        {
          title: 'Spannung vor dem Wurf',
          description: 'Architektonische Kurven greifen die Spirale des Diskus auf.',
          path: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        },
        {
          title: 'Kalokagathia',
          description: 'Figürliche Silhouette für Harmonie von Körper und Geist.',
          path: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Klassisch-griechische Kunst sucht ideale Proportionen. Der Diskobolos nutzt eine harmonische, fast mathematische Kurve, um Bewegung und Gleichgewicht in Marmor zu bannen.',
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
      ],
    },
  },
  laocoon: {
    id: 'laocoon',
    name: 'Laokoon und seine Söhne',
    description:
      'Diese dramatische hellenistische Skulptur zeigt den trojanischen Priester Laokoon und seine Söhne, die von Meeresschlangen angegriffen werden, die die Götter als Strafe sandten. Sie ist berühmt für die eindringliche Darstellung menschlichen Leidens und göttlichen Zorns.',
    period: 'Hellenistische Epoche',
    location: 'Vatikanische Museen, Vatikanstadt',
    year: '200 v. Chr. - 70 n. Chr.',
    imageUrl: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    material: 'Marmor aus Rhodos',
    foundLocation: 'Rom, Italien',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
    foundLocationImages: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
    ],
    mythologie: {
      description:
        'Der trojanische Priester Laokoon warnte vor dem hölzernen Pferd und wurde zur Strafe von Poseidon gesandt – das Drama zeigt, wie göttliche Entscheidungen Menschen in den Abgrund reißen.',
      images: [
        {
          title: 'Trojanisches Omen',
          description: 'Neblige Szene, die das Unheil über Troja ankündigt.',
          path: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=800',
        },
        {
          title: 'Göttlicher Zorn',
          description: 'Dramatische Lichtstimmung erinnert an Poseidons Strafe.',
          path: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
        },
      ],
    },
    kunstepoche: {
      description:
        'Spät-hellenistische Skulpturen übersteigern Pathos und körperliche Verwindungen. Die Laokoon-Gruppe inspirierte Renaissancekünstler und lehrte, wie Emotion plastisch übersetzt wird.',
      images: [
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
        'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800',
      ],
    },
  },
  'satyr-hermaphrodit': {
    id: 'satyr-hermaphrodit',
    name: 'Satyr und Hermaphrodit',
    description:
      'Ein Satyr versucht, sich an dem Zwitterwesen Hermaphroditos gewaltsam zu vergehen, wird von diesem aber abgewehrt. Diese Szene beleuchtet die Spannung zwischen ungezügeltem dionysischem Begehren und sozialer Ordnung: Die erfolglose Annäherung stellt die gesellschaftliche Balance wieder her.',
    period: 'Hellenismus',
    location:
      'Dresden, Staatliche Kunstsammlungen, Skulpturensammlung (Albertinum) Inv. Hm 155',
    year: 'Römische Kopie nach einem griechischen Original aus dem 2. Jh. v. Chr.',
    imageUrl: '/images/satyr_hermaphroditos/ausstellung.jpg',
    material: 'Marmor',
    foundLocation: 'Italien, Tivoli, Sammlung Albani',
    foundCoordinates: { lat: 41.91598, lng: 12.5002 },
    foundLocationImages: ['/images/satyr_hermaphroditos/fundort_1.jpeg'],

    model: createModelConfig('/models/satyr-hermaphrodit.glb', {
      scale: 1.5,
      position: [0, -1, 0],
      rotation: [0, 0.5, 0],
      camera: {
        position: [0, 1, 5],
        fov: 45,
      },
      controls: {
        minDistance: 2,
        maxDistance: 10,
      },
    }),
    mythologie: {
      description:
        'Satyrn sind Begleiter des Dionysos und verkörpern unkontrollierte Triebe, Rausch und Grenzüberschreitung. Hermaphroditos – Sohn von Hermes und Aphrodite – vereinte sich mit der Nymphe Salmakis zu einem zweigeschlechtlichen Wesen und steht für die Auflösung klarer Geschlechtergrenzen.',
      images: [
        {
          title: 'Satyr',
          path: 'images/satyr_hermaphroditos/satyr_mythologie.jpeg',
        },
        {
          title: 'Hermaphrodit',
          path: 'images/satyr_hermaphroditos/hermaphroditos_mythologie.jpeg',
        },
      ],
    },
    kunstepoche: {
      description:
        'Der Hellenismus liebt emotionale, theatrale Szenen sowie überraschende Motive, die Realismus, Detailfreude und erotische Themen verbinden. Künstler suchten nach psychologischer Tiefe und spielten mit ambivalenten Figuren wie Satyrn und Hermaphroditen.',
      images: ['/images/epochs/hellenismus.jpg'],
    },
  },
};

type View = 'home' | 'scanner' | 'bookmarks' | 'history';

const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    getStoredValue('darkMode', false)
  );
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    getStoredValue<string[]>('bookmarks', [])
  );
  const [historyItems, setHistoryItems] = useState<
    Array<{ statue: Statue; timestamp: number }>
  >(() => getStoredValue('history', []));

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(historyItems));
  }, [historyItems]);

  const handleScan = (qrData: string) => {
    const statue = statuesData[qrData.toLowerCase()];
    if (statue) {
      setSelectedStatue(statue);
      // Add to history
      setHistoryItems((prev) => {
        // Remove duplicates and add new item at the beginning
        const filtered = prev.filter((item) => item.statue.id !== statue.id);
        return [{ statue, timestamp: Date.now() }, ...filtered];
      });
      setCurrentView('home');
    }
  };

  const handleBookmark = (statueId: string) => {
    setBookmarkedIds((prev) => {
      if (prev.includes(statueId)) {
        return prev.filter((id) => id !== statueId);
      } else {
        return [...prev, statueId];
      }
    });
  };

  const handleSelectFromHistory = (statue: Statue) => {
    setSelectedStatue(statue);
    setCurrentView('home');
  };

  const bookmarkedStatues = bookmarkedIds.map((id) => statuesData[id]).filter(Boolean);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header with Dark Mode Toggle */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Appgus Logo"
            className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 object-cover"
          />
          <h1 className="text-lg text-neutral-900 dark:text-white">
            Ausstellungs-Scanner
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          aria-label="Dunkelmodus umschalten"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'home' && (
          <div className="h-full flex flex-col">
            {selectedStatue ? (
              <StatueViewer
                statue={selectedStatue}
                isBookmarked={bookmarkedIds.includes(selectedStatue.id)}
                onBookmark={() => handleBookmark(selectedStatue.id)}
                darkMode={darkMode}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <Scan className="w-24 h-24 text-neutral-300 dark:text-neutral-600 mb-4" />
                <h2 className="text-neutral-600 dark:text-neutral-400 mb-2">
                  Keine Statue ausgewählt
                </h2>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                  Scanne einen QR-Code, um das 3D-Modell und Informationen zur originalen
                  Statue zu sehen
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'scanner' && <Scanner onScan={handleScan} />}

        {currentView === 'bookmarks' && (
          <Bookmarks
            statues={bookmarkedStatues}
            onSelect={(statue) => {
              setSelectedStatue(statue);
              setCurrentView('home');
            }}
          />
        )}

        {currentView === 'history' && (
          <History items={historyItems} onSelect={handleSelectFromHistory} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'home'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Start</span>
          </button>

          <button
            onClick={() => setCurrentView('scanner')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'scanner'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Scan className="w-6 h-6" />
            <span className="text-xs mt-1">Scannen</span>
          </button>

          <button
            onClick={() => setCurrentView('bookmarks')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'bookmarks'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs mt-1">Gespeichert</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'history'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">Verlauf</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
