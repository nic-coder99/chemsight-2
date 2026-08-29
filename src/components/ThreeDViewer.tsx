import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Model3DData } from '../types';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, Info, Maximize2 } from 'lucide-react';

interface ThreeDViewerProps {
  model: Model3DData;
  height?: string;
  showControls?: boolean;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  model,
  height = '420px',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showBondAngles, setShowBondAngles] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // References for scene, camera, renderer, animation frame
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const rotSpeedRef = useRef({ x: 0.005, y: 0.008 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const heightPx = parseInt(height, 10) || 420;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Clean cute off-white
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Clear old canvases
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa5f3fc, 0.6); // subtle cyan rim
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Build Specific 3D Geometry
    const group = new THREE.Group();
    modelGroupRef.current = group;
    buildModelGeometry(group, model.geometryType, wireframeMode);
    scene.add(group);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (group) {
        if (isAutoRotating && !isDraggingRef.current) {
          group.rotation.y += rotSpeedRef.current.y;
          group.rotation.x += rotSpeedRef.current.x * 0.5;
        }

        // Pulse / rotate custom inner components (like electrons in Bohr model)
        const bohrElectrons = group.getObjectByName('bohr_electrons');
        if (bohrElectrons) {
          bohrElectrons.children.forEach((child, idx) => {
            child.rotation.z += 0.03 * (idx + 1);
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [model, wireframeMode]);

  // Handle Mouse / Touch Dragging for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.z = Math.max(3, Math.min(15, cameraRef.current.position.z * factor));
    setZoomLevel(7.5 / cameraRef.current.position.z);
  };

  const resetView = () => {
    if (modelGroupRef.current && cameraRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 7.5);
      setZoomLevel(1);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-50 to-indigo-50/30 border-2 border-indigo-50 shadow-sm select-none">
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full cursor-grab active:cursor-grabbing"
        style={{ height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Floating Info Tag on Top Left */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-indigo-900 tracking-wide">360° Interactive 3D Model</span>
      </div>

      {/* Model Spec Badge on Top Right */}
      {model.bondAngle && (
        <div className="absolute top-3 right-3 bg-orange-50/95 backdrop-blur-md px-3 py-1 rounded-2xl border border-orange-200 shadow-sm text-xs text-orange-800 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Bond Angle: {model.bondAngle}</span>
        </div>
      )}

      {/* Interactive Controls Toolbar at Bottom */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition ${
              isAutoRotating ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle Auto Spin"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="text-[11px]">Auto Spin</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />

          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl text-xs transition ${
              wireframeMode ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'
            }`}
            title="Toggle Wireframe / Surface"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            title="Reset Orientation"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Helpful Hint Overlay */}
      <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
        <Info className="w-3 h-3 text-indigo-400" />
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};

// Helper: Procedural 3D Geometry Builder for Chemistry Models
function buildModelGeometry(group: THREE.Group, type: string, wireframe: boolean) {
  // Common atom materials
  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Dark slate carbon
    roughness: 0.2,
    metalness: 0.1,
    wireframe,
  });

  const hydrogenMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // Crisp white hydrogen
    roughness: 0.1,
    metalness: 0.1,
    wireframe,
  });

  const oxygenMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Vibrant red oxygen
    roughness: 0.2,
    metalness: 0.1,
    wireframe,
  });

  const nitrogenMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6, // Blue nitrogen
    roughness: 0.2,
    metalness: 0.1,
    wireframe,
  });

  const sodiumMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7, // Purple Na+
    roughness: 0.3,
    metalness: 0.2,
    wireframe,
  });

  const chlorineMat = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald green Cl-
    roughness: 0.3,
    metalness: 0.2,
    wireframe,
  });

  const bondMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1, // Light silver bond cylinder
    roughness: 0.3,
    metalness: 0.3,
    wireframe,
  });

  const lonePairMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    transmission: 0.7,
    wireframe,
  });

  // Helper to create bond between two 3D vectors
  const createBond = (v1: THREE.Vector3, v2: THREE.Vector3, radius = 0.1) => {
    const distance = v1.distanceTo(v2);
    const bondGeom = new THREE.CylinderGeometry(radius, radius, distance, 16);
    const mesh = new THREE.Mesh(bondGeom, bondMat);

    const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    mesh.position.copy(midpoint);

    const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    group.add(mesh);
  };

  const createAtom = (pos: THREE.Vector3, radius: number, mat: THREE.Material) => {
    const geom = new THREE.SphereGeometry(radius, 32, 32);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  switch (type) {
    case 'tetrahedral': {
      // Methane CH4
      const center = new THREE.Vector3(0, 0, 0);
      createAtom(center, 0.75, carbonMat);

      // Tetrahedral vertices
      const d = 1.45;
      const hPositions = [
        new THREE.Vector3(d, d, d).normalize().multiplyScalar(1.6),
        new THREE.Vector3(-d, -d, d).normalize().multiplyScalar(1.6),
        new THREE.Vector3(-d, d, -d).normalize().multiplyScalar(1.6),
        new THREE.Vector3(d, -d, -d).normalize().multiplyScalar(1.6),
      ];

      hPositions.forEach((pos) => {
        createAtom(pos, 0.45, hydrogenMat);
        createBond(center, pos);
      });
      break;
    }

    case 'bent': {
      // Water H2O (104.5 deg)
      const center = new THREE.Vector3(0, 0.2, 0);
      createAtom(center, 0.78, oxygenMat);

      const angleRad = (104.5 * Math.PI) / 180;
      const r = 1.5;
      const h1 = new THREE.Vector3(Math.sin(angleRad / 2) * r, -Math.cos(angleRad / 2) * r + 0.2, 0);
      const h2 = new THREE.Vector3(-Math.sin(angleRad / 2) * r, -Math.cos(angleRad / 2) * r + 0.2, 0);

      createAtom(h1, 0.45, hydrogenMat);
      createAtom(h2, 0.45, hydrogenMat);
      createBond(center, h1);
      createBond(center, h2);

      // Add 2 lone pair electron clouds (translucent teardrops)
      const lp1Geom = new THREE.SphereGeometry(0.55, 24, 24);
      lp1Geom.scale(0.7, 1.2, 0.7);
      const lp1 = new THREE.Mesh(lp1Geom, lonePairMat);
      lp1.position.set(0.65, 0.9, 0.6);
      lp1.rotation.set(-0.3, 0.4, 0.3);
      group.add(lp1);

      const lp2 = new THREE.Mesh(lp1Geom, lonePairMat);
      lp2.position.set(-0.65, 0.9, -0.6);
      lp2.rotation.set(0.3, -0.4, -0.3);
      group.add(lp2);
      break;
    }

    case 'linear': {
      // CO2
      const center = new THREE.Vector3(0, 0, 0);
      createAtom(center, 0.7, carbonMat);

      const o1 = new THREE.Vector3(-1.8, 0, 0);
      const o2 = new THREE.Vector3(1.8, 0, 0);

      createAtom(o1, 0.72, oxygenMat);
      createAtom(o2, 0.72, oxygenMat);

      // Double bonds
      createBond(new THREE.Vector3(-0.05, 0.15, 0), new THREE.Vector3(-1.75, 0.15, 0), 0.07);
      createBond(new THREE.Vector3(-0.05, -0.15, 0), new THREE.Vector3(-1.75, -0.15, 0), 0.07);
      createBond(new THREE.Vector3(0.05, 0.15, 0), new THREE.Vector3(1.75, 0.15, 0), 0.07);
      createBond(new THREE.Vector3(0.05, -0.15, 0), new THREE.Vector3(1.75, -0.15, 0), 0.07);
      break;
    }

    case 'pyramidal': {
      // NH3
      const center = new THREE.Vector3(0, 0.3, 0);
      createAtom(center, 0.75, nitrogenMat);

      const r = 1.45;
      const h1 = new THREE.Vector3(r * Math.cos(0), -0.7, r * Math.sin(0));
      const h2 = new THREE.Vector3(r * Math.cos((2 * Math.PI) / 3), -0.7, r * Math.sin((2 * Math.PI) / 3));
      const h3 = new THREE.Vector3(r * Math.cos((4 * Math.PI) / 3), -0.7, r * Math.sin((4 * Math.PI) / 3));

      createAtom(h1, 0.42, hydrogenMat);
      createAtom(h2, 0.42, hydrogenMat);
      createAtom(h3, 0.42, hydrogenMat);

      createBond(center, h1);
      createBond(center, h2);
      createBond(center, h3);

      // Top lone pair
      const lpGeom = new THREE.SphereGeometry(0.6, 24, 24);
      lpGeom.scale(0.8, 1.3, 0.8);
      const lp = new THREE.Mesh(lpGeom, lonePairMat);
      lp.position.set(0, 1.2, 0);
      group.add(lp);
      break;
    }

    case 'ethanol': {
      // Ethanol C2H5OH
      const c1 = new THREE.Vector3(-0.9, 0, 0);
      const c2 = new THREE.Vector3(0.5, 0, 0);
      const o = new THREE.Vector3(1.5, 0.8, 0);
      const ho = new THREE.Vector3(2.3, 0.5, 0);

      createAtom(c1, 0.65, carbonMat);
      createAtom(c2, 0.65, carbonMat);
      createAtom(o, 0.68, oxygenMat);
      createAtom(ho, 0.38, hydrogenMat);

      createBond(c1, c2);
      createBond(c2, o);
      createBond(o, ho);

      // Hydrogens on C1
      const h_c1 = [
        new THREE.Vector3(-1.8, 0, 0),
        new THREE.Vector3(-0.9, 1.0, 0.6),
        new THREE.Vector3(-0.9, -1.0, -0.6),
      ];
      h_c1.forEach((h) => {
        createAtom(h, 0.38, hydrogenMat);
        createBond(c1, h);
      });

      // Hydrogens on C2
      const h_c2 = [
        new THREE.Vector3(0.5, -1.0, 0.6),
        new THREE.Vector3(0.5, 0.4, -0.9),
      ];
      h_c2.forEach((h) => {
        createAtom(h, 0.38, hydrogenMat);
        createBond(c2, h);
      });
      break;
    }

    case 'crystal_lattice': {
      // NaCl 3x3x3 cubic lattice
      const size = 3;
      const spacing = 1.0;
      const offset = (size - 1) * spacing * 0.5;

      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          for (let z = 0; z < size; z++) {
            const isNa = (x + y + z) % 2 === 0;
            const pos = new THREE.Vector3(
              x * spacing - offset,
              y * spacing - offset,
              z * spacing - offset
            );

            createAtom(pos, isNa ? 0.28 : 0.38, isNa ? sodiumMat : chlorineMat);

            // Bonds
            if (x < size - 1) createBond(pos, new THREE.Vector3((x + 1) * spacing - offset, y * spacing - offset, z * spacing - offset), 0.035);
            if (y < size - 1) createBond(pos, new THREE.Vector3(x * spacing - offset, (y + 1) * spacing - offset, z * spacing - offset), 0.035);
            if (z < size - 1) createBond(pos, new THREE.Vector3(x * spacing - offset, y * spacing - offset, (z + 1) * spacing - offset), 0.035);
          }
        }
      }
      break;
    }

    case 'bohr_atom': {
      // Planetary Bohr Atom
      // Nucleus with protons and neutrons
      const nucleusGroup = new THREE.Group();
      for (let i = 0; i < 14; i++) {
        const isProton = i % 2 === 0;
        const pGeom = new THREE.SphereGeometry(0.22, 16, 16);
        const pMat = new THREE.MeshStandardMaterial({
          color: isProton ? 0xef4444 : 0x3b82f6,
          roughness: 0.2,
        });
        const pMesh = new THREE.Mesh(pGeom, pMat);
        pMesh.position.set(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.7
        );
        nucleusGroup.add(pMesh);
      }
      group.add(nucleusGroup);

      // Rings & Orbiting Electrons
      const electronsGroup = new THREE.Group();
      electronsGroup.name = 'bohr_electrons';

      const shells = [1.3, 2.2, 3.1];
      const electronCounts = [2, 8, 2];

      shells.forEach((radius, shellIdx) => {
        const ringGeom = new THREE.TorusGeometry(radius, 0.02, 16, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2 + (shellIdx * 0.2);
        ring.rotation.y = shellIdx * 0.3;
        group.add(ring);

        const count = electronCounts[shellIdx];
        const shellElectrons = new THREE.Group();

        for (let e = 0; e < count; e++) {
          const theta = (e / count) * Math.PI * 2;
          const eGeom = new THREE.SphereGeometry(0.12, 16, 16);
          const eMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.8,
          });
          const eMesh = new THREE.Mesh(eGeom, eMat);
          eMesh.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
          shellElectrons.add(eMesh);
        }
        shellElectrons.rotation.copy(ring.rotation);
        electronsGroup.add(shellElectrons);
      });

      group.add(electronsGroup);
      break;
    }

    case 'voltaic_cell': {
      // 3D Voltaic Cell setup
      // Beaker 1 (Left)
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        transmission: 0.9,
        roughness: 0.1,
      });

      const b1Geom = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32, 1, true);
      const b1 = new THREE.Mesh(b1Geom, glassMat);
      b1.position.set(-1.3, 0, 0);
      group.add(b1);

      // Liquid 1 (ZnSO4 - clear/pale)
      const l1Geom = new THREE.CylinderGeometry(0.78, 0.78, 1.2, 32);
      const l1Mat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 });
      const l1 = new THREE.Mesh(l1Geom, l1Mat);
      l1.position.set(-1.3, -0.2, 0);
      group.add(l1);

      // Electrode 1: Zinc (Silver-gray)
      const e1Geom = new THREE.BoxGeometry(0.25, 1.8, 0.08);
      const znMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
      const e1 = new THREE.Mesh(e1Geom, znMat);
      e1.position.set(-1.3, 0.2, 0);
      group.add(e1);

      // Beaker 2 (Right)
      const b2 = new THREE.Mesh(b1Geom, glassMat);
      b2.position.set(1.3, 0, 0);
      group.add(b2);

      // Liquid 2 (CuSO4 - Royal Blue)
      const l2Mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.75 });
      const l2 = new THREE.Mesh(l1Geom, l2Mat);
      l2.position.set(1.3, -0.2, 0);
      group.add(l2);

      // Electrode 2: Copper (Bronze-copper)
      const cuMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.2 });
      const e2 = new THREE.Mesh(e1Geom, cuMat);
      e2.position.set(1.3, 0.2, 0);
      group.add(e2);

      // Salt Bridge U-Tube inverted
      const saltTube = new THREE.TorusGeometry(1.2, 0.12, 16, 32, Math.PI);
      const saltMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, transparent: true, opacity: 0.85 });
      const saltMesh = new THREE.Mesh(saltTube, saltMat);
      saltMesh.position.set(0, 0.1, 0);
      group.add(saltMesh);

      // Voltmeter on top
      const vmGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 32);
      const vmMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 });
      const vm = new THREE.Mesh(vmGeom, vmMat);
      vm.position.set(0, 1.6, 0);
      vm.rotation.x = Math.PI / 2;
      group.add(vm);

      // Connecting wires
      createBond(new THREE.Vector3(-1.3, 1.1, 0), new THREE.Vector3(-0.4, 1.6, 0), 0.03);
      createBond(new THREE.Vector3(1.3, 1.1, 0), new THREE.Vector3(0.4, 1.6, 0), 0.03);
      break;
    }

    case 'titration': {
      // 3D Titration apparatus
      // Stand base
      const baseGeom = new THREE.BoxGeometry(2.4, 0.15, 1.6);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
      const base = new THREE.Mesh(baseGeom, standMat);
      base.position.set(-0.4, -1.8, 0);
      group.add(base);

      // Retort Rod
      const rodGeom = new THREE.CylinderGeometry(0.06, 0.06, 4.2, 16);
      const rod = new THREE.Mesh(rodGeom, standMat);
      rod.position.set(-1.2, 0.3, 0);
      group.add(rod);

      // Clamp arm
      const armGeom = new THREE.BoxGeometry(1.2, 0.12, 0.12);
      const arm = new THREE.Mesh(armGeom, standMat);
      arm.position.set(-0.6, 0.8, 0);
      group.add(arm);

      // Burette Glass Tube
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        transmission: 0.95,
        roughness: 0.1,
      });
      const buretteGeom = new THREE.CylinderGeometry(0.16, 0.16, 2.6, 32);
      const burette = new THREE.Mesh(buretteGeom, glassMat);
      burette.position.set(0, 0.8, 0);
      group.add(burette);

      // Conical Flask below
      const flaskGeom = new THREE.ConeGeometry(0.8, 1.2, 32);
      const flask = new THREE.Mesh(flaskGeom, glassMat);
      flask.position.set(0, -1.1, 0);
      group.add(flask);

      // Pink Titration Liquid
      const liquidGeom = new THREE.ConeGeometry(0.72, 0.8, 32);
      const liquidMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.75 });
      const liquid = new THREE.Mesh(liquidGeom, liquidMat);
      liquid.position.set(0, -1.3, 0);
      group.add(liquid);

      // White tile under flask
      const tileGeom = new THREE.BoxGeometry(1.4, 0.08, 1.4);
      const tileMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      const tile = new THREE.Mesh(tileGeom, tileMat);
      tile.position.set(0, -1.7, 0);
      group.add(tile);
      break;
    }

    default: {
      // Default sphere
      createAtom(new THREE.Vector3(0, 0, 0), 1.2, carbonMat);
      break;
    }
  }
}
