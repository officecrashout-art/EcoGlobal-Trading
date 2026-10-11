"use client";

import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface AccessoryModelViewerProps {
  modelSrc: string;
  title: string;
}

function NormalizedGLBScene({ url, onError }: { url: string; onError: () => void }) {
  const [normalizedGroup, setNormalizedGroup] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        if (cancelled) return;
        const clonedScene = gltf.scene.clone(true);

        // Compute bounding box & auto-normalize scale + center so ANY user .glb fits the studio frame
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const targetSize = 2.35;
        const scaleFactor = targetSize / maxDim;

        const wrapper = new THREE.Group();
        clonedScene.position.set(
          -center.x * scaleFactor,
          -center.y * scaleFactor,
          -center.z * scaleFactor
        );
        clonedScene.scale.setScalar(scaleFactor);
        wrapper.add(clonedScene);

        setNormalizedGroup(wrapper);
      },
      undefined,
      () => {
        if (!cancelled) {
          onError();
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url, onError]);

  if (!normalizedGroup) return null;

  return (
    <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.3}>
      <primitive object={normalizedGroup} />
    </Float>
  );
}

export default function AccessoryModelViewer({
  modelSrc,
  title,
}: AccessoryModelViewerProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-surface p-4 text-center text-xs text-muted">
        <p className="font-mono uppercase tracking-wider text-forest">
          3D Asset Slot Ready
        </p>
        <p className="mt-1">
          Place <code className="font-mono text-charcoal">{modelSrc}</code> in{" "}
          <code className="font-mono text-charcoal">public{modelSrc}</code>
        </p>
      </div>
    );
  }

  return (
    <div
      aria-label={`Interactive 3D model viewer for ${title}`}
      className="relative h-full w-full cursor-grab active:cursor-grabbing bg-[#091822]"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 3.9], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.75} color="#D8F1F8" />
        <directionalLight position={[4, 6, 5]} intensity={2.1} color="#FFFFFF" />
        <directionalLight position={[-4, 2, 3]} intensity={1.1} color="#5AC5E5" />
        <directionalLight position={[0, -4, -3]} intensity={0.85} color="#F59E0B" />

        <Environment resolution={64} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            position={[3, 4, 3]}
            scale={[6, 6, 1]}
            color="#FFFFFF"
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            position={[-4, 1, 2]}
            scale={[5, 4, 1]}
            color="#5AC5E5"
          />
          <Lightformer
            form="ring"
            intensity={1.4}
            position={[0, -4, 2]}
            scale={4}
            color="#268CA9"
          />
        </Environment>

        <NormalizedGLBScene url={modelSrc} onError={() => setHasError(true)} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.2}
          maxDistance={6.5}
          autoRotate
          autoRotateSpeed={1.8}
        />
      </Canvas>

      {/* Bottom Interactive Hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3.5 py-2 text-[10px] font-mono uppercase tracking-[0.14em] text-slate-200">
        <span>DRAG TO ROTATE 360° • SCROLL TO ZOOM</span>
        <span className="text-[#5AC5E5]">3D .GLB</span>
      </div>
    </div>
  );
}
