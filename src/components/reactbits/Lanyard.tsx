import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, useRopeJoint, type RapierRigidBody } from '@react-three/rapier';
import { GLTF } from 'three-stdlib';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

import cardGLB from './card.glb';

extend({ MeshLineGeometry, MeshLineMaterial });

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
}

interface RopeProps {
  start: React.RefObject<THREE.Object3D>;
  end: React.RefObject<THREE.Object3D>;
}

const Rope: React.FC<RopeProps> = ({ start, end }) => {
  const geom = useRef<MeshLineGeometry>(null!);
  const pts = useMemo(() => [new THREE.Vector3(), new THREE.Vector3()], []);
  useFrame(() => {
    if (!start.current || !end.current) return;
    pts[0].setFromMatrixPosition(start.current.matrixWorld);
    pts[1].setFromMatrixPosition(end.current.matrixWorld);
    geom.current.setPoints(pts);
  });
  return (
    <mesh raycast={raycast} frustumCulled={false}>
      {/* @ts-expect-error meshline types */}
      <meshLineGeometry ref={geom} />
      {/* @ts-expect-error meshline types */}
      <meshLineMaterial lineWidth={0.15} color="black" />
    </mesh>
  );
};

const Card: React.FC<{ cardRef: React.RefObject<RapierRigidBody>; className?: string; }> = ({ cardRef, className, children }) => {
  const gltf = useGLTF(cardGLB) as GLTF;
  const scene = gltf?.scene as THREE.Object3D | undefined;

  return (
    <RigidBody ref={cardRef} colliders="hull" restitution={0.7} friction={0.5} position={[0, 0, 0]}>
      {scene ? <primitive object={scene} dispose={null} /> : (
        <mesh>
          <boxGeometry args={[1.6, 2.4, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      )}
      <Html
        transform
        occlude
        pointerEvents="auto"
        position={[0, 0, 0.06]}
        className={cn('select-none text-center', className)}
      >
        {children}
      </Html>
    </RigidBody>
  );
};

const Lanyard: React.FC<LanyardProps> = ({ className, children, cardClassName }) => {
  const left = useRef<RapierRigidBody>(null);
  const right = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  // Attach the card with rope joints to two fixed anchor points
  useRopeJoint(left, card, [[0, 0, 0], [-0.5, 1.2, 0], 1.2]);
  useRopeJoint(right, card, [[0, 0, 0], [0.5, 1.2, 0], 1.2]);

  return (
    <div className={cn('relative w-[22rem] h-[28rem]', className)}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <Physics gravity={[0, -9.81, 0]}>
            <RigidBody ref={left} type="fixed" position={[-0.5, 1.8, 0]} />
            <RigidBody ref={right} type="fixed" position={[0.5, 1.8, 0]} />
            <Card cardRef={card} className={cardClassName}>{children}</Card>
            <Rope start={left} end={card} />
            <Rope start={right} end={card} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Lanyard;

