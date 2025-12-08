import { Bookmark, Info, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Statue } from '../App';
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
    useRichImages = false
  ) => {
    if (!data) return null;

    const renderImages = () => {
      if (!data.images?.length) return null;

      if (useRichImages) {
        const richImages = ((data as Statue['mythologie'])?.images ?? []) as NonNullable<
          NonNullable<Statue['mythologie']>['images']
        >;

        return (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {richImages.map((image, index) => (
              <div
                key={`${title}-image-${index}`}
                className="rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={resolveImagePath(image.path)}
                  alt={
                    image.title
                      ? `${title} – ${image.title}`
                      : `${title} Referenz ${index + 1}`
                  }
                  className="w-full h-auto max-h-64 object-contain"
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

      const plainImages = data.images as string[];
      return (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {plainImages.map((src, index) => (
            <div
              key={`${title}-image-${index}`}
              className="aspect-video rounded-lg overflow-hidden"
            >
              <img
                src={resolveImagePath(src)}
                alt={`${title} Referenz ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="mb-6">
        <h3 className="text-neutral-900 dark:text-white tracking-wide uppercase text-xs mb-3">
          {title}
        </h3>
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Material
                </p>
                <p className="text-neutral-900 dark:text-white">{statue.material}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Epoche
                </p>
                <p className="text-neutral-900 dark:text-white">{statue.period}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Entstehungsjahr
                </p>
                <p className="text-neutral-900 dark:text-white">{statue.year}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Heutiger Standort
                </p>
                <p className="text-neutral-900 dark:text-white text-sm">
                  {statue.location}
                </p>
              </div>
            </div>

            {/* Found Location */}
            <div className="mb-6 border border-neutral-200 dark:border-neutral-700 p-4 bg-neutral-50 dark:bg-neutral-900">
              <p className="text-xs tracking-wide uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                Fundort
              </p>
              <p className="text-neutral-900 dark:text-white mb-3">
                {statue.foundLocation}
              </p>
              <button
                onClick={openGoogleMaps}
                className="text-sm text-neutral-800 dark:text-neutral-200 underline decoration-neutral-500 hover:opacity-70"
              >
                Auf Google Maps ansehen &rarr;
              </button>
              {statue.foundLocationImages?.length ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {statue.foundLocationImages.map((src, index) => (
                    <div
                      key={`found-${index}`}
                      className="aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Fundort ${index + 1}`}
                        className="w-full h-full object-cover"
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
                <h3 className="text-neutral-900 dark:text-white tracking-wide uppercase text-xs mb-3">
                  Schadensverlauf
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
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                        {damage.description}
                      </p>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={damage.imageUrl}
                          alt={`${damage.part} Referenz`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {renderNarrativeSection('Mythologie', statue.mythologie, true)}

            {renderNarrativeSection('Kunstepoche', statue.kunstepoche)}

            <div className="mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Über die Statue
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {statue.description}
              </p>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden mb-6">
              <img
                src={statue.imageUrl}
                alt={statue.name}
                className="w-full h-full object-cover"
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
