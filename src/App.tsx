import { Bookmark, Clock, Home, Moon, Scan, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Bookmarks } from "./components/Bookmarks";
import { History } from "./components/History";
import { Scanner } from "./components/Scanner";
import { StatueViewer } from "./components/StatueViewer";

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

export type Statue = {
  id: string;
  name: string;
  description: string;
  period: string;
  location: string;
  artist: string;
  year: string;
  imageUrl: string;
  foundLocation: string;
  foundCoordinates: { lat: number; lng: number };
  damages?: Array<{
    part: string;
    description: string;
    imageUrl: string;
  }>;
  model?: StatueModelConfig;
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
    id: "david",
    name: "David",
    description:
      "Michelangelos David ist ein Meisterwerk der Renaissance und entstand zwischen 1501 und 1504. Die 5,17 Meter hohe Marmorskulptur zeigt den biblischen Helden David als stehenden Akt. Ursprünglich für den Dom von Florenz gedacht, steht sie heute in der Galleria dell'Accademia.",
    period: "Renaissance",
    location: "Galleria dell'Accademia, Florenz",
    artist: "Michelangelo",
    year: "1501-1504",
    imageUrl:
      "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800",
    foundLocation: "Florenz, Italien",
    foundCoordinates: { lat: 43.7696, lng: 11.2558 },
    model: createModelConfig("/models/david.glb", {
      position: [0, -1.6, 0],
      scale: 1.1,
    }),
  },
  venus: {
    id: "venus",
    name: "Venus de Milo",
    description:
      "Die Venus von Milo ist eine hellenistische Marmorskulptur, die Aphrodite, die griechische Göttin der Liebe und Schönheit, darstellt. Entstanden zwischen 150 und 125 v. Chr., ist sie für ihre fehlenden Arme berühmt und gilt als Ideal weiblicher Anmut.",
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
        description:
          "Die Arme der Statue fehlten bereits bei ihrer Entdeckung im Jahr 1820. Der rechte Arm war vermutlich erhoben und hielt vielleicht einen Apfel, während die Position des linken Arms bis heute diskutiert wird.",
        imageUrl:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      },
    ],
    model: createModelConfig("/models/venus.glb", {
      position: [0, -1.4, 0],
      scale: 1.05,
    }),
  },
  thinker: {
    id: "thinker",
    name: "Der Denker",
    description:
      'Der ursprünglich als "Der Dichter" betitelte Denker wurde von Auguste Rodin geschaffen und zeigt eine nackte männliche Figur auf einem Felsen, den Kopf nachdenklich auf die Hand gestützt. Die Skulptur gehört zu den bekanntesten der Welt.',
    period: "Moderne",
    location: "Musée Rodin, Paris",
    artist: "Auguste Rodin",
    year: "1880-1882",
    imageUrl:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
    foundLocation: "Paris, Frankreich (Entstehung)",
    foundCoordinates: { lat: 48.8566, lng: 2.3522 },
    model: createModelConfig("/models/thinker.glb", {
      position: [0, -1.1, 0],
      scale: 1,
      controls: { minDistance: 1.2, maxDistance: 5 },
    }),
  },
  "winged-victory": {
    id: "winged-victory",
    name: "Geflügelter Sieg von Samothrake",
    description:
      "Die Geflügelte Siegesgöttin von Samothrake, auch Nike von Samothrake genannt, ist eine hellenistische Marmorskulptur der Siegesgöttin Nike. Sie entstand im 2. Jahrhundert v. Chr., steht auf einem Schiffsbogen und erinnert an einen maritimen Triumph.",
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
        description:
          "Der Kopf der Nike wurde nie gefunden. Forschende gehen davon aus, dass er leicht nach rechts gedreht war und über das Meer blickte.",
        imageUrl:
          "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800",
      },
      {
        part: "Arme",
        description:
          "Beide Arme fehlen. Der rechte Arm war wahrscheinlich in einer Geste des Sieges oder des Grußes erhoben.",
        imageUrl:
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
      },
    ],
    model: createModelConfig("/models/winged-victory.glb", {
      position: [0, -1.3, 0],
      scale: 1.15,
      camera: { position: [0, 1.2, 5], fov: 38 },
    }),
  },
  discobolus: {
    id: "discobolus",
    name: "Diskobolos",
    description:
      "Der Diskobolos, der berühmte Diskuswerfer, verkörpert den Höhepunkt klassisch-griechischer Athletik. Er hält den Moment gespannter Energie kurz vor dem Wurf fest und zeigt perfekte Anatomie sowie dynamische Bewegung.",
    period: "Klassisches Griechenland",
    location: "Nationalmuseum Rom",
    artist: "Myron",
    year: "460-450 v. Chr.",
    imageUrl:
      "https://images.unsplash.com/photo-1575912180747-2a9b04de8870?w=800",
    foundLocation: "Hadrians Villa, Tivoli, Italien",
    foundCoordinates: { lat: 41.9409, lng: 12.7739 },
    model: createModelConfig("/models/discobolus.glb", {
      position: [0, -1.2, 0],
      controls: { minDistance: 1.4, maxDistance: 5.5 },
    }),
  },
  laocoon: {
    id: "laocoon",
    name: "Laokoon und seine Söhne",
    description:
      "Diese dramatische hellenistische Skulptur zeigt den trojanischen Priester Laokoon und seine Söhne, die von Meeresschlangen angegriffen werden, die die Götter als Strafe sandten. Sie ist berühmt für die eindringliche Darstellung menschlichen Leidens und göttlichen Zorns.",
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

type View = "home" | "scanner" | "bookmarks" | "history";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<
    Array<{ statue: Statue; timestamp: number }>
  >([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load bookmarks and history from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    const savedHistory = localStorage.getItem("history");

    if (savedBookmarks) {
      setBookmarkedIds(JSON.parse(savedBookmarks));
    }
    if (savedHistory) {
      setHistoryItems(JSON.parse(savedHistory));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(historyItems));
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
      setCurrentView("home");
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
    setCurrentView("home");
  };

  const bookmarkedStatues = bookmarkedIds
    .map((id) => statuesData[id])
    .filter(Boolean);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header with Dark Mode Toggle */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
        {currentView === "home" && (
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
                  Scanne einen QR-Code, um das 3D-Modell und Informationen zur
                  originalen Statue zu sehen
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === "scanner" && (
          <Scanner onScan={handleScan} darkMode={darkMode} />
        )}

        {currentView === "bookmarks" && (
          <Bookmarks
            statues={bookmarkedStatues}
            onSelect={(statue) => {
              setSelectedStatue(statue);
              setCurrentView("home");
            }}
            darkMode={darkMode}
          />
        )}

        {currentView === "history" && (
          <History
            items={historyItems}
            onSelect={handleSelectFromHistory}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentView("home")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === "home"
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Start</span>
          </button>

          <button
            onClick={() => setCurrentView("scanner")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === "scanner"
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Scan className="w-6 h-6" />
            <span className="text-xs mt-1">Scannen</span>
          </button>

          <button
            onClick={() => setCurrentView("bookmarks")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === "bookmarks"
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs mt-1">Gespeichert</span>
          </button>

          <button
            onClick={() => setCurrentView("history")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === "history"
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 dark:text-neutral-400"
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
