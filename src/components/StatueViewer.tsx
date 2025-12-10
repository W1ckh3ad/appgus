import { Bookmark, Info, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Statue, epochs } from '../App';
import { Chatbot } from './Chatbot';
import { Model3D } from './Model3D';
import { Recommendations } from './Recommendations';

type StatueViewerProps = {
  statue: Statue;
  isBookmarked: boolean;
  onBookmark: () => void;
  darkMode: boolean;
};

export function StatueViewer({
  statue,
  isBookmarked,
  onBookmark,
  darkMode,
}: StatueViewerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const epochInfo = epochs[statue.period];
  const epochSection = statue.kunstepoche
    ? { description: statue.kunstepoche.description }
    : undefined;

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
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          <button
            onClick={() => {
              setDrawerOpen(false);
              setChatOpen(true);
            }}
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
          className={`absolute inset-0 bg-white dark:bg-neutral-800 transition-transform duration-300 ease-out ${
            drawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors z-10"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          </button>

          {/* Content */}
          <div className="h-full overflow-y-auto p-6 pt-12">
            <h2 className="mb-2 text-neutral-900 dark:text-white">{statue.name}</h2>

            <div className="mb-6 border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <h3 className="text-neutral-900 dark:text-white text-lg font-semibold mb-3">
                Quick Facts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Name
                  </p>
                  <p className="text-neutral-900 dark:text-white">{statue.name}</p>
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
                    Jahr
                  </p>
                  <p className="text-neutral-900 dark:text-white">{statue.year}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-neutral-900 dark:text-neutral-300 mb-1 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  Material
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {statue.material}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-900 dark:text-neutral-300 mb-1 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  Epoche
                </p>
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
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
                <p className="text-sm text-neutral-900 dark:text-neutral-300 mb-1 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  Entstehungsjahr
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">{statue.year}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-900 dark:text-neutral-300 mb-1 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  Heutiger Standort
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  {statue.location}
                </p>
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
              <div className="mb-6">
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

            {renderNarrativeSection('Mythologie', statue.mythologie, {
              useRichImages: true,
            })}

            {renderNarrativeSection('Kunstepoche', epochSection, {
              accentColor: epochInfo?.color,
              subtitle: epochInfo?.name,
              preface: epochInfo?.description,
            })}

            <div className="mb-6">
              <p className="text-sm text-neutral-900 dark:text-neutral-300 mb-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                Über die Statue
              </p>
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
            <Recommendations currentStatue={statue} />
          </div>
        </div>
      )}

      {/* Chatbot */}
      {chatOpen && <Chatbot statue={statue} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
