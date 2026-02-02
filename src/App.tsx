import { clsx } from 'clsx';
import { Bookmark, Clock, Home, Moon, Scan, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Bookmarks } from './components/Bookmarks';
import { History } from './components/History';
import { Scanner } from './components/Scanner';
import { StatueViewer } from './components/StatueViewer';
import { Tutorial } from './components/Tutorial';

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
export type EpochNarrative = {
  description: string;
};
export type StatueNarrativeComplex = {
  description: string;
  images?: {
    title: string;
    description?: string;
    path: string;
  }[];
};

export type EpochKey = 'Hellenismus' | 'Klassik' | 'Renaissance' | 'Moderne';

export type Epoch = {
  name: string;
  color: string;
  description: string;
};

export const epochs: Record<EpochKey, Epoch> = {
  Hellenismus: {
    name: 'Hellenismus',
    color: '#e4c76a',
    description:
      'Bevorzugt dramatische Bewegungen, starke Emotionen und fein ausgearbeitete Details, die den Moment wie eingefroren wirken lassen.',
  },
  Klassik: {
    name: 'Klassik',
    color: '#d88c3a',
    description:
      'Sucht nach ausgewogenen Proportionen, klaren Linien und ruhiger Harmonie – Schönheit entsteht durch Maß und Ordnung.',
  },
  Renaissance: {
    name: 'Renaissance',
    color: '#7e8ed8',
    description:
      'Entdeckt antike Ideale neu, verbindet Anatomie, Perspektive und individuelle Ausdruckskraft zu einer humanistischen Bildsprache.',
  },
  Moderne: {
    name: 'Moderne',
    color: '#4f9da6',
    description:
      'Bricht mit traditionellen Idealen, zeigt Materialspuren bewusst und setzt auf experimentelle Formen, um Denken und Prozess sichtbar zu machen.',
  },
};

