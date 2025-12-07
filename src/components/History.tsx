import { History as HistoryIcon } from "lucide-react";
import { Statue } from "../App";

type HistoryProps = {
  items: Array<{ statue: Statue; timestamp: number }>;
  onSelect: (statue: Statue) => void;
  darkMode: boolean;
};

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

export function History({ items, onSelect, darkMode }: HistoryProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
        <h1 className="text-neutral-900 dark:text-white">Scan History</h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
          {items.length} {items.length === 1 ? "statue" : "statues"} scanned
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <HistoryIcon className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mb-4" />
            <h2 className="text-neutral-600 dark:text-neutral-400 mb-2">
              No Scan History
            </h2>
            <p className="text-neutral-500 dark:text-neutral-500 text-sm">
              Your scanned statues will appear here
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item, index) => (
              <button
                key={`${item.statue.id}-${index}`}
                onClick={() => onSelect(item.statue)}
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                    <img
                      src={item.statue.imageUrl}
                      alt={item.statue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-neutral-900 dark:text-white">
                        {item.statue.name}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      {item.statue.artist}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">
                      {item.statue.period} • {item.statue.year}
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
