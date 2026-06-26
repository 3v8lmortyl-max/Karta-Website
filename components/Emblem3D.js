'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Center, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { KARTA_LOGO_PATH } from '../lib/logoPath';

function LogoMesh() {
  const ref = useRef();

  const geometry = useMemo(() => {
    // Build an SVG document string from the traced path and parse it
    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${KARTA_LOGO_PATH}"/></svg>`;
    const loader = new SVGLoader();
    const data = loader.parse(svgMarkup);

    const shapes = [];
    data.paths.forEach((p) => {
      const ss = SVGLoader.createShapes(p);
      ss.forEach((s) => shapes.push(s));
    });

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.045,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.center();
    // The trace was Y-flipped; flip back so it reads correctly
    geo.scale(1, -1, 1);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh ref={ref} geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#eceef2"
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

export default function Emblem3D() {
  return (
    <div className="emblem-canvas">
      <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[8, 10, 8]} angle={0.3} penumbra={1} intensity={2.6} />
          <pointLight position={[-8, -6, -6]} intensity={1.1} color="#c4973a" />
          <pointLight position={[6, -2, 8]} intensity={0.8} color="#7fb0ff" />
          <Center>
            <LogoMesh />
          </Center>
          <Environment preset="studio" />
          {/* Fully free rotation — drag any direction, any angle */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.95}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