export type Statue = {
  id: string;
  name: string;
  description: string;
  period: EpochKey;
  location: string;
  year: string;
  imageUrl: string;
  artist?: string;
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
  kunstepoche?: EpochNarrative;
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
  'faustkaempfer-quirinal': {
    id: 'faustkaempfer-quirinal',
    name: 'Faustkämpfer von Quirinal',
    description:
      'Der Faustkämpfer vom Quirinal ist eine seltene bronzene Großplastik eines sitzenden, erschöpften Boxer nach dem Kampf. Die detailreichen Schlagspuren und Narben betonen die Härte des antiken Ringkampfs. Die Hände sind in antiken "Himantes" gewickelt - typische Boxhandschuhe der Antike. Die Statue gilt als eines der seltensten, erhaltenen und bedeutenden Originalbronzewerke der Antike, da viele Bronzestatuen eingeschmolzen wurden.',
    period: 'Hellenismus',
    location: 'Rom, Museo Nazionale Romano (Palazzo Massimo)',
    year: '4.–3. Jh. v. Chr.',
    imageUrl: '/images/faustkaempfer_von_quirinal/ausstellung.jpg',
    material: 'Bronze',
    foundLocation: 'Rom, Italien',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
    foundLocationImages: ['/images/faustkaempfer_von_quirinal/fundort_1.png'],
    model: createModelConfig('/models/david.glb', {
      position: [0, -1.6, 0],
      scale: 2,
    }),
    mythologie: {
      description:
        'Der Faustkämpfer war im antiken Griechenland hoch angesehen. Athletik galt als Ausdruck von Tüchtigkeit und Exzellenz (griech. areté). Siege brachten Ruhm, Ehre und sozialen Aufstieg, nicht nur für den Athleten sondern auch für seine polis (griech. Stadt). Gleichzeitig war der Faustkampf extrem brutal - der Körper war Opfer für Ruhm und Anerkennung.',
      images: [
        {
          title: 'Stadionstimmung wie in einer antiken Arena',
          path: '/images/faustkaempfer_von_quirinal/mythologie_1.jpg',
        },
      ],
    },
    kunstepoche: {
      description:
        'Hellenistische Plastik liebt Realismus und Emotion: angespannte Muskulatur, verletzte Hände und ein Moment des Durchatmens nach dem Kampf. Die Statue verkörpert ein zentrales ANliegen der hellenistischen Kunst: nicht das ideale, zeitlose Schönheitsideal, sondern den individuelken, leidenden, erschöpften Menschen. Der Körper ist gezeichnet von Berletzungen wie Narben, geschwollenen Ohren und Blutresten aus Kupfer. Die Haltung zeigt Müdigkeit und innere Spannung, nicht Triumph.',
    },
  },
  ringergruppe: {
    id: 'ringergruppe',
    name: 'Ringergruppe',
    description:
      'Die Ringergruppe zeigt zwei Athleten im Bodenkampf, eingefroren im Moment maximaler Spannung. Die verschränkten Körper machen die Dynamik und Technik des antiken Ringens sichtbar. Die Szene wurde als Rundplastik konzipiert. So kann die Komposition aus jeder Perspektive gelesen werden und zeigt so wechselnde Momente des Kampfes.',
    period: 'Hellenismus',
    location: 'Florenz, Uffizien',
    year: 'um 3. Jh. v. Chr.',
    imageUrl: '/images/ringergruppe/ausstellung.jpg',
    material: 'Marmor',
    foundLocation: 'Wahrscheinlich Rom',
    foundCoordinates: { lat: 41.9028, lng: 12.4964 },
    foundLocationImages: ['/images/ringergruppe/fundort_1.png'],
    damages: [],
    model: createModelConfig('/models/venus.glb', {
      position: [0, -1.2, 0],
      scale: 0.7,
      camera: { position: [0, 1.4, 9], fov: 40 },
      controls: { minDistance: 2, maxDistance: 10 },
    }),
    mythologie: {
      description:
        'Der Kampf ist weniger sportlich als erotisch-symbolisch. Er zeigt den Konflikt zwischen dem Naturtrieb - Pan - und jugendlicher Zurückhaltung oder Widerstand. Der Pan ist ein Hirtengott - ein Mischwesen aus Menschen und Ziege. Er verkörpert Natur, Sexualität, Triebhaftigkeit und Wildheit. In Mythen verfolgen Pan häufig Nymphen oder Jünglinge erotisch. Der Jüngling, oft als Daphnis gedeutet, ist ein schöner Hirtenjunge aus der griechischen Mythologie. Er ist ein Symbol für Jugend, Schönheit und Unschuld. In vielen Erzählungen wird er von Göttern oder Naturwesen begehrt. ',
      images: [
        {
          title:
            'Statue des Gottes Pan, der seinem Eromenos (griech. Geliebter), dem Hirten Daphnis, das Flötenspielen beibringt. ',
          path: '/images/ringergruppe/mythologie_1.webp',
        },
      ],
    },
    kunstepoche: {
      description:
        'Hellenistische Athletenbilder setzen auf körperliche Spannung und realistische Körperlichkeit – jede Muskelpartie wird zur Erzählung des Wettkampfs. Es ist ein typisches Beispiel für die hellenistische Plastik. Die Figuren sind in einem verschränkten, spiralartigen Kamf dargestellt. Es gibt keine ruhige, ausgewogene Haltung, sondern Spannung und körperlichen Einsatz. Muskeln, Körperhaltungen und Proportionen sind realistisch und teilweise bewusst "unschön". Statt Göttern in idealer Form, zeigt man Mischwesen, Erotik, Gewalt und körperliche Auseinandersetzung.',
    },
  },
  'hera-tempel-paestum': {
    id: 'hera-tempel-paestum',
    name: 'Hera-Tempel in Paestum',
    description:
      'Der Hera-Tempel in Paestum (auch Basilika genannt) ist einer der ältesten dorischen Tempel Süditaliens. Mächtige Travertinsäulen und eine strenge Säulenhalle vermitteln archaische Monumentalität. Lange Zeit wurde der Tempel als "Basilika" bezeichnet, da frühe Forscher seinen sakralen Charakter nicht erkannten. Auffällig sind die neun Frontsäulen an der schlaen Seite anstelle der üblichen sechs Säulen. Innen besitzt der Tempel eine zweischiffige Cella mit doppelten Säulenreihen, was architektonisch ungewöhnlich ist.',
    period: 'Klassik',
    location: 'Paestum, Italien',
    year: 'um 560 v. Chr.',
    imageUrl: '/images/hera_tempel_in_paestum/ausstellung.jpg',
    material: 'Travertin',
    foundLocation: 'Paestum, Italien',
    foundCoordinates: { lat: 40.4237, lng: 15.0069 },
    foundLocationImages: ['/images/hera_tempel_in_paestum/fundort_1.png'],
    model: createModelConfig('/models/thinker.glb', {
      position: [0, -1.4, 0],
      scale: 2.4,
      camera: { position: [0, 1.0, 2.7], fov: 40 },
      controls: { minDistance: 0.8, maxDistance: 4 },
    }),
    mythologie: {
      description:
        'Hera ist die Gemahlin des Zeus und eine der wichtigsten olympischen Göttinnen. Sie ist die Göttin der Ehe und legitimier Ordnung, die Göttin der Familie und Fruchtbarkeit sowie des Schutzes von Frauen. Paestum war ene griechische Kolonie und und Hera war Schutzgöttin der Polis (griech. Stadt). Der Tempel stand wahrscheinlich in Verbindung mit Hochzeiten, Fruchtbarkeitsritualen und Bitten um Schutz und Stabilität der Gemeinschaft. Die stabile, massive Bauweise des Tempels spiegelt Heras Rolle als Hüterin der Ordnung und des Gesetztes wider. ',
      images: [
        {
          title: 'Griechische Hochzeit im Hera-Tempel. ',
          path: '/images/hera_tempel_in_paestum/mythologie_1.avif',
        },
      ],
    },
    kunstepoche: {
      description:
        'Der sogenannte Hera-Tempel I in Paestum enstand im Übergang von der Archaik zur frühen Klassik. Er ist ein zentrales Beispiel für klassische, griechische Architektur in Süditalien. Archaische dorische Architektur ist geprägt von massiven Säulen, eng stehenden Stützen und eine klare Gliederung. Es gibt keine dramatischen Bewegungen wie im Hellenismus, sondern Stabilität, Klarheit und Dauerhaftigkeit. Die Architektur gfolgt festen Regeln. Dadurch soll das klassische Ideal des Kosmos, der Ordnung und Rationalität zum Ausdruck kommen.',
    },
  },
  'torso-belvedere': {
    id: 'torso-belvedere',
    name: 'Torso von Belvedere',
    description:
      'Der Torso von Belvedere, vermutlich Herakles, zeigt die kraftvolle Drehung eines sitzenden Athleten. Trotz fehlender Gliedmaßen vermittelt der Torso monumentale Spannung und Anatomie. Der Torso wurde bewusst nicht ergänzt. Denn schon in der Renaissance lehnten Michelangelo und andere Künstler jede Rekonstruktion ab, weil sie den Ausdruck und die Komposition als vollkommen empfanden.',
    period: 'Klassik',
    location: 'Nationalmuseum Rom',
    year: '460-450 v. Chr.',
    imageUrl: '/images/torso_vom_belvedere/ausstellung.jpg',
    material: 'Marmor',
    foundLocation: 'Hadrians Villa, Tivoli, Italien',
    foundCoordinates: { lat: 41.9409, lng: 12.7739 },
    foundLocationImages: ['/images/torso_vom_belvedere/fundort_1.png'],
    model: createModelConfig('/models/discobolus.glb', {
      position: [0, -2.8, 0],
      scale: 2.2,
      controls: { minDistance: 1.4, maxDistance: 5.5 },
    }),
    damages: [
      {
        part: 'Rekonstruktion mit einer Keule und einem Löwenfell',
        description:
          'In historischen Rekonstruktionsversuchen wurde der Torso oft als Herakles ergänzt.',
        imageUrl: '/images/torso_vom_belvedere/mythologie_1.png',
      },
    ],
    mythologie: {
      description:
        'Die verbreitetste Interpretation sieht im Torso Herakles (Herkules). Er symbolisiert übermenschliche Kraft, Leiden und Mühsal sowie die heroische Selbstüberwindung. Die extrem kräftige und gespannte Muskulatur und die sitzende, ruhende HAltung, welche für Erschöpfung nach vollbrachter Tat steht, weisen auf Herakles hin. Wahrscheinlich hielt die Figur eine Keule oder trug das Löwenfell, ein Attribut des Herakles.',
      images: [
        {
          title: 'Herkules',
          path: '/images/torso_vom_belvedere/mythologie_2.webp',
        },
      ],
    },
    kunstepoche: {
      description:
        'Der Torso von Belvedere ist eine römische MArmorkopie, die auf ein griechisches Original der späten Klassik zurückgeht. Das Oroginal wird meist Apollonios von Athen zugeschrieben.Klassisch-griechische Kunst sucht ideale Proportionen. Der Diskobolos nutzt eine harmonische, fast mathematische Kurve, um Bewegung und Gleichgewicht in Marmor zu bannen. Der Körper ist leicht gedreht. So entsteht Sapannung zwischen Ruhe und Bewegung. Es gibt keine extremen Emotionen wie im Hellenismus, sondern kontrollierte Energie. Der Körper selbst wird zum Hauptthema, nicht Handlungen oder die Umgebung. Dies ist der Übergang von der strengen Klassik zu einer subjektiveren, körperbetonten Darstellung.',
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
      scale: 2.5,
      position: [0, -1.4, 0],
      rotation: [0, 1.8, 0],
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
    },
  },
  athena_parthenos: {
    id: 'athena_parthenos',
    name: 'Athena Parthenos',
    description:
      'Der 34 cm große, hier im Abguss gezeigte Kopf ist eine verkleinerte Kopie des ca. 12 m hohen Goldelfenbein-Kultbilds des Phidias aus dem Parthenon in Athen. Das Gesicht des Kopfes in Kopenhagen wirkt deutlich ovaler, die Wangenknochen sind schmaler und das Kinn weniger rund als es für das Original aus dem Parthenon überliefert ist. Ähnliche Züge finden sich beispielsweise bei der Statuette aus Madrid. Der attische Helm ist nur noch schlecht erhalten, je ein Pegasus an jeder Seite und eine Sphinx in der Mitte des Helms sind in Ansätzen erkennbar. Sie sind auch für das Original in Athen belegt.',
    period: 'Klassik',
    location: 'Kopenhagen, Ny Carlsberg Glyptotek',
    year: 'Römische Kopie aus der ersten Hälfte des 1. Jhs. n. Chr. nach griechischem Original aus dem 5. Jahrzehnt des 5. Jhs. v. Chr.',
    imageUrl: '/images/athena_parthenos/ausstellung.jpg',
    material: 'Pentelischer Marmor',
    foundLocation: 'Vermutlich Italien, Umbrien',
    foundCoordinates: { lat: 42.850723, lng: 11.3502611 },
    foundLocationImages: ['/images/athena_parthenos/fundort_1.png'],
    damages: [
      {
        part: 'Helm',
        description:
          'Der Helm der Athena Parthenos war ein attischer Helm, hoch und weit nach hinten gezogen, mit einem ausgeprägten Helmrand und einer hohen Helmzier. Zentrale Zierfigur war eine Sphinx, flankiert von je einem Pegasus. Diese symbolisierten Schutz, Weisheit und die Verbindung Athenas zu mythischen Helden.',
        imageUrl: '/images/athena_parthenos/damage_helmet.jpeg',
      },
      {
        part: 'Körper',
        description:
          'Die ursprüngliche Statue war ca. 12m hoch. Die rechte Hand hielt eine Nike-Figur, die linke Hand ruhte auf einem großen Rundschild, neben dem sich eine Schlange (oft als Erichthonios interpretiert) befand.',
        imageUrl: '/images/athena_parthenos/damage_body.jpeg',
      },
    ],
    model: createModelConfig('/models/athena_parthenos.glb', {
      scale: 3.2,
      position: [0, -2.2, 0],
      rotation: [0, -1.7, 0],
      camera: {
        position: [0, 0, 4],
        fov: 50,
      },
      controls: {
        minDistance: 2,
        maxDistance: 8,
      },
    }),
    mythologie: {
      description:
        'Athena, bewaffnet dem Kopf des Zeus entsprungen, verkörpert Weisheit, Strategie und Schutz. Ihre Nike in der Hand feiert den Triumph Athens; Ölbaumgabe, Schild und Schlange erinnern an Ordnung, Fruchtbarkeit und göttliche Herkunft.',
      images: [
        {
          title: 'Motivdetails',
          path: '/images/athena_parthenos/motiv_details.jpeg',
        },
      ],
    },
    kunstepoche: {
      description:
        'Die Klassik strebt nach Harmonie, idealen Proportionen und ruhiger Bewegtheit. Die Athena Parthenos verbindet monumentale Präsenz mit fein austarierten Gesichtszügen und erzählt so den Anspruch Athens auf kulturelle und politische Führerschaft.',
    },
  },
};

