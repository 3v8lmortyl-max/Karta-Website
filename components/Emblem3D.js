'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { KARTA_LOGO_PATH } from '../lib/logoPath';

// The raised lettering on the coin face
function RaisedLetters({ radius }) {
  const geometry = useMemo(() => {
    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${KARTA_LOGO_PATH}"/></svg>`;
    const data = new SVGLoader().parse(svgMarkup);
    const shapes = [];
    data.paths.forEach((p) => SVGLoader.createShapes(p).forEach((s) => shapes.push(s)));

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 20,
    });
    geo.scale(1, -1, 1);
    geo.center();
    // Scale to fit inside coin — logo aspect ~1.94:1
    const box = new THREE.Box3().setFromObject(new THREE.Mesh(geo));
    const size = box.getSize(new THREE.Vector3());
    const fit = (radius * 1.4) / Math.max(size.x, size.y * 1.94);
    geo.scale(fit, fit, 1);
    geo.computeVertexNormals();
    return geo;
  }, [radius]);

  return (
    <mesh geometry={geometry} position={[0, 0, 0.18]}>
      <meshStandardMaterial
        color="#dde0e5"
        metalness={1}
        roughness={0.12}
        envMapIntensity={2.0}
      />
    </mesh>
  );
}

function Coin() {
  const group = useRef();
  const R = 2.6; // coin radius

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.28;
    }
  });

  // Brushed dark bronze texture via procedural approach
  const bronzeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5a5250',
    metalness: 0.92,
    roughness: 0.62,
    envMapIntensity: 0.9,
  }), []);

  // Polished silver rim
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cdd0d6',
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.8,
  }), []);

  // Polished inner ring
  const ringMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c8cbcf',
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.6,
  }), []);

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={group}>
        {/* Main disc body — dark brushed bronze base */}
        <mesh>
          <cylinderGeometry args={[R, R, 0.38, 128]} />
          <primitive object={bronzeMat} />
        </mesh>

        {/* Outer polished silver rim */}
        <mesh>
          <torusGeometry args={[R, 0.13, 32, 128]} />
          <primitive object={rimMat} />
        </mesh>

        {/* Inner decorative ring groove */}
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R * 0.82, R * 0.87, 128]} />
          <primitive object={ringMat} />
        </mesh>
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R * 0.82, R * 0.87, 128]} />
          <primitive object={ringMat} />
        </mesh>

        {/* Raised chrome lettering on front face */}
        <RaisedLetters radius={R * 0.72} />

        {/* Subtle highlight on top edge */}
        <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R * 0.88, R, 128]} />
          <meshStandardMaterial color="#e8eaed" metalness={1} roughness={0.15} envMapIntensity={1.4} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Emblem3D() {
  return (
    <div className="emblem-canvas" data-lenis-prevent>
      <Canvas
        camera={{ position: [0, 2.5, 7], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <spotLight position={[6, 10, 8]} angle={0.3} penumbra={1} intensity={3.0} castShadow />
          <spotLight position={[-5, 6, 5]} angle={0.4} penumbra={1} intensity={1.6} color="#fff8f0" />
          <pointLight position={[0, -4, 4]} intensity={0.8} color="#aab0bb" />
          <Coin />
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.85}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
