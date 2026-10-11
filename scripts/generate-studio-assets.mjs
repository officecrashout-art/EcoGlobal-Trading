import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT_DIR = process.cwd();
const IMAGES_DIR = path.join(ROOT_DIR, "public", "assets", "images");
const MODELS_DIR = path.join(ROOT_DIR, "public", "assets", "3d");
const PORT = 4389;

fs.mkdirSync(IMAGES_DIR, { recursive: true });
fs.mkdirSync(MODELS_DIR, { recursive: true });

const HTML_PAGE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Eco Global 3D & Studio Asset Generator</title>
  <script type="importmap">
    {
      "imports": {
        "three": "/node_modules/three/build/three.module.js",
        "three/addons/": "/node_modules/three/examples/jsm/"
      }
    }
  </script>
</head>
<body style="margin:0;background:#071118;color:#fff;font-family:monospace;">
  <div id="status">Initializing generator...</div>
  <script type="module">
    import * as THREE from "three";
    import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
    import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
    import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

    const statusEl = document.getElementById("status");
    const log = (msg) => {
      statusEl.textContent = msg;
      console.log(msg);
    };

    const WIDTH = 960;
    const HEIGHT = 720;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    function makeCanvasTexture(drawFn, width = 512, height = 512) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      drawFn(ctx, width, height);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    // 1. Woven Label Texture (Only verified brand & sub-item names)
    const wovenLabelTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#0D2430";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(90, 197, 229, 0.09)";
      ctx.lineWidth = 2;
      for (let y = 0; y < h; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(24, 24, w - 48, h - 48);
      ctx.setLineDash([]);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.strokeRect(48, 56, w - 96, h - 112);
      ctx.fillStyle = "#F0F7FA";
      ctx.font = "bold 44px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("ECO GLOBAL BD", w / 2, h / 2 - 10);
      ctx.fillStyle = "#5AC5E5";
      ctx.font = "600 19px monospace";
      ctx.fillText("TEXTILE & ACCESSORIES SOLUTION", w / 2, h / 2 + 30);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "500 16px monospace";
      ctx.fillText("WOVEN • PRINTED • BADGE • CARE", w / 2, h / 2 + 66);
    }, 512, 320);

    // Badge Label Texture
    const badgeLabelTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#112C3A";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 5;
      ctx.strokeRect(18, 18, w - 36, h - 36);
      ctx.fillStyle = "#F0F7FA";
      ctx.font = "bold 36px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("EG • BADGE LABEL", w / 2, h / 2 + 4);
      ctx.fillStyle = "#5AC5E5";
      ctx.font = "18px monospace";
      ctx.fillText("UTTARA, DHAKA 1230", w / 2, h / 2 + 42);
    }, 420, 240);

    // Care Label Texture
    const careLabelTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("CARE LABEL", 36, 64);
      ctx.fillStyle = "#167186";
      ctx.fillRect(36, 82, w - 72, 4);
      ctx.fillStyle = "#334155";
      ctx.font = "20px monospace";
      ctx.fillText("WOVEN LABEL", 36, 130);
      ctx.fillText("PRINTED WOVEN LABEL", 36, 166);
      ctx.fillText("BADGE & CARE LABEL", 36, 202);
      ctx.strokeStyle = "#0F172A";
      ctx.lineWidth = 4;
      const ySym = 260;
      ctx.strokeRect(40, ySym, 44, 30);
      ctx.beginPath();
      ctx.moveTo(125, ySym + 30);
      ctx.lineTo(147, ySym);
      ctx.lineTo(169, ySym + 30);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(205, ySym, 34, 34);
      ctx.beginPath();
      ctx.arc(222, ySym + 17, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(290, ySym + 17, 17, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#0F172A";
      for (let x = 36; x < w - 50; x += 9) {
        const bw = (x % 18 === 0) ? 5 : 2;
        ctx.fillRect(x, 336, bw, 56);
      }
      ctx.font = "18px monospace";
      ctx.fillText("ECO GLOBAL BD • DHAKA", 36, 426);
    }, 384, 480);

    // Sticker Texture
    const stickerTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#167186";
      ctx.lineWidth = 8;
      ctx.strokeRect(18, 18, w - 36, h - 36);
      ctx.fillStyle = "#167186";
      ctx.fillRect(18, 18, w - 36, 86);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("ECO GLOBAL BD • STICKERS", 38, 72);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 25px monospace";
      ctx.fillText("GARMENT & PACKAGING", 42, 156);
      ctx.fillText("ADHESIVE TRIM SYSTEM", 42, 198);
      ctx.fillText("SECTOR 11, UTTARA, DHAKA", 42, 240);
      for (let x = 42; x < w - 48; x += 8) {
        const bw = ((x * 7) % 16 < 7) ? 5 : 2;
        ctx.fillRect(x, 280, bw, 90);
      }
      ctx.font = "20px monospace";
      ctx.fillStyle = "#475569";
      ctx.fillText("WHATSAPP: 01714011220", 110, 405);
    }, 512, 440);

    // Carton Texture
    const cartonTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#BA8B57";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(80, 50, 20, 0.06)";
      for (let i = 0; i < 600; i++) {
        ctx.fillRect((i * 73) % w, (i * 41) % h, 18, 2);
      }
      ctx.strokeStyle = "#1E293B";
      ctx.lineWidth = 6;
      ctx.strokeRect(32, 32, w - 64, h - 64);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText("ECO GLOBAL BD", 58, 105);
      ctx.font = "600 22px monospace";
      ctx.fillStyle = "#167186";
      ctx.fillText("CARTONS • AUTO & SEMI-AUTO", 58, 148);
      ctx.fillStyle = "#1E293B";
      ctx.font = "21px monospace";
      ctx.fillText("CATEGORY : 08 / CARTONS", 58, 212);
      ctx.fillText("TYPES    : AUTO / SEMI-AUTO", 58, 250);
      ctx.fillText("ADDRESS  : SECTOR 11, UTTARA", 58, 288);
      ctx.fillText("LOCATION : DHAKA 1230", 58, 326);
      ctx.strokeRect(w - 190, h - 130, 60, 60);
      ctx.strokeRect(w - 115, h - 130, 60, 60);
      ctx.beginPath();
      ctx.moveTo(w - 160, h - 78);
      ctx.lineTo(w - 160, h - 118);
      ctx.moveTo(w - 172, h - 104);
      ctx.lineTo(w - 160, h - 118);
      ctx.lineTo(w - 148, h - 104);
      ctx.stroke();
    }, 512, 440);

    // Desiccant Texture
    const desiccantTex = makeCanvasTexture((ctx, w, h) => {
      ctx.fillStyle = "#F1F5F9";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#94A3B8";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(18, 24, w - 36, h - 48);
      ctx.setLineDash([]);
      ctx.fillStyle = "#167186";
      ctx.fillRect(42, 64, w - 84, 58);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DESICCANT ITEMS", w / 2, 102);
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText("SILICA GEL", w / 2, 182);
      ctx.fillStyle = "#475569";
      ctx.font = "21px monospace";
      ctx.fillText("MICROPAK (POLY • DRI CLAY)", w / 2, 232);
      ctx.fillText("SUPERDRY PROTECTION", w / 2, 268);
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 19px monospace";
      ctx.fillText("ECO GLOBAL BD • DHAKA", w / 2, 322);
    }, 440, 380);

    // Pearl Button Concentric Sheen Texture
    const pearlButtonTex = makeCanvasTexture((ctx, w, h) => {
      const grad = ctx.createRadialGradient(w * 0.42, h * 0.38, 12, w * 0.5, h * 0.5, w * 0.48);
      grad.addColorStop(0, "#FAF8F2");
      grad.addColorStop(0.5, "#E2DDD0");
      grad.addColorStop(0.82, "#C7C0B0");
      grad.addColorStop(1, "#9B9382");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(22, 113, 134, 0.35)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w * 0.36, 0, Math.PI * 2);
      ctx.stroke();
    }, 256, 256);

    function createCategoryModel(slug) {
      const group = new THREE.Group();
      group.name = slug;

      const tealMat = new THREE.MeshPhysicalMaterial({
        color: 0x167186,
        roughness: 0.36,
        metalness: 0.14,
        clearcoat: 0.38,
      });
      const cyanMat = new THREE.MeshPhysicalMaterial({
        color: 0x5AC5E5,
        roughness: 0.28,
        metalness: 0.25,
        clearcoat: 0.45,
      });
      const darkNavyMat = new THREE.MeshPhysicalMaterial({
        color: 0x0F2532,
        roughness: 0.5,
        metalness: 0.1,
      });
      const brassMat = new THREE.MeshPhysicalMaterial({
        color: 0xD49B4B,
        roughness: 0.22,
        metalness: 0.88,
        clearcoat: 0.35,
      });
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0xDCE4E8,
        roughness: 0.18,
        metalness: 0.92,
        clearcoat: 0.4,
      });
      const leatherMat = new THREE.MeshPhysicalMaterial({
        color: 0x7C4728,
        roughness: 0.44,
        metalness: 0.04,
        clearcoat: 0.25,
      });
      const creamMat = new THREE.MeshPhysicalMaterial({
        color: 0xEAE4D7,
        roughness: 0.32,
        metalness: 0.08,
        clearcoat: 0.45,
      });

      switch (slug) {
        case "labels": {
          const wovenMesh = new THREE.Mesh(
            new RoundedBoxGeometry(2.3, 1.35, 0.07, 4, 0.03),
            new THREE.MeshPhysicalMaterial({
              map: wovenLabelTex,
              roughness: 0.58,
              metalness: 0.08,
            })
          );
          wovenMesh.position.set(-0.35, 0.25, 0.18);
          wovenMesh.rotation.set(-0.12, 0.18, 0.04);
          group.add(wovenMesh);

          const leftFold = new THREE.Mesh(
            new RoundedBoxGeometry(0.18, 1.35, 0.09, 3, 0.02),
            tealMat
          );
          leftFold.position.set(-1.12, 0, -0.02);
          wovenMesh.add(leftFold);
          const rightFold = leftFold.clone();
          rightFold.position.set(1.12, 0, -0.02);
          wovenMesh.add(rightFold);

          const careMesh = new THREE.Mesh(
            new RoundedBoxGeometry(1.15, 1.65, 0.04, 4, 0.015),
            new THREE.MeshPhysicalMaterial({
              map: careLabelTex,
              roughness: 0.25,
              metalness: 0.05,
              clearcoat: 0.6,
            })
          );
          careMesh.position.set(0.95, -0.18, -0.1);
          careMesh.rotation.set(0.08, -0.28, -0.12);
          group.add(careMesh);

          const badgeFrame = new THREE.Mesh(
            new RoundedBoxGeometry(1.34, 0.74, 0.09, 4, 0.04),
            brassMat
          );
          badgeFrame.position.set(-0.55, -0.78, 0.42);
          badgeFrame.rotation.set(-0.25, 0.12, -0.06);
          const badgeInner = new THREE.Mesh(
            new RoundedBoxGeometry(1.2, 0.6, 0.11, 4, 0.03),
            new THREE.MeshPhysicalMaterial({ map: badgeLabelTex, roughness: 0.45 })
          );
          badgeFrame.add(badgeInner);
          group.add(badgeFrame);
          break;
        }

        case "stickers": {
          const liner = new THREE.Mesh(
            new RoundedBoxGeometry(2.5, 1.85, 0.05, 4, 0.02),
            new THREE.MeshPhysicalMaterial({ color: 0xCBD5E1, roughness: 0.35 })
          );
          liner.rotation.set(-0.22, 0.2, 0.05);
          group.add(liner);

          const mainSticker = new THREE.Mesh(
            new RoundedBoxGeometry(1.75, 1.35, 0.045, 4, 0.02),
            new THREE.MeshPhysicalMaterial({
              map: stickerTex,
              roughness: 0.18,
              clearcoat: 0.75,
            })
          );
          mainSticker.position.set(-0.22, 0.08, 0.05);
          liner.add(mainSticker);

          const sizeStrip = new THREE.Mesh(
            new RoundedBoxGeometry(0.42, 1.65, 0.06, 4, 0.02),
            tealMat
          );
          sizeStrip.position.set(1.05, -0.05, 0.25);
          sizeStrip.rotation.set(-0.1, -0.25, -0.15);
          group.add(sizeStrip);

          const sealDisk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.48, 0.48, 0.06, 40),
            brassMat
          );
          sealDisk.rotation.x = Math.PI / 2 - 0.2;
          sealDisk.position.set(-0.95, -0.68, 0.42);
          const sealInner = new THREE.Mesh(
            new THREE.CylinderGeometry(0.36, 0.36, 0.07, 40),
            tealMat
          );
          sealDisk.add(sealInner);
          group.add(sealDisk);
          break;
        }

        case "heat-transfer": {
          const fabricBase = new THREE.Mesh(
            new RoundedBoxGeometry(2.6, 1.85, 0.1, 4, 0.04),
            darkNavyMat
          );
          fabricBase.rotation.set(-0.28, 0.22, 0.04);
          group.add(fabricBase);

          const transferRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.42, 0.065, 16, 48),
            cyanMat
          );
          transferRing.position.set(-0.35, 0.12, 0.07);
          fabricBase.add(transferRing);

          const transferBar1 = new THREE.Mesh(
            new RoundedBoxGeometry(1.1, 0.16, 0.05, 3, 0.02),
            creamMat
          );
          transferBar1.position.set(0.48, 0.24, 0.07);
          fabricBase.add(transferBar1);

          const transferBar2 = new THREE.Mesh(
            new RoundedBoxGeometry(0.85, 0.12, 0.05, 3, 0.02),
            brassMat
          );
          transferBar2.position.set(0.36, -0.04, 0.07);
          fabricBase.add(transferBar2);

          const carrierFilm = new THREE.Mesh(
            new RoundedBoxGeometry(2.3, 1.5, 0.025, 4, 0.01),
            new THREE.MeshPhysicalMaterial({
              color: 0xBAE6FD,
              transparent: true,
              opacity: 0.45,
              roughness: 0.15,
              metalness: 0.1,
              clearcoat: 0.9,
            })
          );
          carrierFilm.position.set(0.15, 0.25, 0.42);
          carrierFilm.rotation.set(-0.48, 0.32, -0.08);
          group.add(carrierFilm);
          break;
        }

        case "offset-paper-items": {
          const tag1 = new THREE.Mesh(
            new RoundedBoxGeometry(1.35, 2.15, 0.08, 4, 0.03),
            darkNavyMat
          );
          tag1.position.set(-0.45, 0.05, 0.15);
          tag1.rotation.set(-0.12, 0.25, 0.08);
          group.add(tag1);

          const tag1Card = new THREE.Mesh(
            new RoundedBoxGeometry(1.1, 1.55, 0.09, 4, 0.02),
            new THREE.MeshPhysicalMaterial({ map: wovenLabelTex, roughness: 0.45 })
          );
          tag1Card.position.set(0, -0.12, 0);
          tag1.add(tag1Card);

          const eyelet = new THREE.Mesh(
            new THREE.TorusGeometry(0.11, 0.035, 16, 32),
            brassMat
          );
          eyelet.position.set(0, 0.84, 0.04);
          tag1.add(eyelet);

          const tag2 = new THREE.Mesh(
            new RoundedBoxGeometry(1.25, 1.9, 0.07, 4, 0.03),
            new THREE.MeshPhysicalMaterial({ map: careLabelTex, roughness: 0.4 })
          );
          tag2.position.set(0.65, -0.12, -0.12);
          tag2.rotation.set(0.08, -0.22, -0.14);
          group.add(tag2);
          break;
        }

        case "patches": {
          const leatherPatch = new THREE.Mesh(
            new RoundedBoxGeometry(2.1, 1.15, 0.14, 4, 0.05),
            leatherMat
          );
          leatherPatch.position.set(-0.3, 0.38, -0.05);
          leatherPatch.rotation.set(-0.18, 0.22, 0.06);
          const leatherPlate = new THREE.Mesh(
            new RoundedBoxGeometry(1.75, 0.82, 0.16, 4, 0.03),
            new THREE.MeshPhysicalMaterial({ map: badgeLabelTex, roughness: 0.4 })
          );
          leatherPatch.add(leatherPlate);
          group.add(leatherPatch);

          const rubberPatch = new THREE.Mesh(
            new RoundedBoxGeometry(1.55, 1.05, 0.16, 5, 0.06),
            darkNavyMat
          );
          rubberPatch.position.set(0.62, -0.32, 0.28);
          rubberPatch.rotation.set(0.12, -0.28, -0.08);
          const rubberLogoRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.32, 0.06, 16, 36),
            cyanMat
          );
          rubberLogoRing.position.set(0, 0, 0.08);
          rubberPatch.add(rubberLogoRing);
          group.add(rubberPatch);

          const siliconePatch = new THREE.Mesh(
            new RoundedBoxGeometry(1.25, 0.58, 0.14, 5, 0.06),
            tealMat
          );
          siliconePatch.position.set(-0.68, -0.58, 0.38);
          siliconePatch.rotation.set(-0.24, 0.15, -0.12);
          const siliconeBar = new THREE.Mesh(
            new RoundedBoxGeometry(0.85, 0.18, 0.16, 3, 0.03),
            brassMat
          );
          siliconePatch.add(siliconeBar);
          group.add(siliconePatch);
          break;
        }

        case "narrow-fabrics": {
          const elasticOuter = new THREE.Mesh(
            new THREE.CylinderGeometry(0.92, 0.92, 0.75, 48),
            tealMat
          );
          elasticOuter.rotation.set(0.35, 0.4, Math.PI / 2 - 0.2);
          elasticOuter.position.set(-0.45, 0.15, 0);
          const elasticCore = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 0.78, 36),
            creamMat
          );
          elasticOuter.add(elasticCore);
          const elasticStripe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.93, 0.93, 0.22, 48),
            brassMat
          );
          elasticOuter.add(elasticStripe);
          group.add(elasticOuter);

          const twillRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.68, 0.68, 0.48, 42),
            darkNavyMat
          );
          twillRoll.position.set(0.78, -0.25, 0.28);
          twillRoll.rotation.set(0.4, -0.3, 0.25);
          const twillCore = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.51, 32),
            brassMat
          );
          twillRoll.add(twillCore);
          group.add(twillRoll);

          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.1, -0.75, 0.45),
            new THREE.Vector3(-0.2, -0.55, 0.65),
            new THREE.Vector3(0.55, 0.55, 0.45),
            new THREE.Vector3(1.15, 0.35, 0.2),
          ]);
          const cordGeo = new THREE.TubeGeometry(curve, 40, 0.075, 16, false);
          const cordMesh = new THREE.Mesh(cordGeo, cyanMat);
          group.add(cordMesh);

          const aglet = new THREE.Mesh(
            new THREE.CylinderGeometry(0.085, 0.085, 0.32, 20),
            chromeMat
          );
          aglet.position.set(-1.1, -0.75, 0.45);
          aglet.rotation.z = 1.25;
          group.add(aglet);
          break;
        }

        case "gum-tape": {
          const kraftMat = new THREE.MeshPhysicalMaterial({
            color: 0xC29562,
            roughness: 0.65,
            metalness: 0.04,
          });
          const mainRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(1.05, 1.05, 0.72, 48),
            kraftMat
          );
          mainRoll.position.set(-0.35, 0.1, 0);
          mainRoll.rotation.set(0.45, 0.35, 0.2);

          const innerCore = new THREE.Mesh(
            new THREE.CylinderGeometry(0.52, 0.52, 0.75, 40),
            tealMat
          );
          mainRoll.add(innerCore);

          const innerHole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.44, 0.44, 0.78, 40),
            darkNavyMat
          );
          mainRoll.add(innerHole);
          group.add(mainRoll);

          const secondRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.78, 0.78, 0.58, 44),
            kraftMat
          );
          secondRoll.position.set(0.85, -0.22, 0.25);
          secondRoll.rotation.set(1.1, -0.35, 0.4);
          const brandBand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.79, 0.79, 0.18, 44),
            tealMat
          );
          secondRoll.add(brandBand);
          group.add(secondRoll);

          const strip = new THREE.Mesh(
            new RoundedBoxGeometry(1.65, 0.04, 0.68, 3, 0.01),
            kraftMat
          );
          strip.position.set(0.25, -0.68, 0.35);
          strip.rotation.set(0.15, -0.2, -0.12);
          group.add(strip);
          break;
        }

        case "cartons": {
          const mainCarton = new THREE.Mesh(
            new RoundedBoxGeometry(1.85, 1.45, 1.45, 4, 0.03),
            new THREE.MeshPhysicalMaterial({
              map: cartonTex,
              roughness: 0.72,
              metalness: 0.02,
            })
          );
          mainCarton.position.set(-0.35, 0.05, 0);
          mainCarton.rotation.set(0.18, 0.52, 0);

          const topTape = new THREE.Mesh(
            new RoundedBoxGeometry(1.87, 0.04, 0.28, 2, 0.01),
            tealMat
          );
          topTape.position.set(0, 0.72, 0);
          mainCarton.add(topTape);
          group.add(mainCarton);

          const secondBox = new THREE.Mesh(
            new RoundedBoxGeometry(1.15, 0.95, 1.05, 4, 0.025),
            new THREE.MeshPhysicalMaterial({
              color: 0xA87948,
              roughness: 0.75,
            })
          );
          secondBox.position.set(0.95, -0.28, 0.42);
          secondBox.rotation.set(0.22, -0.38, 0.05);
          const boxLabel = new THREE.Mesh(
            new RoundedBoxGeometry(0.65, 0.48, 0.03, 2, 0.01),
            new THREE.MeshPhysicalMaterial({ map: stickerTex, roughness: 0.25 })
          );
          boxLabel.position.set(0, 0.05, 0.53);
          secondBox.add(boxLabel);
          group.add(secondBox);
          break;
        }

        case "buttons": {
          // 1. Hero 4-Hole Tailoring Button
          const mainButton = new THREE.Group();
          const btnDisk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.82, 0.82, 0.18, 48),
            darkNavyMat
          );
          btnDisk.rotation.x = Math.PI / 2;
          mainButton.add(btnDisk);

          const btnRim = new THREE.Mesh(
            new THREE.TorusGeometry(0.76, 0.075, 20, 48),
            brassMat
          );
          btnRim.position.z = 0.06;
          mainButton.add(btnRim);

          const holeOffsets = [
            [-0.22, 0.22],
            [0.22, 0.22],
            [-0.22, -0.22],
            [0.22, -0.22],
          ];
          for (const [hx, hy] of holeOffsets) {
            const holeRing = new THREE.Mesh(
              new THREE.TorusGeometry(0.085, 0.025, 12, 24),
              cyanMat
            );
            holeRing.position.set(hx, hy, 0.09);
            mainButton.add(holeRing);
          }
          mainButton.position.set(-0.45, 0.22, 0.15);
          mainButton.rotation.set(-0.22, 0.28, 0.12);
          group.add(mainButton);

          // 2. Pearl & Brass Shank Button with concentric detail
          const pearlBtn = new THREE.Group();
          const pearlCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.55, 0.48, 0.22, 40),
            new THREE.MeshPhysicalMaterial({
              map: pearlButtonTex,
              roughness: 0.24,
              metalness: 0.12,
              clearcoat: 0.8,
            })
          );
          pearlCap.rotation.x = Math.PI / 2;
          pearlBtn.add(pearlCap);

          const pearlRim = new THREE.Mesh(
            new THREE.TorusGeometry(0.52, 0.045, 16, 40),
            chromeMat
          );
          pearlRim.position.z = 0.07;
          pearlBtn.add(pearlRim);

          const pearlCenterStud = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.14, 0.25, 24),
            brassMat
          );
          pearlCenterStud.rotation.x = Math.PI / 2;
          pearlBtn.add(pearlCenterStud);

          const shankLoop = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.04, 14, 28),
            brassMat
          );
          shankLoop.position.set(0, 0, -0.18);
          pearlBtn.add(shankLoop);
          pearlBtn.position.set(0.85, 0.38, -0.1);
          pearlBtn.rotation.set(0.35, -0.45, -0.2);
          group.add(pearlBtn);

          // 3. Sculpted Wood/Horn Barrel Toggle
          const togglePts = [
            new THREE.Vector2(0.02, -0.68),
            new THREE.Vector2(0.16, -0.62),
            new THREE.Vector2(0.24, 0),
            new THREE.Vector2(0.16, 0.62),
            new THREE.Vector2(0.02, 0.68),
          ];
          const toggleMesh = new THREE.Mesh(
            new THREE.LatheGeometry(togglePts, 32),
            leatherMat
          );
          toggleMesh.position.set(0.55, -0.58, 0.35);
          toggleMesh.rotation.set(0.3, 0.2, 1.15);
          const toggleBand = new THREE.Mesh(
            new THREE.TorusGeometry(0.235, 0.03, 12, 32),
            brassMat
          );
          toggleBand.rotation.x = Math.PI / 2;
          toggleMesh.add(toggleBand);
          group.add(toggleMesh);
          break;
        }

        case "metallic-items": {
          const leftTape = new THREE.Mesh(
            new RoundedBoxGeometry(0.75, 2.5, 0.06, 3, 0.02),
            tealMat
          );
          leftTape.position.set(-0.46, 0, -0.04);
          group.add(leftTape);

          const rightTape = new THREE.Mesh(
            new RoundedBoxGeometry(0.75, 2.5, 0.06, 3, 0.02),
            tealMat
          );
          rightTape.position.set(0.46, 0, -0.04);
          group.add(rightTape);

          const toothGeo = new THREE.BoxGeometry(0.18, 0.075, 0.09);
          for (let i = -9; i <= 9; i++) {
            const y = i * 0.115;
            const leftTooth = new THREE.Mesh(toothGeo, chromeMat);
            leftTooth.position.set(-0.06, y, 0);
            group.add(leftTooth);

            const rightTooth = new THREE.Mesh(toothGeo, brassMat);
            rightTooth.position.set(0.06, y + 0.055, 0);
            group.add(rightTooth);
          }

          const sliderBody = new THREE.Mesh(
            new RoundedBoxGeometry(0.52, 0.62, 0.24, 4, 0.04),
            brassMat
          );
          sliderBody.position.set(0, 0.22, 0.08);
          group.add(sliderBody);

          const pullerTab = new THREE.Mesh(
            new RoundedBoxGeometry(0.38, 0.78, 0.08, 4, 0.03),
            chromeMat
          );
          pullerTab.position.set(0, -0.32, 0.24);
          pullerTab.rotation.x = 0.24;
          const pullerInlay = new THREE.Mesh(
            new RoundedBoxGeometry(0.2, 0.45, 0.1, 3, 0.02),
            darkNavyMat
          );
          pullerTab.add(pullerInlay);
          group.add(pullerTab);

          const dRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.38, 0.075, 18, 36),
            brassMat
          );
          dRing.position.set(1.18, -0.35, 0.25);
          dRing.rotation.set(0.25, -0.4, 0.15);
          group.add(dRing);

          group.rotation.set(-0.18, 0.28, -0.15);
          break;
        }

        case "collar-stand-and-butterfly": {
          const collarBandGeo = new THREE.CylinderGeometry(
            1.15,
            1.22,
            0.62,
            48,
            1,
            true,
            -Math.PI * 0.78,
            Math.PI * 1.56
          );
          const collarBandMat = new THREE.MeshPhysicalMaterial({
            color: 0xE2E8F0,
            roughness: 0.26,
            metalness: 0.06,
            clearcoat: 0.65,
            side: THREE.DoubleSide,
          });
          const collarBand = new THREE.Mesh(collarBandGeo, collarBandMat);
          collarBand.position.set(-0.15, 0.18, -0.1);
          collarBand.rotation.set(0.38, 0.35, -0.08);
          group.add(collarBand);

          const collarTrimGeo = new THREE.CylinderGeometry(
            1.16,
            1.16,
            0.12,
            48,
            1,
            true,
            -Math.PI * 0.75,
            Math.PI * 1.5
          );
          const collarTrim = new THREE.Mesh(
            collarTrimGeo,
            new THREE.MeshPhysicalMaterial({
              color: 0x167186,
              side: THREE.DoubleSide,
              roughness: 0.3,
            })
          );
          collarBand.add(collarTrim);

          const butterflyShape = new THREE.Shape();
          butterflyShape.moveTo(0, 0.22);
          butterflyShape.lineTo(0.78, 0.52);
          butterflyShape.lineTo(0.62, -0.45);
          butterflyShape.lineTo(0, -0.18);
          butterflyShape.lineTo(-0.62, -0.45);
          butterflyShape.lineTo(-0.78, 0.52);
          butterflyShape.closePath();

          const butterflyGeo = new THREE.ExtrudeGeometry(butterflyShape, {
            depth: 0.06,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.02,
            bevelThickness: 0.02,
          });
          butterflyGeo.center();
          const butterflyMesh = new THREE.Mesh(butterflyGeo, cyanMat);
          butterflyMesh.position.set(0.35, -0.45, 0.55);
          butterflyMesh.rotation.set(-0.28, -0.25, 0.12);
          group.add(butterflyMesh);
          break;
        }

        case "lock-strings-and-pullers": {
          const sealBody = new THREE.Mesh(
            new RoundedBoxGeometry(0.55, 0.92, 0.32, 4, 0.08),
            tealMat
          );
          sealBody.position.set(-0.55, -0.15, 0.18);
          sealBody.rotation.set(-0.15, 0.25, 0.12);
          const sealEmboss = new THREE.Mesh(
            new RoundedBoxGeometry(0.38, 0.52, 0.35, 3, 0.04),
            brassMat
          );
          sealBody.add(sealEmboss);
          group.add(sealBody);

          const loopCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.7, 0.28, 0.18),
            new THREE.Vector3(-0.95, 0.95, 0.05),
            new THREE.Vector3(-0.25, 1.05, -0.05),
            new THREE.Vector3(-0.42, 0.28, 0.18),
          ]);
          const loopMesh = new THREE.Mesh(
            new THREE.TubeGeometry(loopCurve, 36, 0.035, 12, false),
            creamMat
          );
          group.add(loopMesh);

          const pullerBody = new THREE.Mesh(
            new RoundedBoxGeometry(0.62, 1.25, 0.16, 4, 0.05),
            darkNavyMat
          );
          pullerBody.position.set(0.62, -0.1, 0.12);
          pullerBody.rotation.set(0.12, -0.28, -0.15);

          const pullerGrip = new THREE.Mesh(
            new RoundedBoxGeometry(0.44, 0.55, 0.19, 3, 0.03),
            cyanMat
          );
          pullerGrip.position.set(0, -0.22, 0);
          pullerBody.add(pullerGrip);

          const pullerRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.04, 14, 28),
            chromeMat
          );
          pullerRing.position.set(0, 0.72, 0);
          pullerBody.add(pullerRing);
          group.add(pullerBody);
          break;
        }

        case "desiccant-items": {
          const packet1 = new THREE.Mesh(
            new RoundedBoxGeometry(1.55, 1.95, 0.22, 4, 0.06),
            new THREE.MeshPhysicalMaterial({
              map: desiccantTex,
              roughness: 0.48,
              metalness: 0.04,
            })
          );
          packet1.position.set(-0.42, 0.08, 0.12);
          packet1.rotation.set(-0.18, 0.24, 0.08);

          const topFin = new THREE.Mesh(
            new RoundedBoxGeometry(1.58, 0.18, 0.06, 2, 0.01),
            tealMat
          );
          topFin.position.set(0, 1.02, 0);
          packet1.add(topFin);
          const botFin = topFin.clone();
          botFin.position.set(0, -1.02, 0);
          packet1.add(botFin);
          group.add(packet1);

          const packet2 = new THREE.Mesh(
            new RoundedBoxGeometry(1.35, 1.65, 0.2, 4, 0.05),
            tealMat
          );
          packet2.position.set(0.72, -0.18, -0.08);
          packet2.rotation.set(0.12, -0.28, -0.14);
          const packet2Badge = new THREE.Mesh(
            new RoundedBoxGeometry(1.08, 0.85, 0.22, 3, 0.03),
            new THREE.MeshPhysicalMaterial({ map: desiccantTex, roughness: 0.45 })
          );
          packet2.add(packet2Badge);
          group.add(packet2);

          const beadGeo = new THREE.SphereGeometry(0.11, 20, 20);
          const beadPositions = [
            [-0.1, -0.82, 0.55],
            [0.14, -0.86, 0.62],
            [0.02, -0.72, 0.68],
            [0.28, -0.78, 0.52],
          ];
          beadPositions.forEach(([bx, by, bz], idx) => {
            const bead = new THREE.Mesh(
              beadGeo,
              idx % 2 === 0 ? brassMat : cyanMat
            );
            bead.position.set(bx, by, bz);
            group.add(bead);
          });
          break;
        }
      }

      return group;
    }

    function exportGLB(object3d) {
      const exporter = new GLTFExporter();
      return new Promise((resolve, reject) => {
        exporter.parse(
          object3d,
          (result) => resolve(result),
          (err) => reject(err),
          { binary: true }
        );
      });
    }

    async function postBinary(endpoint, filename, arrayBuffer) {
      const res = await fetch(endpoint + "?name=" + encodeURIComponent(filename), {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: arrayBuffer,
      });
      if (!res.ok) throw new Error("Failed to save " + filename);
    }

    async function postDataUrl(endpoint, filename, dataUrl) {
      const base64 = dataUrl.split(",")[1];
      const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      await postBinary(endpoint, filename, binary.buffer);
    }

    async function renderStudioPhotos(slug, indexStr, title, modelGroup) {
      const scene = new THREE.Scene();
      scene.environment = envTexture;

      const bgTex = makeCanvasTexture((ctx, w, h) => {
        const grad = ctx.createRadialGradient(
          w * 0.52,
          h * 0.44,
          40,
          w * 0.5,
          h * 0.5,
          w * 0.75
        );
        grad.addColorStop(0, "#132E3C");
        grad.addColorStop(0.55, "#0B1D27");
        grad.addColorStop(1, "#061017");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(90, 197, 229, 0.055)";
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 48) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 48) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }, 960, 720);
      scene.background = bgTex;

      const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.1);
      keyLight.position.set(4, 6, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x5AC5E5, 1.15);
      fillLight.position.set(-5, 2, 3);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xF59E0B, 0.95);
      rimLight.position.set(0, -4, -3);
      scene.add(rimLight);

      const ambient = new THREE.AmbientLight(0xD8F1F8, 0.62);
      scene.add(ambient);

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.85, 1.95, 0.08, 64),
        new THREE.MeshPhysicalMaterial({
          color: 0x0B1B24,
          roughness: 0.35,
          metalness: 0.25,
          clearcoat: 0.4,
        })
      );
      pedestal.position.set(0, -1.28, 0);
      scene.add(pedestal);

      const pedestalRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.85, 0.015, 12, 64),
        new THREE.MeshBasicMaterial({ color: 0x268CA9 })
      );
      pedestalRim.rotation.x = Math.PI / 2;
      pedestalRim.position.set(0, -1.24, 0);
      scene.add(pedestalRim);

      scene.add(modelGroup);

      const camera = new THREE.PerspectiveCamera(36, WIDTH / HEIGHT, 0.1, 100);

      const shots = [
        {
          file: slug + ".png",
          camPos: [0, 0.25, 4.7],
          rot: [0.05, 0.0, 0],
        },
        {
          file: slug + "-1.png",
          camPos: [-0.85, 0.45, 3.85],
          rot: [0.14, 0.48, 0.04],
        },
        {
          file: slug + "-2.png",
          camPos: [0.95, 0.3, 3.95],
          rot: [-0.08, -0.52, -0.05],
        },
        {
          file: slug + "-3.png",
          camPos: [0.15, 1.15, 3.65],
          rot: [0.35, -0.22, 0.08],
        },
      ];

      for (const shot of shots) {
        camera.position.set(...shot.camPos);
        camera.lookAt(0, -0.05, 0);
        modelGroup.rotation.set(...shot.rot);
        renderer.render(scene, camera);
        const dataUrl = renderer.domElement.toDataURL("image/png");
        await postDataUrl("/save-image", shot.file, dataUrl);
      }
    }

    const categories = [
      { index: "01", slug: "labels", title: "Labels" },
      { index: "02", slug: "stickers", title: "Stickers" },
      { index: "03", slug: "heat-transfer", title: "Heat Transfer" },
      { index: "04", slug: "offset-paper-items", title: "Offset (Paper Items)" },
      { index: "05", slug: "patches", title: "Patches" },
      { index: "06", slug: "narrow-fabrics", title: "Narrow Fabrics" },
      { index: "07", slug: "gum-tape", title: "Gum Tape" },
      { index: "08", slug: "cartons", title: "Cartons" },
      { index: "09", slug: "buttons", title: "Buttons" },
      { index: "10", slug: "metallic-items", title: "Metallic Items" },
      { index: "11", slug: "collar-stand-and-butterfly", title: "Collar Stand & Butterfly" },
      { index: "12", slug: "lock-strings-and-pullers", title: "Lock Strings & Pullers" },
      { index: "13", slug: "desiccant-items", title: "Desiccant Items" },
    ];

    async function runAll() {
      for (const cat of categories) {
        log("Generating 3D GLB & 4 Studio Photos for " + cat.slug + "...");
        const model = createCategoryModel(cat.slug);
        const glbBuffer = await exportGLB(model);
        await postBinary("/save-glb", cat.slug + ".glb", glbBuffer);
        await renderStudioPhotos(cat.slug, cat.index, cat.title, model);
      }
      log("DONE_ALL_ASSETS");
      window.__ASSETS_DONE__ = true;
    }

    runAll().catch((err) => {
      console.error(err);
      log("ERROR: " + err.message);
      window.__ASSETS_ERROR__ = err.message;
    });
  </script>
