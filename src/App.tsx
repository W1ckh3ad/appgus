import { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { StatueViewer } from './components/StatueViewer';
import { Bookmarks } from './components/Bookmarks';
import { History } from './components/History';
import { Home, Scan, Bookmark, Clock, Moon, Sun } from 'lucide-react';

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
};

const statuesData: Record<string, Statue> = {
  'david': {
    id: 'david',
    name: 'David',
    description: 'Michelangelo\'s David is a masterpiece of Renaissance sculpture, created between 1501 and 1504. The 17-foot marble statue depicts the Biblical hero David, represented as a standing male nude. Originally commissioned for the Florence Cathedral, it now stands in the Galleria dell\'Accademia in Florence.',
    period: 'Renaissance',
    location: 'Galleria dell\'Accademia, Florence',
    artist: 'Michelangelo',
    year: '1501-1504',
    imageUrl: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800',
    foundLocation: 'Florence, Italy',
    foundCoordinates: { lat: 43.7696, lng: 11.2558 }
  },
  'venus': {
    id: 'venus',
    name: 'Venus de Milo',
    description: 'The Venus de Milo is an ancient Greek sculpture from the Hellenistic period, depicting Aphrodite, the Greek goddess of love and beauty. Created between 150 and 125 BC, this iconic marble sculpture is famous for her missing arms and represents the ideal of feminine beauty.',
    period: 'Hellenistic',
    location: 'Louvre Museum, Paris',
    artist: 'Alexandros of Antioch',
    year: '150-125 BC',
    imageUrl: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=800',
    foundLocation: 'Island of Milos, Greece',
    foundCoordinates: { lat: 36.7213, lng: 24.4259 },
    damages: [
      {
        part: 'Both Arms',
        description: 'The statue\'s arms were already missing when discovered in 1820. The right arm was likely raised, possibly holding an apple, while the left arm\'s position remains debated among scholars.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'
      }
    ]
  },
  'thinker': {
    id: 'thinker',
    name: 'The Thinker',
    description: 'Originally titled "The Poet," The Thinker was created by Auguste Rodin and depicts a nude male figure sitting on a rock, his chin resting on one hand as though deep in thought. It has become one of the most recognizable sculptures in the world.',
    period: 'Modern',
    location: 'Musée Rodin, Paris',
    artist: 'Auguste Rodin',
    year: '1880-1882',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    foundLocation: 'Paris, France (Created)',
    foundCoordinates: { lat: 48.8566, lng: 2.3522 }
  },
  'winged-victory': {
    id: 'winged-victory',
    name: 'Winged Victory of Samothrace',
    description: 'The Winged Victory of Samothrace, also called the Nike of Samothrace, is a marble Hellenistic sculpture of Nike, the Greek goddess of victory. Created in the 2nd century BC, it stands on a ship\'s prow and commemorates a naval victory.',
    period: 'Hellenistic',
    location: 'Louvre Museum, Paris',
    artist: 'Unknown',
    year: '200-190 BC',
    imageUrl: 'https://images.unsplash.com/photo-1565024145823-e88d3ae41642?w=800',
    foundLocation: 'Samothrace, Greece',
    foundCoordinates: { lat: 40.4897, lng: 25.5130 },
    damages: [
      {
        part: 'Head',
        description: 'The head of Nike was never found. Scholars believe it was turned slightly to the right, gazing over the sea.',
        imageUrl: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800'
      },
      {
        part: 'Arms',
        description: 'Both arms are missing. The right arm was likely raised in a gesture of victory or greeting.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'
      }
    ]
  },
  'discobolus': {
    id: 'discobolus',
    name: 'Discobolus',
    description: 'The Discobolus, or "discus thrower," represents the zenith of Classical Greek athletic sculpture. It captures the moment of concentrated energy before the discus is released, showcasing perfect anatomical knowledge and dynamic motion.',
    period: 'Classical Greek',
    location: 'National Roman Museum, Rome',
    artist: 'Myron',
    year: '460-450 BC',
    imageUrl: 'https://images.unsplash.com/photo-1575912180747-2a9b04de8870?w=800',
    foundLocation: 'Hadrian\'s Villa, Tivoli, Italy',
    foundCoordinates: { lat: 41.9409, lng: 12.7739 }
  },
  'laocoon': {
    id: 'laocoon',
    name: 'Laocoön and His Sons',
    description: 'This dramatic Hellenistic sculpture depicts the Trojan priest Laocoön and his sons being attacked by sea serpents, sent by the gods as punishment. The sculpture is renowned for its portrayal of human suffering and divine wrath.',
    period: 'Hellenistic',
    location: 'Vatican Museums, Vatican City',
    artist: 'Agesander, Athenodoros, and Polydorus',
    year: '200 BC - 70 AD',
    imageUrl: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    foundLocation: 'Rome, Italy',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 }
  }
};

type View = 'home' | 'scanner' | 'bookmarks' | 'history';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedStatue, setSelectedStatue] = useState<Statue | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [historyItems, setHistoryItems] = useState<Array<{ statue: Statue; timestamp: number }>>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load bookmarks and history from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    const savedHistory = localStorage.getItem('history');
    
    if (savedBookmarks) {
      setBookmarkedIds(JSON.parse(savedBookmarks));
    }
    if (savedHistory) {
      setHistoryItems(JSON.parse(savedHistory));
    }
  }, []);

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
      setHistoryItems(prev => {
        // Remove duplicates and add new item at the beginning
        const filtered = prev.filter(item => item.statue.id !== statue.id);
        return [{ statue, timestamp: Date.now() }, ...filtered];
      });
      setCurrentView('home');
    }
  };

  const handleBookmark = (statueId: string) => {
    setBookmarkedIds(prev => {
      if (prev.includes(statueId)) {
        return prev.filter(id => id !== statueId);
      } else {
        return [...prev, statueId];
      }
    });
  };

  const handleSelectFromHistory = (statue: Statue) => {
    setSelectedStatue(statue);
    setCurrentView('home');
  };

  const bookmarkedStatues = bookmarkedIds.map(id => statuesData[id]).filter(Boolean);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header with Dark Mode Toggle */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg text-neutral-900 dark:text-white">Exhibition Scanner</h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          aria-label="Toggle dark mode"
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
                <h2 className="text-neutral-600 dark:text-neutral-400 mb-2">No Statue Selected</h2>
                <p className="text-neutral-500 dark:text-neutral-500 text-sm">
                  Scan a QR code to view the 3D model and information about the original statue
                </p>
              </div>
            )}
          </div>
        )}

        {currentView === 'scanner' && (
          <Scanner onScan={handleScan} darkMode={darkMode} />
        )}

        {currentView === 'bookmarks' && (
          <Bookmarks
            statues={bookmarkedStatues}
            onSelect={(statue) => {
              setSelectedStatue(statue);
              setCurrentView('home');
            }}
            darkMode={darkMode}
          />
        )}

        {currentView === 'history' && (
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
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('scanner')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'scanner' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Scan className="w-6 h-6" />
            <span className="text-xs mt-1">Scan</span>
          </button>

          <button
            onClick={() => setCurrentView('bookmarks')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'bookmarks' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs mt-1">Saved</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentView === 'history' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      </nav>
    </div>
  );
}