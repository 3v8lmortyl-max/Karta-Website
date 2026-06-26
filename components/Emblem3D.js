'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function Medallion() {
  const group = useRef();
  const logo = useLoader(THREE.TextureLoader, '/karta-logo.png');
  logo.anisotropy = 8;

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25; // slow idle spin
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group}>
        {/* Brushed metal disc */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.2, 2.2, 0.22, 80]} />
          <meshStandardMaterial
            color="#171717"
            metalness={0.9}
            roughness={0.28}
          />
        </mesh>
        {/* Raised rim */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.2, 0.07, 24, 80]} />
          <meshStandardMaterial color="#c4973a" metalness={1} roughness={0.25} />
        </mesh>
        {/* Logo on front face */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.0, 1.55]} />
          <meshStandardMaterial
            map={logo}
            transparent
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
        {/* Logo on back face */}
        <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.0, 1.55]} />
          <meshStandardMaterial
            map={logo}
            transparent
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Emblem3D() {
  return (
    <div className="emblem-canvas">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 42 }} dpr={[1, 2]} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[6, 8, 6]} angle={0.3} penumbra={1} intensity={2.2} castShadow />
          <pointLight position={[-6, -4, -4]} intensity={0.8} color="#c4973a" />
          <Medallion />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
            rotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
