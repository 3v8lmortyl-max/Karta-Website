'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Rotating metal coin that uses the Karta medallion artwork as its face.
function Coin() {
  const group = useRef();
  const texture = useLoader(THREE.TextureLoader, '/karta-emblem.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });

  const R = 2.1;   // radius
  const T = 0.26;  // thickness

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.45}>
      <group ref={group} rotation={[0.18, 0, 0]}>
        {/* Edge / rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R, R, T, 96]} />
          <meshStandardMaterial color="#4a4440" metalness={1} roughness={0.4} envMapIntensity={1.1} />
        </mesh>

        {/* Front face — medallion artwork */}
        <mesh position={[0, 0, T / 2 + 0.002]}>
          <circleGeometry args={[R, 96]} />
          <meshStandardMaterial map={texture} transparent metalness={0.5} roughness={0.45} envMapIntensity={1.0} />
        </mesh>

        {/* Back face — mirrored */}
        <mesh position={[0, 0, -T / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[R, 96]} />
          <meshStandardMaterial map={texture} transparent metalness={0.5} roughness={0.45} envMapIntensity={1.0} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Emblem3D() {
  return (
    <div className="emblem-canvas" data-lenis-prevent>
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.65} />
          <spotLight position={[5, 8, 6]} angle={0.35} penumbra={1} intensity={2.2} />
          <spotLight position={[-5, 4, 5]} angle={0.4} penumbra={1} intensity={1.1} color="#fff6ec" />
          <pointLight position={[0, -4, 4]} intensity={0.5} color="#aab0bb" />
          <Coin />
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
