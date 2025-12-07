import {
  AlertTriangle,
  Bookmark,
  Info,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Statue } from "../App";
import { Chatbot } from "./Chatbot";
import { Model3D } from "./Model3D";
import { Recommendations } from "./Recommendations";

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

  useEffect(() => {
    if (chatOpen) {
      setDrawerOpen(false);
    }
  }, [chatOpen]);

  const openGoogleMaps = () => {
    const { lat, lng } = statue.foundCoordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-neutral-900 dark:text-white">{statue.name}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {statue.artist}
          </p>
        </div>
        <button
          onClick={onBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked
              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
              : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          }`}
        >
          <Bookmark
            className="w-5 h-5"
            fill={isBookmarked ? "currentColor" : "none"}
          />
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
            className="w-14 h-14 bg-purple-600 dark:bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-all hover:scale-105 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setChatOpen(false);
              setDrawerOpen(true);
            }}
            className="w-14 h-14 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all hover:scale-105 flex items-center justify-center"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Information Drawer */}
      {!chatOpen && (
        <>
          <div
            className={`absolute inset-x-0 bottom-0 bg-white dark:bg-neutral-800 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
              drawerOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ maxHeight: "85%" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </button>

            {/* Content */}
            <div
              className="overflow-y-auto p-6"
              style={{ maxHeight: "calc(85vh - 60px)" }}
            >
              <h2 className="mb-2 text-neutral-900 dark:text-white">
                {statue.name}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Artist
                  </p>
                  <p className="text-neutral-900 dark:text-white">
                    {statue.artist}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Period
                  </p>
                  <p className="text-neutral-900 dark:text-white">
                    {statue.period}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Year
                  </p>
                  <p className="text-neutral-900 dark:text-white">
                    {statue.year}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Current Location
                  </p>
                  <p className="text-neutral-900 dark:text-white text-sm">
                    {statue.location}
                  </p>
                </div>
              </div>

              {/* Found Location */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-300 mb-1">
                      Discovery Location
                    </p>
                    <p className="text-blue-800 dark:text-blue-200 mb-2">
                      {statue.foundLocation}
                    </p>
                    <button
                      onClick={openGoogleMaps}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                    >
                      View on Google Maps →
                    </button>
                  </div>
                </div>
              </div>

              {/* Damages Section */}
              {statue.damages && statue.damages.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <h3 className="text-neutral-900 dark:text-white">
                      Damage History
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {statue.damages.map((damage, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
                      >
                        <p className="text-amber-900 dark:text-amber-300 mb-2">
                          {damage.part}
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                          {damage.description}
                        </p>
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={damage.imageUrl}
                            alt={`${damage.part} reference`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  About
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
              <Recommendations currentStatue={statue} darkMode={darkMode} />
            </div>
          </div>

          {/* Backdrop */}
          {drawerOpen && (
            <div
              className="absolute inset-0 bg-black/20 dark:bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
          )}
        </>
      )}

      {/* Chatbot */}
      {chatOpen && (
        <Chatbot
          statue={statue}
          onClose={() => setChatOpen(false)}
          darkMode={darkMode}
        />
      )}

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="absolute inset-0 bg-black/20 dark:bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