const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const normalizeQrValue = (value: string) => {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? trimmed;
  } catch {
    return trimmed;
  }
};

export default function App() {
  return <AppWithRouter />;
}

function AppWithRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTutorialPage = location.pathname === '/tutorial';
  const [darkMode, setDarkMode] = useState(() =>
    getStoredValue<boolean>('darkMode', false)
  );
  const [bookmarkedIds, setBookmarkedIds] = useState(() =>
    getStoredValue<string[]>('bookmarks', [])
  );
  const [historyItems, setHistoryItems] = useState(() =>
    getStoredValue<Array<{ statue: Statue; timestamp: number }>>('history', [])
  );

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

  const addToHistory = (statue: Statue) => {
    setHistoryItems((prev) => {
      const filtered = prev.filter((item) => item.statue.id !== statue.id);
      return [{ statue, timestamp: Date.now() }, ...filtered];
    });
  };

  const handleScan = (qrData: string) => {
    const normalized = normalizeQrValue(qrData);
    const statue = statuesData[normalized.toLowerCase()];
    if (statue) {
      addToHistory(statue);
      navigate(`/statue/${statue.id}`);
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
    navigate(`/statue/${statue.id}`);
  };

  const bookmarkedStatues = useMemo(
    () => bookmarkedIds.map((id) => statuesData[id]).filter(Boolean),
    [bookmarkedIds]
  );

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      {!isTutorialPage && (
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Appgus Logo"
              className="w-20 h-20 rounded-full border border-neutral-200 dark:border-neutral-700 object-cover"
            />
            <h1 className="text-lg text-neutral-900 dark:text-white">
              Ausstellungs-Scanner – Abgusssammlung Berlin
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
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <HomeRoute
                darkMode={darkMode}
                bookmarkedIds={bookmarkedIds}
                onBookmark={handleBookmark}
                addToHistory={addToHistory}
              />
            }
          />
          <Route
            path="/statue/:statueId"
            element={
              <HomeRoute
                darkMode={darkMode}
                bookmarkedIds={bookmarkedIds}
                onBookmark={handleBookmark}
                addToHistory={addToHistory}
              />
            }
          />
          <Route path="/scanner" element={<Scanner onScan={handleScan} />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route
            path="/bookmarks"
            element={
              <Bookmarks
                statues={bookmarkedStatues}
                onSelect={(statue) => navigate(`/statue/${statue.id}`)}
              />
            }
          />
          <Route
            path="/history"
            element={<History items={historyItems} onSelect={handleSelectFromHistory} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      {!isTutorialPage && (
        <nav className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => navigate('/')}
              className={clsx(
                'nav-btn',
                location.pathname === '/' || location.pathname.startsWith('/statue')
                  ? 'nav-btn-active'
                  : undefined
              )}
              aria-current={
                location.pathname === '/' || location.pathname.startsWith('/statue')
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Start</span>
            </button>

            <button
              onClick={() => navigate('/scanner')}
              className={clsx(
                'nav-btn',
                location.pathname === '/scanner' ? 'nav-btn-active' : undefined
              )}
              aria-current={location.pathname === '/scanner'}
            >
              <Scan className="w-6 h-6" />
              <span className="text-xs mt-1">Scannen</span>
            </button>

            <button
              onClick={() => navigate('/bookmarks')}
              className={clsx(
                'nav-btn',
                location.pathname === '/bookmarks' ? 'nav-btn-active' : undefined
              )}
              aria-current={location.pathname === '/bookmarks'}
            >
              <Bookmark className="w-6 h-6" />
              <span className="text-xs mt-1">Gespeichert</span>
            </button>

            <button
              onClick={() => navigate('/history')}
              className={clsx(
                'nav-btn',
                location.pathname === '/history' ? 'nav-btn-active' : undefined
              )}
              aria-current={location.pathname === '/history'}
            >
              <Clock className="w-6 h-6" />
              <span className="text-xs mt-1">Verlauf</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

function HomeRoute({
  darkMode,
  bookmarkedIds,
  onBookmark,
  addToHistory,
}: {
  darkMode: boolean;
  bookmarkedIds: string[];
  onBookmark: (id: string) => void;
  addToHistory: (statue: Statue) => void;
}) {
  const { statueId } = useParams<{ statueId: string }>();
  const navigate = useNavigate();
  const statue = statueId ? statuesData[statueId.toLowerCase()] : null;

  useEffect(() => {
    if (statue) addToHistory(statue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statue]);

  if (!statue) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Scan className="w-24 h-24 text-neutral-300 dark:text-neutral-600 mb-4" />
        <h2 className="text-neutral-600 dark:text-neutral-400 mb-2">
          Keine Statue ausgewählt
        </h2>
        <p className="text-neutral-500 dark:text-neutral-500 text-sm mb-4">
          Scanne einen QR-Code, um das 3D-Modell und Informationen zur originalen Statue
          zu sehen
        </p>
        <button
          onClick={() => navigate('/scanner')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
        >
          <Scan className="w-4 h-4" />
          Scannen
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <StatueViewer
        allStatues={statuesData}
        key={statue.id}
        statue={statue}
        isBookmarked={bookmarkedIds.includes(statue.id)}
        onBookmark={() => onBookmark(statue.id)}
        darkMode={darkMode}
      />
    </div>
  );
}
