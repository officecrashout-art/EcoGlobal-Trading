"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

interface ButtonShowcase3DProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
}

/**
 * Builds a procedural Flat 4-Hole tailoring button using ExtrudeGeometry with 4 circular hole paths,
 * paired with a raised outer rim TorusGeometry.
 */
function createFlatFourHoleGeometry() {
  const outerRadius = 0.62;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  const holeOffset = 0.17;
  const holeRadius = 0.068;
  const holeCoords: Array<[number, number]> = [
    [-holeOffset, holeOffset],
    [holeOffset, holeOffset],
    [-holeOffset, -holeOffset],
    [holeOffset, -holeOffset],
  ];

  for (const [hx, hy] of holeCoords) {
    const holePath = new THREE.Path();
    holePath.absarc(hx, hy, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
  }

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
  });
  bodyGeo.center();

  const rimGeo = new THREE.TorusGeometry(outerRadius - 0.03, 0.055, 16, 42);
  return { bodyGeo, rimGeo };
}

/**
 * Builds a Lathe profile geometry for a Snap/Popper concentric closure.
 */
function createSnapPopperGeometry() {
  const points = [
    new THREE.Vector2(0.14, -0.06),
    new THREE.Vector2(0.24, -0.06),
    new THREE.Vector2(0.24, 0.09),
    new THREE.Vector2(0.36, 0.09),
    new THREE.Vector2(0.52, 0.04),
    new THREE.Vector2(0.56, -0.04),
    new THREE.Vector2(0.14, -0.06),
  ];
  return new THREE.LatheGeometry(points, 36);
}

/**
 * Builds a sculpted Toggle barrel geometry using LatheGeometry.
 */
function createToggleGeometry() {
  const points = [
    new THREE.Vector2(0.01, -0.68),
    new THREE.Vector2(0.13, -0.64),
    new THREE.Vector2(0.19, -0.32),
    new THREE.Vector2(0.22, 0.0),
    new THREE.Vector2(0.19, 0.32),
    new THREE.Vector2(0.13, 0.64),
    new THREE.Vector2(0.01, 0.68),
  ];
  return new THREE.LatheGeometry(points, 28);
}