</body>
</html>`;

function startGeneratorServer() {
  const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);

    if (req.method === "POST" && reqUrl.pathname === "/save-glb") {
      const name = path.basename(reqUrl.searchParams.get("name") || "model.glb");
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(MODELS_DIR, name), buf);
        console.log(`Saved 3D Model: public/assets/3d/${name} (${buf.length} bytes)`);
        res.statusCode = 200;
        res.end("OK");
      });
      return;
    }

    if (req.method === "POST" && reqUrl.pathname === "/save-image") {
      const name = path.basename(reqUrl.searchParams.get("name") || "image.png");
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(path.join(IMAGES_DIR, name), buf);
        console.log(`Saved Studio Image: public/assets/images/${name} (${buf.length} bytes)`);
        res.statusCode = 200;
        res.end("OK");
      });
      return;
    }

    if (reqUrl.pathname === "/") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(HTML_PAGE);
      return;
    }

    if (reqUrl.pathname.startsWith("/node_modules/")) {
      const filePath = path.join(ROOT_DIR, decodeURIComponent(reqUrl.pathname));
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.end(fs.readFileSync(filePath));
        return;
      }
    }

    res.statusCode = 404;
    res.end("Not found");
  });

  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

function findBrowserExecutable() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  return candidates.find((p) => fs.existsSync(p));
}

async function main() {
  const server = await startGeneratorServer();
  const browserExe = findBrowserExecutable();
  if (!browserExe) {
    console.error("No Chrome/Edge found");
    server.close();
    process.exit(1);
  }

  const debugPort = 9234;
  const userDataDir = path.join(process.env.TEMP || "C:\\Windows\\Temp", `chrome-gen-${Date.now()}`);

  const proc = spawn(
    browserExe,
    [
      "--headless=new",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      `http://127.0.0.1:${PORT}/`,
    ],
    { stdio: "ignore" }
  );

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const resp = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const targets = await resp.json();
      const pageTarget = targets.find((t) => t.type === "page");
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        wsUrl = pageTarget.webSocketDebuggerUrl;
        break;
      }
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  if (!wsUrl) {
    console.error("Failed to connect to headless Chrome");
    proc.kill();
    server.close();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));

  let msgId = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const data = JSON.parse(ev.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    }
  });

  function send(method, params = {}) {
    const id = ++msgId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Runtime.enable");

  for (let i = 0; i < 120; i++) {
    const evalRes = await send("Runtime.evaluate", {
      expression: `({ done: !!window.__ASSETS_DONE__, error: window.__ASSETS_ERROR__ || null, status: document.getElementById('status')?.textContent })`,
      returnByValue: true,
    });
    const val = evalRes.result?.value;
    if (val?.error) {
      console.error("Browser generator error:", val.error);
      break;
    }
    if (val?.done) {
      console.log("All 13 GLB models and 52 Studio Images generated successfully!");
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  ws.close();
  proc.kill();
  server.close();
}

main();
