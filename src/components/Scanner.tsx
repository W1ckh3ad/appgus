import { AlertCircle, QrCode } from "lucide-react";
import { useRef, useState } from "react";

type ScannerProps = {
  onScan: (data: string) => void;
  darkMode: boolean;
};

export function Scanner({ onScan, darkMode }: ScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate QR code scanning with manual input for demo purposes
  const handleManualInput = () => {
    const value = inputRef.current?.value.trim();
    if (value) {
      onScan(value);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setError(null);
    } else {
      setError("Please enter a valid code");
    }
  };

  const quickScanOptions = [
    { label: "David", value: "david" },
    { label: "Venus de Milo", value: "venus" },
    { label: "The Thinker", value: "thinker" },
    { label: "Winged Victory", value: "winged-victory" },
    { label: "Discobolus", value: "discobolus" },
    { label: "Laocoön", value: "laocoon" },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
        <h1 className="text-center mb-2 text-neutral-900 dark:text-white">
          Scan QR Code
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
          Position the QR code within the frame to scan
        </p>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        {/* Simulated Camera View */}
        <div className="relative w-full max-w-sm aspect-square bg-neutral-900 dark:bg-neutral-950 rounded-2xl overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-32 h-32 text-neutral-700 dark:text-neutral-800" />
          </div>

          {/* Scanner Frame */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full h-full">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 dark:border-blue-400" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 dark:border-blue-400" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 dark:border-blue-400" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 dark:border-blue-400" />

              {/* Scanning line animation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 dark:bg-blue-400 animate-scan" />
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="w-full max-w-sm bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                Demo Mode: Enter a statue code or use quick scan buttons below
              </p>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g., david"
                  className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleManualInput()}
                />
                <button
                  onClick={handleManualInput}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Scan
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="w-full max-w-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Quick Scan Options */}
        <div className="w-full max-w-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            Quick Scan:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickScanOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onScan(option.value)}
                className="px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all text-sm text-neutral-900 dark:text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