export function Button3D({
  scrollProgressRef,
  isMobile,
}: ButtonShowcase3DProps) {
  const stageRef = useRef<THREE.Group>(null);
  const btn1Ref = useRef<THREE.Group>(null);
  const btn2Ref = useRef<THREE.Group>(null);
  const btn3Ref = useRef<THREE.Group>(null);
  const btn4Ref = useRef<THREE.Group>(null);
  const btn5Ref = useRef<THREE.Group>(null);

  const resources = useMemo(() => {
    const { bodyGeo: flatBodyGeo, rimGeo: flatRimGeo } =
      createFlatFourHoleGeometry();

    const shankCapGeo = new THREE.CylinderGeometry(0.46, 0.42, 0.16, 36);
    const shankLoopGeo = new THREE.TorusGeometry(0.13, 0.032, 12, 24);

    const snapGeo = createSnapPopperGeometry();
    const toggleGeo = createToggleGeometry();
    const toggleBandGeo = new THREE.TorusGeometry(0.215, 0.022, 10, 28);

    const metalStudCapGeo = new THREE.CylinderGeometry(0.5, 0.48, 0.13, 36);
    const metalStudInnerGeo = new THREE.TorusGeometry(0.32, 0.04, 14, 32);

    // 4 Required MeshPhysicalMaterial variants: horn/wood tone, pearl, brushed metal, matte plastic
    const hornMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#6B4C35"),
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
    });

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F2EFE6"),
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      iridescence: 0.6,
      iridescenceIOR: 1.3,
    });

    const brushedMetalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#C8BA9A"),
      metalness: 0.9,
      roughness: 0.24,
      clearcoat: 0.25,
    });

    const mattePlasticMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#18758E"),
      roughness: 0.52,
      metalness: 0.05,
      clearcoat: 0.25,
    });

    const darkMetalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#4A4E4C"),
      metalness: 0.85,
      roughness: 0.28,
    });

    return {
      flatBodyGeo,
      flatRimGeo,
      shankCapGeo,
      shankLoopGeo,
      snapGeo,
      toggleGeo,
      toggleBandGeo,
      metalStudCapGeo,
      metalStudInnerGeo,
      hornMaterial,
      pearlMaterial,
      brushedMetalMaterial,
      mattePlasticMaterial,
      darkMetalMaterial,
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(resources).forEach((item) => {
        item.dispose();
      });
    };
  }, [resources]);

  useFrame((state, delta) => {
    const stage = stageRef.current;
    if (!stage) return;

    const progress = scrollProgressRef.current;

    // Visible during Button Showcase window (0.20 .. 0.75)
    if (progress < 0.18 || progress > 0.78) {
      stage.visible = false;
      return;
    }
    stage.visible = true;

    // Normalized showcase progress (0 at start of section -> 1 at exit)
    const localProgress = THREE.MathUtils.clamp(
      (progress - 0.22) / 0.45,
      0,
      1
    );

    // Smooth vertical scroll-linked drift + pointer parallax
    const targetY = THREE.MathUtils.lerp(-1.6, 1.5, localProgress);
    stage.position.y = THREE.MathUtils.damp(stage.position.y, targetY, 5, delta);

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    stage.rotation.y = THREE.MathUtils.damp(
      stage.rotation.y,
      pointerX * 0.22,
      4,
      delta
    );
    stage.rotation.x = THREE.MathUtils.damp(
      stage.rotation.x,
      -pointerY * 0.14,
      4,
      delta
    );

    // Individual slow button rotations
    const rotSpeed = delta * 0.45;
    if (btn1Ref.current) {
      btn1Ref.current.rotation.y += rotSpeed;
      btn1Ref.current.rotation.x += rotSpeed * 0.4;
    }
    if (btn2Ref.current) {
      btn2Ref.current.rotation.y -= rotSpeed * 0.8;
      btn2Ref.current.rotation.z += rotSpeed * 0.35;
    }
    if (btn3Ref.current) {
      btn3Ref.current.rotation.x += rotSpeed * 0.7;
      btn3Ref.current.rotation.y += rotSpeed * 0.5;
    }
    if (btn4Ref.current) {
      btn4Ref.current.rotation.z -= rotSpeed * 0.6;
      btn4Ref.current.rotation.y += rotSpeed * 0.4;
    }
    if (btn5Ref.current) {
      btn5Ref.current.rotation.y += rotSpeed * 0.9;
      btn5Ref.current.rotation.x -= rotSpeed * 0.5;
    }
  });

  return (
    <group ref={stageRef} visible={false}>
      {/* 1. Flat 4-Hole Button (Horn/Wood Tone) */}
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
        <group
          ref={btn1Ref}
          position={isMobile ? [0.6, 0.8, 0.2] : [1.35, 0.85, 0.4]}
          rotation={[0.35, -0.4, 0.15]}
          scale={isMobile ? 0.85 : 1.08}
        >
          <mesh
            geometry={resources.flatBodyGeo}
            material={resources.hornMaterial}
          />
          <mesh
            geometry={resources.flatRimGeo}
            material={resources.hornMaterial}
            position={[0, 0, 0.04]}
          />
        </group>
      </Float>

      {/* 2. Shank Button (Iridescent Pearl + Brushed Metal Shank Loop) */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
        <group
          ref={btn2Ref}
          position={isMobile ? [-0.65, -0.15, -0.1] : [0.15, -0.45, 0.2]}
          rotation={[0.8, 0.3, -0.25]}
          scale={isMobile ? 0.8 : 1.0}
        >
          <mesh
            geometry={resources.shankCapGeo}
            material={resources.pearlMaterial}
          />
          <mesh
            geometry={resources.shankLoopGeo}
            material={resources.brushedMetalMaterial}
            position={[0, -0.14, 0]}
          />
        </group>
      </Float>

      {/* 3. Snap / Popper Button (Brushed Metal Lathe Geometry) */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.45}>
        <group
          ref={btn3Ref}
          position={isMobile ? [0.45, -1.1, 0.0] : [2.15, -0.65, -0.15]}
          rotation={[1.1, -0.2, 0.4]}
          scale={isMobile ? 0.82 : 1.02}
        >
          <mesh
            geometry={resources.snapGeo}
            material={resources.brushedMetalMaterial}
          />
        </group>
      </Float>

      {/* Desktop-only additional buttons (reduced count on mobile for GPU performance) */}
      {!isMobile && (
        <>
          {/* 4. Toggle Button (Matte Forest Plastic + Brass Cord Rings) */}
          <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.5}>
            <group
              ref={btn4Ref}
              position={[-1.45, 0.95, -0.3]}
              rotation={[0.4, 0.5, -0.6]}
              scale={0.95}
            >
              <mesh
                geometry={resources.toggleGeo}
                material={resources.mattePlasticMaterial}
              />
              <mesh
                geometry={resources.toggleBandGeo}
                material={resources.brushedMetalMaterial}
                position={[0, 0.14, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={resources.toggleBandGeo}
                material={resources.brushedMetalMaterial}
                position={[0, -0.14, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              />
            </group>
          </Float>

          {/* 5. Metal Stud / Rivet Button (Dark Gunmetal + Brushed Brass Ring) */}
          <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.45}>
            <group
              ref={btn5Ref}
              position={[-0.95, -1.05, -0.2]}
              rotation={[0.95, -0.35, 0.2]}
              scale={0.95}
            >
              <mesh
                geometry={resources.metalStudCapGeo}
                material={resources.darkMetalMaterial}
              />
              <mesh
                geometry={resources.metalStudInnerGeo}
                material={resources.brushedMetalMaterial}
                position={[0, 0.07, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              />
            </group>
          </Float>
        </>
      )}
    </group>
  );
}
