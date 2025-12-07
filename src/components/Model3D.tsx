import { Move, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Statue } from "../App";

type Model3DProps = {
  statue: Statue;
  darkMode: boolean;
};

export function Model3D({ statue, darkMode }: Model3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pos = "touches" in e ? e.touches[0] : e;
    lastPos.current = { x: pos.clientX, y: pos.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const pos = "touches" in e ? e.touches[0] : e;
    const deltaX = pos.clientX - lastPos.current.x;
    const deltaY = pos.clientY - lastPos.current.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));

    lastPos.current = { x: pos.clientX, y: pos.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  const getStatueModel = () => {
    switch (statue.id) {
      case "david":
        return (
          <div className="statue-model">
            {/* Head */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg" />
            {/* Neck */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-12 h-8 bg-gradient-to-br from-amber-100 to-amber-200" />
            {/* Torso */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-t-xl shadow-xl" />
            {/* Left Arm */}
            <div className="absolute top-[32%] left-[35%] w-8 h-28 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg origin-top rotate-12" />
            {/* Right Arm */}
            <div className="absolute top-[32%] right-[35%] w-8 h-28 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg origin-top -rotate-12" />
            {/* Legs */}
            <div className="absolute top-[60%] left-[43%] w-10 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-b-full shadow-xl" />
            <div className="absolute top-[60%] left-[52%] w-10 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-b-full shadow-xl" />
            {/* Base */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-lg shadow-2xl" />
          </div>
        );
      case "venus":
        return (
          <div className="statue-model">
            {/* Head */}
            <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full shadow-lg" />
            {/* Hair */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-20 h-12 bg-gradient-to-br from-stone-200 to-stone-300 rounded-t-full" />
            {/* Neck */}
            <div className="absolute top-[23%] left-1/2 -translate-x-1/2 w-10 h-6 bg-gradient-to-br from-stone-100 to-stone-200" />
            {/* Torso */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-24 h-36 bg-gradient-to-br from-stone-100 to-stone-200 rounded-t-2xl shadow-xl" />
            {/* Drape */}
            <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-28 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-b-3xl shadow-lg" />
            {/* Base */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-36 h-10 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-lg shadow-2xl" />
          </div>
        );
      case "thinker":
        return (
          <div className="statue-model">
            {/* Head (leaning) */}
            <div className="absolute top-[15%] left-[55%] -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg transform rotate-12" />
            {/* Supporting Arm */}
            <div className="absolute top-[28%] left-[52%] w-10 h-20 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg transform rotate-45 origin-top" />
            {/* Torso */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-28 h-20 bg-gradient-to-br from-amber-700 to-amber-800 rounded-t-2xl shadow-xl" />
            {/* Legs (bent) */}
            <div className="absolute top-[60%] left-[40%] w-12 h-20 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg" />
            <div className="absolute top-[60%] left-[52%] w-12 h-20 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full shadow-lg" />
            {/* Rock Base */}
            <div
              className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-40 h-16 bg-gradient-to-br from-stone-500 to-stone-600 shadow-2xl transform skew-x-2"
              style={{
                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </div>
        );
      case "winged-victory":
        return (
          <div className="statue-model">
            {/* Head area (missing in original) */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-12 h-8 bg-gradient-to-br from-stone-200 to-stone-300 rounded-t-xl" />
            {/* Torso */}
            <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-20 h-28 bg-gradient-to-br from-stone-200 to-stone-300 shadow-xl" />
            {/* Flowing Dress */}
            <div
              className="absolute top-[48%] left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-br from-stone-100 to-stone-200 shadow-lg transform rotate-2"
              style={{
                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
              }}
            />
            {/* Left Wing */}
            <div
              className="absolute top-[25%] left-[20%] w-24 h-36 bg-gradient-to-br from-slate-50 to-slate-200 shadow-2xl transform -rotate-12 origin-right"
              style={{
                clipPath: "polygon(0% 20%, 100% 0%, 100% 80%, 0% 100%)",
              }}
            />
            {/* Right Wing */}
            <div
              className="absolute top-[25%] right-[20%] w-24 h-36 bg-gradient-to-br from-slate-50 to-slate-200 shadow-2xl transform rotate-12 origin-left"
              style={{
                clipPath: "polygon(0% 0%, 100% 20%, 100% 100%, 0% 80%)",
              }}
            />
            {/* Ship Prow Base */}
            <div
              className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-32 h-20 bg-gradient-to-br from-neutral-400 to-neutral-500 shadow-2xl"
              style={{
                clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950">
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative w-64 h-96 transition-transform"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
            transformStyle: "preserve-3d",
          }}
        >
          {getStatueModel()}
        </div>
      </div>

      {/* Shadow */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 dark:bg-black/30 rounded-full blur-xl"
        style={{
          transform: `scale(${scale})`,
        }}
      />

      {/* Controls hint */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Move className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Zum Drehen ziehen
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Zum Zoomen scrollen
          </span>
        </div>
      </div>
    </div>
  );
}
