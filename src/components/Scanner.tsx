import { QrCode } from 'lucide-react';
import QrScanner from 'qr-scanner';
import qrScannerWorkerPath from 'qr-scanner/qr-scanner-worker.min.js?url';
import { useCallback, useEffect, useRef, useState } from 'react';

QrScanner.WORKER_PATH = qrScannerWorkerPath;

type BarcodeDetectorResult = { rawValue: string };

type BarcodeDetectorConstructor = new (options: { formats: string[] }) => {
  detect: (video: HTMLVideoElement) => Promise<BarcodeDetectorResult[]>;
};

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const calculateScanRegion = (video: HTMLVideoElement) => {
  const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
  const size = Math.floor(smallestDimension * 0.8);
  const x = Math.floor((video.videoWidth - size) / 2);
  const y = Math.floor((video.videoHeight - size) / 2);
  return {
    x,
    y,
    width: size,
    height: size,
    downScaledWidth: 600,
    downScaledHeight: 600,
  };
};

type ScannerProps = {
  onScan: (data: string) => void;
};

export function Scanner({ onScan }: ScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasBarcodeSupport] = useState(
    typeof window !== 'undefined' && typeof window.BarcodeDetector !== 'undefined'
  );
  const [showStatus, setShowStatus] = useState(false);
  const [statusLogs, setStatusLogs] = useState<string[]>([]);

  const appendStatus = useCallback((message: string) => {
    setStatusLogs((prev) => [
      ...prev.slice(-19),
      `${new Date().toLocaleTimeString()} – ${message}`,
    ]);
  }, []);

  const stopCamera = useCallback(() => {
    appendStatus('Kamera wird gestoppt');
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    const video = videoRef.current;
    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  }, [appendStatus]);

  const startCamera = useCallback(async () => {
    setError(null);
    appendStatus('Kamera wird gestartet');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Kamera-API wird von diesem Browser nicht unterstützt.');
      appendStatus('Kamera-API nicht verfugbar');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setIsCameraActive(true);
      setIsScanning(true);
      appendStatus('Kamera aktiv');
    } catch {
      setError('Kamerazugriff verweigert oder nicht verfügbar.');
      appendStatus('Kamerazugriff fehlgeschlagen');
    }
  }, [appendStatus]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (!isCameraActive || !isScanning || !hasBarcodeSupport) return;
    const Detector = window.BarcodeDetector;
    if (!Detector) return;
    const detector = new Detector({ formats: ['qr_code'] });
    let cancelled = false;
    let loggedStart = false;
    const intervalId = window.setInterval(async () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      if (!loggedStart) {
        appendStatus('BarcodeDetector aktiv');
        loggedStart = true;
      }
      try {
        const results = await detector.detect(video);
        if (results.length > 0) {
          appendStatus('QR erkannt (Browser-API)');
          onScan(results[0].rawValue);
          setIsScanning(false);
          stopCamera();
        }
      } catch {
        setIsScanning(false);
        appendStatus('BarcodeDetector Fehler');
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [appendStatus, hasBarcodeSupport, isCameraActive, isScanning, onScan, stopCamera]);

  useEffect(() => {
    if (!isCameraActive || !isScanning || hasBarcodeSupport) return;
    const video = videoRef.current;
    if (!video) return;
    const scanner = new QrScanner(
      video,
      (result) => {
        appendStatus('QR erkannt (Fallback)');
        onScan(result.data);
        setIsScanning(false);
        stopCamera();
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: 'environment',
        maxScansPerSecond: 12,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        calculateScanRegion,
      }
    );
    qrScannerRef.current = scanner;
    scanner
      .start()
      .then(() => {
        scanner.setInversionMode('both');
        appendStatus('Fallback-Scanner aktiv');
      })
      .catch(() => {
        setError('QR-Scanner konnte nicht gestartet werden.');
        appendStatus('Fallback konnte nicht starten');
      });

    return () => {
      scanner.stop();
      scanner.destroy();
      if (qrScannerRef.current === scanner) {
        qrScannerRef.current = null;
      }
    };
  }, [appendStatus, hasBarcodeSupport, isCameraActive, isScanning, onScan, stopCamera]);

  // Simulate QR code scanning with manual input for demo purposes
  const handleManualInput = () => {
    const value = inputRef.current?.value.trim();
    if (value) {
      onScan(value);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setError(null);
    } else {
      setError('Bitte gib einen gültigen Code ein');
    }
  };

  const quickScanOptions = [
    { label: 'Faustkämpfer von Quirinal', value: 'faustkaempfer-quirinal' },
    { label: 'Ringergruppe', value: 'ringergruppe' },
    { label: 'Hera-Tempel in Paestum', value: 'hera-tempel-paestum' },
    { label: 'Torso von Belvedere', value: 'torso-belvedere' },
    { label: 'Satyr & Hermaphrodit', value: 'satyr-hermaphrodit' },
    { label: 'Athena Parthenos', value: 'athena_parthenos' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 shrink-0">
        <h1 className="text-center mb-2 text-neutral-900 dark:text-white">
          QR-Code scannen
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm">
          Positioniere den QR-Code innerhalb des Rahmens zum Scannen
        </p>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
        {/* Camera View */}
        <div className="relative w-full max-w-sm aspect-square bg-neutral-900 dark:bg-neutral-950 rounded-2xl overflow-hidden mb-6">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
          />
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-neutral-700 dark:text-neutral-800" />
            </div>
          )}

          {/* Scanner Frame */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full h-full">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/80 dark:border-white/40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/80 dark:border-white/40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/80 dark:border-white/40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/80 dark:border-white/40" />

              {/* Scanning line animation */}
              <div className="absolute inset-x-0 top-0 h-1 bg-white/70 dark:bg-white/40 animate-scan" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-2 mb-4">
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className="w-full px-4 py-2 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
          >
            {isCameraActive ? 'Kamera stoppen' : 'Kamera starten'}
          </button>
          <button
            onClick={() => setShowStatus((prev) => !prev)}
            className="w-full px-4 py-2 bg-neutral-100 text-neutral-900 text-sm hover:bg-neutral-200 transition-colors"
          >
            {showStatus ? 'Status ausblenden' : 'Status anzeigen'}
          </button>
          {!hasBarcodeSupport && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              QR-Erkennung per Browser-API nicht unterstützt – Fallback aktiv
            </span>
          )}
        </div>
        {showStatus && (
          <div className="w-full max-w-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 mb-4 text-xs text-neutral-700 dark:text-neutral-200">
            <p className="font-medium mb-2">Status</p>
            {statusLogs.length === 0 ? (
              <p>Keine Ereignisse</p>
            ) : (
              <ul className="space-y-1">
                {statusLogs.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Demo Instructions */}
        <div className="w-full max-w-sm border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4 mb-6">
          <p className="text-sm text-neutral-700 dark:text-neutral-200 mb-3">
            Demo-Modus: Gib einen Statuencode ein oder nutze die Schnellscan-Tasten unten.
          </p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="z. B. faustkaempfer-quirinal / ringergruppe / hera-tempel-paestum"
              className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleManualInput()}
            />
            <button
              onClick={handleManualInput}
              className="px-4 py-2 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition-colors"
            >
              Scannen
            </button>
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
            Schnellscan:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {quickScanOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onScan(option.value)}
                className="px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-sm text-neutral-900 dark:text-white"
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
