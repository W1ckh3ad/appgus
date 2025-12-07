import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Move, RotateCw } from "lucide-react";
import { Suspense, useEffect, useMemo } from "react";
import { Statue } from "../App";

type Model3DProps = {
  statue: Statue;
  darkMode: boolean;
};

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="px-4 py-2 rounded-full bg-black/70 text-white text-sm font-medium">
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

function StatueMesh({ statue }: { statue: Statue }) {
  if (!statue.model?.file) return null;

  const gltf = useGLTF(statue.model.file);
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      dispose={null}
      scale={statue.model.scale ?? 1}
      position={statue.model.position ?? [0, -1.2, 0]}
      rotation={statue.model.rotation ?? [0, 0, 0]}
    />
  );
}

export function Model3D({ statue, darkMode }: Model3DProps) {
  useEffect(() => {
    if (statue.model?.file) {
      useGLTF.preload(statue.model.file);
    }
  }, [statue.model?.file]);

  const hasModel = Boolean(statue.model?.file);
  const viewerBackground = darkMode ? "#05050a" : "#f3f4f6";
  const cameraPosition = statue.model?.camera?.position ?? [0, 1.4, 4.5];
  const cameraFov = statue.model?.camera?.fov ?? 40;
  const controls = statue.model?.controls ?? {
    minDistance: 1.2,
    maxDistance: 6,
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950">
      {hasModel ? (
        <Canvas
          className="w-full h-full"
          style={{ touchAction: "none" }}
          shadows
          dpr={[1, 1.5]}
          camera={{ position: cameraPosition, fov: cameraFov }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <color attach="background" args={[viewerBackground]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <spotLight
              position={[-8, 12, -3]}
              angle={0.4}
              penumbra={0.4}
              intensity={0.7}
              castShadow
            />
            <StatueMesh statue={statue} />
            <ContactShadows
              opacity={0.35}
              scale={12}
              blur={2.8}
              far={8}
              resolution={1024}
              color={darkMode ? "#050505" : "#585858"}
            />
            <Environment preset="studio" />
            <OrbitControls
              makeDefault
              enablePan={false}
              enableDamping
              dampingFactor={0.05}
              minDistance={controls.minDistance ?? 1.2}
              maxDistance={controls.maxDistance ?? 6}
              maxPolarAngle={Math.PI * 0.92}
            />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-neutral-600 dark:text-neutral-300 mb-2">
            Kein 3D-Modell gefunden
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Lege die entsprechende GLB-Datei unter <code>/public/models</code>{" "}
            ab und aktualisiere die <span className="font-medium">model</span>
            -Konfiguration für diese Statue.
          </p>
        </div>
      )}

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
