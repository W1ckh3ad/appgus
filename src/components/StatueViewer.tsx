import { Bookmark, Info, Map, MessageCircle, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Statue, epochs } from '../App';
import { Chatbot } from './Chatbot';
import { Model3D } from './Model3D';
import { Recommendations } from './Recommendations';

type StatueViewerProps = {
  statue: Statue;
  isBookmarked: boolean;
  onBookmark: () => void;
  darkMode: boolean;
  allStatues: Record<string, Statue>;
};

export function StatueViewer({
  statue,
  isBookmarked,
  onBookmark,
  darkMode,
  allStatues,
}: StatueViewerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const epochInfo = epochs[statue.period];
  const epochSection = statue.kunstepoche
    ? { description: statue.kunstepoche.description }
    : undefined;

  const quickFactsRef = useRef<HTMLDivElement | null>(null);
  const reconstructionRef = useRef<HTMLDivElement | null>(null);
  const mythologyRef = useRef<HTMLDivElement | null>(null);
  const artEpochRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const planZones = useMemo(
    () => [
      // Eingangsbereich bleibt leer (links)
      {
        id: 'archaisch',
        label: 'Archaische\nZeit',
        years: 'ca. 700–480 v. Chr.',
        color: '#c95555', // rot
        epochsMatch: ['Archaisch'],
        style: { left: '11%', top: '22%', width: '18%', height: '80%' },
        dot: { left: '50%', top: '75%' },
      },
      {
        id: 'klassik',
        label: 'Klassik',
        years: 'ca. 480–323 v. Chr.',
        color: '#e9a44f', // orange
        epochsMatch: ['Klassik'],
        style: { left: '32%', top: '20%', width: '12%', height: '70%' },
        dot: { left: '50%', top: '70%' },
      },
      {
        id: 'hellenismus',
        label: 'Hellenismus',
        years: 'ca. 323–31 v. Chr.',
        color: '#e6d469', // gelb
        epochsMatch: ['Hellenismus'],
        style: { left: '49%', top: '12%', width: '10%', height: '70%' },
        dot: { left: '50%', top: '70%' },
      },
      {
        id: 'republik',
        label: 'Römische\nRepublik',
        years: 'ca. 509–27 v. Chr.',
        color: '#5f8a5f', // grün (kleines Feld unten)
        epochsMatch: ['Renaissance'],
        style: { left: '58%', top: '82%', width: '10%', height: '12%' },
        dot: { left: '50%', top: '70%' },
      },
      {
        id: 'kaiserzeit',
        label: 'Römische\nKaiserzeit',
        years: '27 v. Chr.–ca. 476 n. Chr.',
        color: '#7ab1d9', // blau
        epochsMatch: ['Moderne'],
        style: { left: '66%', top: '35%', width: '12%', height: '70%' },
        dot: { left: '50%', top: '70%' },
      },
      {
        id: 'spaetantike',
        label: 'Spät-\nantike',
        years: 'ca. 300–600 n. Chr.',
        color: '#9d6cb7', // lila (schmaler Streifen)
        epochsMatch: [],
        style: { left: '80%', top: '47%', width: '7%', height: '62%' },
        dot: { left: '50%', top: '70%' },
      },
    ],
    []
  );

  const activeZone = planZones.find((z) => z.epochsMatch.includes(statue.period));

  const tocItems = [
    { key: 'quickfacts', label: 'Quick Facts', visible: true },
    {
      key: 'rekonstruktion',
      label: 'Rekonstruktion',
      visible: Boolean(statue.damages && statue.damages.length > 0),
    },
    {
      key: 'mythologie',
      label: 'Mythologie',
      visible: Boolean(statue.mythologie),
    },
    {
      key: 'kunstepoche',
      label: 'Kunstepoche',
      visible: Boolean(epochSection),
    },
    { key: 'ueber', label: 'Über die Statue', visible: true },
  ];

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTocClick = (key: string) => {
    switch (key) {
      case 'quickfacts':
        scrollToSection(quickFactsRef);
        break;
      case 'rekonstruktion':
        scrollToSection(reconstructionRef);
        break;
      case 'mythologie':
        scrollToSection(mythologyRef);
        break;
      case 'kunstepoche':
        scrollToSection(artEpochRef);
        break;
      case 'ueber':
        scrollToSection(aboutRef);
        break;
      default:
        break;
    }
  };

  const openGoogleMaps = () => {
    const { lat, lng } = statue.foundCoordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const resolveImagePath = (path: string) => {
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return path;
    return `/${path}`;
  };

  const renderNarrativeSection = (
    title: string,
    data: Statue['mythologie'] | Statue['kunstepoche'],
    options?: {
      useRichImages?: boolean;
      accentColor?: string;
      subtitle?: string;
      preface?: string;
    }
  ) => {
    if (!data) return null;

    const useRichImages = options?.useRichImages ?? false;
    const headingLabel = options?.subtitle ? `${title} – ${options.subtitle}` : title;

    const renderImages = () => {
      const images = (data as { images?: Array<unknown> }).images ?? [];
      if (!images.length) return null;

      if (useRichImages) {
        const richImages = images as NonNullable<
          NonNullable<Statue['mythologie']>['images']
        >;

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {richImages.map((image, index) => (
              <div
                key={`${title}-image-${index}`}
                className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-start"
              >
                <img
                  src={resolveImagePath(image.path)}
                  alt={
                    image.title
                      ? `${title} – ${image.title}`
                      : `${title} Referenz ${index + 1}`
                  }
                  className="w-full h-auto max-h-64 max-w-[280px] object-contain"
                  loading="lazy"
                />
                {(image.title || image.description) && (
                  <div className="mt-2">
                    {image.title && (
                      <p className="text-sm text-neutral-800 dark:text-neutral-200">
                        {image.title}
                      </p>
                    )}
                    {image.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {image.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      const plainImages = images as string[];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {plainImages.map((src, index) => (
            <div
              key={`${title}-image-${index}`}
              className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center"
            >
              <img
                src={resolveImagePath(src)}
                alt={`${title} Referenz ${index + 1}`}
                className="w-full h-auto max-h-80 max-w-[240px] object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {options?.accentColor && (
            <span
              aria-hidden
              className="w-4 h-4 rounded-sm shadow-inner border border-neutral-200 dark:border-neutral-700"
              style={{ backgroundColor: options.accentColor }}
            />
          )}
          <h3 className="text-neutral-900 dark:text-white text-lg font-semibold">
            {headingLabel}
          </h3>
        </div>
        {options?.preface && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 leading-relaxed">
            {options.preface}
          </p>
        )}
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {data.description}
        </p>
        {renderImages()}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-neutral-900 dark:text-white">{statue.name}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {statue.material}
          </p>
        </div>
        <button
          onClick={onBookmark}
          className={`p-2 rounded-full border transition-colors ${
            isBookmarked
              ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900'
              : 'bg-transparent text-neutral-600 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
        >
          <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 3D Model Viewer */}
      <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 relative">
        <Model3D statue={statue} darkMode={darkMode} />

        {/* Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
          <button
            onClick={() => {
              setChatOpen(false);
              setDrawerOpen(false);
              setPlanOpen(true);
            }}
            type="button"
            className={`w-14 h-14 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center ${
              darkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Map className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setDrawerOpen(false);
              setChatOpen(true);
            }}
            type="button"
            className={`w-14 h-14 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center ${
              darkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setChatOpen(false);
              setDrawerOpen(true);
            }}
            type="button"
            className={`w-14 h-14 rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center ${
              darkMode
                ? 'bg-neutral-700 text-white hover:bg-neutral-600'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Information Drawer */}
      {!chatOpen && (
        <div
          className={`absolute inset-0 bg-white dark:bg-neutral-800 transition-transform duration-300 ease-out z-30 ${
            drawerOpen
              ? 'translate-y-0 pointer-events-auto'
              : 'translate-y-full pointer-events-none'
          }`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors z-50"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </button>

          {/* Content */}
          <div className="h-full overflow-y-auto p-6 pt-12">
            <h2 className="mb-2 text-neutral-900 dark:text-white">{statue.name}</h2>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-neutral-900 dark:text-white mb-2">
                Inhalte
              </p>
              <div className="flex flex-wrap gap-2">
                {tocItems
                  .filter((item) => item.visible)
                  .map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleTocClick(item.key)}
                      className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>
            </div>

            <div ref={quickFactsRef}>
              <h3 className="text-neutral-900 dark:text-white text-lg font-semibold mb-2 pb-2 inline-block border-b-2 border-neutral-900 dark:border-neutral-300">
                Quick Facts
              </h3>
            </div>
            <div className="mb-6 border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Name
                  </p>
                  <p className="text-neutral-900 dark:text-white">{statue.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Material
                  </p>
                  <p className="text-neutral-900 dark:text-white">{statue.material}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Epoche
                  </p>
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                    {epochInfo && (
                      <span
                        aria-hidden
                        className="w-3.5 h-3.5 rounded-sm border border-neutral-300 dark:border-neutral-600"
                        style={{ backgroundColor: epochInfo.color }}
                      />
                    )}
                    <span>{epochInfo?.name ?? statue.period}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Entstehungsjahr
                  </p>
                  <p className="text-neutral-900 dark:text-white leading-snug">
                    {statue.year}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Heutiger Standort
                  </p>
                  <p className="text-neutral-900 dark:text-white">{statue.location}</p>
                </div>
              </div>
            </div>

            {/* Found Location */}
            <div className="mb-6 border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900">
              <p className="text-xs tracking-wide uppercase text-neutral-900 dark:text-neutral-300 mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                Fundort
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                {statue.foundLocation}
              </p>
              <button
                onClick={openGoogleMaps}
                className="text-sm text-neutral-800 dark:text-neutral-200 underline decoration-neutral-500 hover:opacity-70"
              >
                Auf Google Maps ansehen &rarr;
              </button>
              {statue.foundLocationImages?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {statue.foundLocationImages.map((src, index) => (
                    <div
                      key={`found-${index}`}
                      className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center"
                    >
                      <img
                        src={src}
                        alt={`Fundort ${index + 1}`}
                        className="w-full h-auto max-h-56 max-w-[220px] object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Damages Section */}
            {statue.damages && statue.damages.length > 0 && (
              <div className="mb-6" ref={reconstructionRef}>
                <h3 className="text-neutral-900 dark:text-white text-lg font-semibold mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  Rekonstruktion
                </h3>
                <div className="space-y-4">
                  {statue.damages.map((damage, index) => (
                    <div
                      key={index}
                      className="border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4"
                    >
                      <p className="text-neutral-900 dark:text-white mb-2">
                        {damage.part}
                      </p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                        {damage.description}
                      </p>
                      <div className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                        <img
                          src={damage.imageUrl}
                          alt={`${damage.part} Referenz`}
                          className="w-full h-auto max-h-64 max-w-[260px] object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {statue.mythologie ? (
              <div ref={mythologyRef}>
                {renderNarrativeSection('Mythologie', statue.mythologie, {
                  useRichImages: true,
                })}
              </div>
            ) : null}

            {epochSection ? (
              <div ref={artEpochRef}>
                {renderNarrativeSection('Kunstepoche', epochSection, {
                  accentColor: epochInfo?.color,
                  subtitle: epochInfo?.name,
                  preface: epochInfo?.description,
                })}
              </div>
            ) : null}

            <div className="mb-6" ref={aboutRef}>
              <h3 className="text-neutral-900 dark:text-white text-lg font-semibold mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                Über die Statue
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {statue.description}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden mb-6 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <img
                src={statue.imageUrl}
                alt={statue.name}
                className="w-full h-auto max-h-[420px] object-contain"
              />
            </div>

            {/* Recommendations */}
            <Recommendations currentStatue={statue} allStatues={allStatues} />
          </div>
        </div>
      )}

      {/* Chatbot */}
      {chatOpen && <Chatbot statue={statue} onClose={() => setChatOpen(false)} />}

      {/* Lageplan Modal (inline, wie Chat) */}
      {planOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPlanOpen(false)}
            aria-hidden
          />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-[95vw] max-w-6xl max-h-[90vh] overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Lageplan
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  Epoche: {epochs[statue.period]?.name ?? statue.period}
                </p>
              </div>
              <button
                onClick={() => setPlanOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Schließen"
                type="button"
              >
                <X className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
              </button>
            </div>

            <div
              className="relative bg-neutral-50 dark:bg-neutral-950"
              style={{ fontSize: '12px' }}
            >
              <img
                src="/images/lageplan.jpeg"
                alt="Lageplan der Epochen"
                className="w-full h-full object-contain max-h-[70vh] pointer-sevents-none select-none"
              />

              {planZones.map((zone) => {
                const isActive = activeZone?.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      setSelectedZone(zone.id);
                      // Nur bei aktiver Zone: Modal schließen, Drawer öffnen, zur Epoche scrollen
                      if (isActive && epochSection) {
                        setPlanOpen(false);
                        setDrawerOpen(true);
                        setTimeout(() => scrollToSection(artEpochRef), 100);
                      }
                    }}
                    type="button"
                    className="absolute rounded-md focus:outline-none bg-transparent hover:bg-white/20 dark:hover:bg-white/10"
                    style={zone.style}
                    aria-label={`Epoche ${zone.label.replace('\n', ' ')}`}
                  >
                    <span
                      className={`font-semibold px-1 py-0.5 inline-flex text-center whitespace-pre-line rounded-md ${
                        isActive
                          ? 'text-black bg-white/95 shadow-sm'
                          : 'text-neutral-800 dark:text-neutral-200 bg-white/70 backdrop-blur'
                      }`}
                      style={{ maxWidth: '60px' }}
                    >
                      {zone.label}
                    </span>
                    {isActive && (
                      <span
                        className="absolute pointer-events-none text-black text-lg font-bold leading-none"
                        style={{
                          left: zone.dot.left,
                          top: zone.dot.top,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-3 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-black dark:text-white text-base font-bold leading-none">
                  ✕
                </span>
                <span>= Aktueller Standort der Statue</span>
              </div>
              <p>
                Tipp: Klicke auf ein Farbfeld für Infos zur Epoche. Die Epoche deiner
                Statue ist hervorgehoben – klicke darauf, um zur Beschreibung zu gelangen.
              </p>
              {selectedZone && (
                <div className="text-neutral-900 dark:text-white text-sm border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 bg-neutral-50 dark:bg-neutral-800">
                  <p className="font-semibold">
                    {planZones
                      .find((z) => z.id === selectedZone)
                      ?.label.replace('\n', ' ')}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {planZones.find((z) => z.id === selectedZone)?.years}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
