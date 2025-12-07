import { BookmarkX } from "lucide-react";
import { Statue } from "../App";

type BookmarksProps = {
  statues: Statue[];
  onSelect: (statue: Statue) => void;
  darkMode: boolean;
};

export function Bookmarks({ statues, onSelect, darkMode }: BookmarksProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
        <h1 className="text-neutral-900 dark:text-white">Saved Statues</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {statues.length} {statues.length === 1 ? "statue" : "statues"} saved
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {statues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <BookmarkX className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mb-4" />
            <h2 className="text-neutral-600 dark:text-neutral-400 mb-2">
              No Saved Statues
            </h2>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm">
              Bookmark statues to easily access them later
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {statues.map((statue) => (
              <button
                key={statue.id}
                onClick={() => onSelect(statue)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                    <img
                      src={statue.imageUrl}
                      alt={statue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-neutral-900 dark:text-white mb-1">
                      {statue.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      {statue.artist}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      {statue.period} • {statue.year}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
