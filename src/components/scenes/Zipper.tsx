"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ZipperProps {
  scrollProgressRef: React.MutableRefObject<number>;
  isMobile: boolean;
  isDark?: boolean;
}

const dummy = new THREE.Object3D();

/**
 * Computes the horizontal separation (peel distance) and outward angle
 * for a point at `y` given the current `sliderY` position.
 */
function computePeelState(y: number, sliderY: number) {
  const diff = y - sliderY;
  if (diff <= 0) {
    return { offset: 0, angle: 0, zArch: 0 };
  }
  const normalized = Math.min(diff / 3.8, 1.4);
  const smoothCurve = Math.pow(normalized, 1.45);
  const offset = smoothCurve * 1.65;
  const angle = Math.min(normalized * 0.52, 0.58);
  const zArch = Math.sin(Math.min(normalized, 1) * Math.PI) * 0.16;
  return { offset, angle, zArch };
}

export function Zipper({ scrollProgressRef, isMobile, isDark = false }: ZipperProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const teethMeshRef = useRef<THREE.InstancedMesh>(null);
  const sliderGroupRef = useRef<THREE.Group>(null);
  const pullerTabRef = useRef<THREE.Group>(null);
  const leftTapeRef = useRef<THREE.Mesh>(null);
  const rightTapeRef = useRef<THREE.Mesh>(null);

  const pairsCount = isMobile ? 28 : 44;
  const totalTeeth = pairsCount * 2;
  const zipperHeight = 6.2;
  const tapeWidth = 0.72;
  const heightSegments = isMobile ? 32 : 48;

  const {
    toothGeometry,
    metalMaterial,
    brassAccentMaterial,
    tapeMaterial,
    leftTapeGeometry,
    rightTapeGeometry,
    sliderBodyGeo,
    sliderCrownGeo,
    pullerRingGeo,
    pullerTabGeo,
  } = useMemo(() => {
    const toothGeo = new THREE.BoxGeometry(0.14, 0.055, 0.065);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#DCE4E8"),
      metalness: 0.88,
      roughness: 0.2,
      clearcoat: 0.35,
    });

    const brassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#36A3C2"),
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.4,
    });

    const tapeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#156B82"),
      roughness: 0.78,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const leftTapeGeo = new THREE.PlaneGeometry(
      tapeWidth,
      zipperHeight,
      3,
      heightSegments
    );
    const rightTapeGeo = new THREE.PlaneGeometry(
      tapeWidth,
      zipperHeight,
      3,
      heightSegments
    );

    const sBodyGeo = new THREE.BoxGeometry(0.38, 0.48, 0.18);
    const sCrownGeo = new THREE.BoxGeometry(0.14, 0.34, 0.24);
    const pRingGeo = new THREE.TorusGeometry(0.08, 0.022, 12, 24);

    // Sculpted puller tab with center cutout using ExtrudeGeometry
    const pullerShape = new THREE.Shape();
    const pw = 0.15;
    const ph = 0.56;
    pullerShape.moveTo(-pw, 0);
    pullerShape.lineTo(pw, 0);
    pullerShape.lineTo(pw * 0.88, -ph);
    pullerShape.lineTo(-pw * 0.88, -ph);
    pullerShape.closePath();

    const slotHole = new THREE.Path();
    slotHole.moveTo(-0.055, -0.14);
    slotHole.lineTo(0.055, -0.14);
    slotHole.lineTo(0.055, -0.42);
    slotHole.lineTo(-0.055, -0.42);
    slotHole.closePath();
    pullerShape.holes.push(slotHole);

    const pTabGeo = new THREE.ExtrudeGeometry(pullerShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });

    return {
      toothGeometry: toothGeo,
      metalMaterial: metalMat,
      brassAccentMaterial: brassMat,
      tapeMaterial: tapeMat,
      leftTapeGeometry: leftTapeGeo,
      rightTapeGeometry: rightTapeGeo,
      sliderBodyGeo: sBodyGeo,
      sliderCrownGeo: sCrownGeo,
      pullerRingGeo: pRingGeo,
      pullerTabGeo: pTabGeo,
    };
  }, [heightSegments, tapeWidth, zipperHeight]);

  // Store original un-deformed X coordinates for both fabric tape geometries
  const leftBaseX = useMemo(() => {
    const pos = leftTapeGeometry.attributes.position;
    const arr = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      arr[i] = pos.getX(i);
    }
    return arr;
  }, [leftTapeGeometry]);

  const rightBaseX = useMemo(() => {
    const pos = rightTapeGeometry.attributes.position;
    const arr = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      arr[i] = pos.getX(i);
    }
    return arr;
  }, [rightTapeGeometry]);

  // Clean up all GPU resources on unmount
  useEffect(() => {
    return () => {
      toothGeometry.dispose();
      metalMaterial.dispose();
      brassAccentMaterial.dispose();
      tapeMaterial.dispose();
      leftTapeGeometry.dispose();
      rightTapeGeometry.dispose();
      sliderBodyGeo.dispose();
      sliderCrownGeo.dispose();
      pullerRingGeo.dispose();
      pullerTabGeo.dispose();
    };
  }, [
    toothGeometry,
    metalMaterial,
    brassAccentMaterial,
    tapeMaterial,
    leftTapeGeometry,
    rightTapeGeometry,
    sliderBodyGeo,
    sliderCrownGeo,
    pullerRingGeo,
    pullerTabGeo,
  ]);

  const smoothedUnzipRef = useRef(0.06);
  const prevSliderYRef = useRef(2.4);

  useFrame((state, delta) => {
    const group = rootGroupRef.current;
    const teethMesh = teethMeshRef.current;
    const sliderGroup = sliderGroupRef.current;
    const pullerTab = pullerTabRef.current;
    if (!group || !teethMesh || !sliderGroup || !pullerTab) return;

    const progress = scrollProgressRef.current;

    // Visibility window: Zipper is active during Hero + Unzip Reveal (0.0 -> 0.46)
    if (progress > 0.5) {
      group.visible = false;
      return;
    }
    group.visible = true;

    // Map scroll progress [0..0.34] -> unzip progress [0.06..1.0]
    const targetUnzip = THREE.MathUtils.clamp(
      0.06 + (progress / 0.34) * 0.94,
      0.06,
      1.0
    );

    smoothedUnzipRef.current = THREE.MathUtils.damp(
      smoothedUnzipRef.current,
      targetUnzip,
      7,
      delta
    );

    const topY = zipperHeight / 2;
    const bottomY = -zipperHeight / 2;
    const sliderY = THREE.MathUtils.lerp(
      topY - 0.35,
      bottomY + 0.25,
      smoothedUnzipRef.current
    );

    // Subtle pointer tilt and smooth exit transition when entering Button Showcase
    const exitProgress = THREE.MathUtils.clamp(
      (progress - 0.3) / 0.16,
      0,
      1
    );

    tapeMaterial.color.set(isDark ? "#1B7A94" : "#156B82");

    const baseX = isMobile ? 0.0 : 1.05;
    group.scale.setScalar(isMobile ? 0.86 : 1.0);
    group.position.x = THREE.MathUtils.lerp(baseX, baseX + (isMobile ? 0 : 0.5), exitProgress);
    group.position.y = exitProgress * 2.2;
    group.position.z = -exitProgress * 1.8;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      -0.18 + pointerX * 0.12,
      4,
      delta
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      pointerY * 0.06,
      4,
      delta
    );

    // Update Slider & Puller transform
    sliderGroup.position.set(0, sliderY, 0.05);
    const velocity = (sliderY - prevSliderYRef.current) / Math.max(delta, 0.001);
    prevSliderYRef.current = sliderY;

    pullerTab.rotation.x = THREE.MathUtils.damp(
      pullerTab.rotation.x,
      0.18 + THREE.MathUtils.clamp(-velocity * 0.04, -0.25, 0.35),
      8,
      delta
    );
    pullerTab.rotation.z = THREE.MathUtils.damp(
      pullerTab.rotation.z,
      Math.sin(state.clock.elapsedTime * 1.6) * 0.04,
      4,
      delta
    );

    // Update all zipper teeth in ONE InstancedMesh draw call
    const stepY = zipperHeight / pairsCount;
    for (let i = 0; i < pairsCount; i++) {
      const pairBaseY = bottomY + i * stepY + stepY * 0.5;

      // Left tooth
      const leftY = pairBaseY;
      const leftPeel = computePeelState(leftY, sliderY);
      dummy.position.set(
        -0.045 - leftPeel.offset,
        leftY,
        leftPeel.zArch
      );
      dummy.rotation.set(0, leftPeel.angle * 0.35, leftPeel.angle);
      dummy.updateMatrix();
      teethMesh.setMatrixAt(i * 2, dummy.matrix);

      // Right tooth (staggered vertically by half a pitch for authentic interlocking)
      const rightY = pairBaseY + stepY * 0.5;
      const rightPeel = computePeelState(rightY, sliderY);
      dummy.position.set(
        0.045 + rightPeel.offset,
        rightY,
        rightPeel.zArch
      );
      dummy.rotation.set(0, -rightPeel.angle * 0.35, -rightPeel.angle);
      dummy.updateMatrix();
      teethMesh.setMatrixAt(i * 2 + 1, dummy.matrix);
    }
    teethMesh.instanceMatrix.needsUpdate = true;

    // Deform Left & Right Fabric Tape vertices to peel apart smoothly with teeth
    const leftPos = leftTapeGeometry.attributes.position;
    const rightPos = rightTapeGeometry.attributes.position;

    for (let i = 0; i < leftPos.count; i++) {
      const vy = leftPos.getY(i);
      const { offset, angle, zArch } = computePeelState(vy, sliderY);

      // Left tape inner edge sits near x = -0.09
      const lx = leftBaseX[i] - tapeWidth * 0.5 - 0.08;
      const rotatedLx = lx * Math.cos(angle) - offset;
      leftPos.setX(i, rotatedLx);
      leftPos.setZ(i, zArch - 0.02 + Math.abs(lx) * Math.sin(angle) * 0.18);

      // Right tape inner edge sits near x = +0.09
      const rx = rightBaseX[i] + tapeWidth * 0.5 + 0.08;
      const rotatedRx = rx * Math.cos(angle) + offset;
      rightPos.setX(i, rotatedRx);
      rightPos.setZ(i, zArch - 0.02 + Math.abs(rx) * Math.sin(angle) * 0.18);
    }

    leftPos.needsUpdate = true;
    rightPos.needsUpdate = true;
  });

  return (
    <group ref={rootGroupRef} position={[1.05, 0, 0]}>
      {/* Left & Right Deformed Woven Fabric Tapes */}
      <mesh
        ref={leftTapeRef}
        geometry={leftTapeGeometry}
        material={tapeMaterial}
      />
      <mesh
        ref={rightTapeRef}
        geometry={rightTapeGeometry}
        material={tapeMaterial}
      />

      {/* Instanced Zipper Teeth (1 draw call for all left + right teeth) */}
      <instancedMesh
        ref={teethMeshRef}
        args={[toothGeometry, metalMaterial, totalTeeth]}
        frustumCulled={false}
      />

      {/* Separate Slider + Hinged Puller Assembly */}
      <group ref={sliderGroupRef}>
        <mesh geometry={sliderBodyGeo} material={brassAccentMaterial} />
        <mesh
          geometry={sliderCrownGeo}
          material={metalMaterial}
          position={[0, 0.02, 0.1]}
        />
        <mesh
          geometry={pullerRingGeo}
          material={brassAccentMaterial}
          position={[0, -0.05, 0.2]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <group ref={pullerTabRef} position={[0, -0.1, 0.22]}>
          <mesh geometry={pullerTabGeo} material={brassAccentMaterial} />
        </group>
      </group>
    </group>
  );
}
