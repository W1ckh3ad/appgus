import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Tutorial() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full bg-neutral-950 text-white flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Zurück zur Startseite"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>
        <h1 className="text-base font-medium">Video-Tutorial</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-4xl">
          <video
            src="/app_guss_tutorial.mp4"
            controls
            style={{
              maxHeight: '80vh',
              margin: '0 auto',
            }}
          >
            Dein Browser unterstützt das Video-Tag nicht. Du kannst die Datei direkt unter
            /app_guss_tutorial.mp4 öffnen.
          </video>
        </div>
      </div>
      <div className="p-4 flex items-center gap-3">
        <a
          href="/app_guss_tutorial.mp4"
          style={{
            display: 'block',
            padding: '.5rem 1rem',
            border: '1px solid black',
            borderRadius: '0.25rem',
            color: 'black',
          }}
        >
          Video öffnen
        </a>
      </div>
    </div>
  );
}
