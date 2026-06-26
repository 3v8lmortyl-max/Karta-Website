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
    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${KARTA_LOGO_PATH}"/></svg>`;
    const data = new SVGLoader().parse(svgMarkup);

    const shapes = [];
    data.paths.forEach((p) => {
      SVGLoader.createShapes(p).forEach((s) => shapes.push(s));
    });

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
      curveSegments: 26,
    });
    // SVGLoader uses y-down; flip Y once so the script reads correctly (not mirrored)
    geo.scale(1, -1, 1);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.55}>
      <mesh ref={ref} geometry={geometry}>
        {/* Polished aged-silver finish like the reference render */}
        <meshStandardMaterial
          color="#cdd0d4"
          metalness={1}
          roughness={0.28}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function Emblem3D() {
  return (
    <div className="emblem-canvas" data-lenis-prevent>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <spotLight position={[8, 10, 8]} angle={0.3} penumbra={1} intensity={2.8} />
          <spotLight position={[-6, 4, 6]} angle={0.4} penumbra={1} intensity={1.4} color="#fff6e6" />
          <pointLight position={[-8, -6, -4]} intensity={1} color="#b9bcc2" />
          <Center>
            <LogoMesh />
          </Center>
          <Environment preset="studio" />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.9}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
