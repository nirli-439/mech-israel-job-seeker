import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { Physics, RigidBody, useSphericalJoint, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import cardGLB from './card.glb';
import lanyardTextureSrc from './lanyard.png';
import { cn } from '@/lib/utils';

extend({ MeshLineGeometry, MeshLineMaterial });

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
}

const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="p-4 bg-white rounded shadow">Loading...</div>
  </Html>
);

const SEGMENTS = 4;

const Rope: React.FC<{ cardRef: React.RefObject<RapierRigidBody>; anchorRef: React.RefObject<RapierRigidBody> }> = ({ cardRef, anchorRef }) => {
  const segmentRefs = useMemo(
    () => Array.from({ length: SEGMENTS }, () => React.createRef<RapierRigidBody>()),
    []
  );
  // Create joints between anchor and segments
  useSphericalJoint(anchorRef, segmentRefs[0], [[0, 0, 0], [0, 0, 0]]);
  useSphericalJoint(segmentRefs[0], segmentRefs[1], [[0, 0, 0], [0, 0, 0]]);
  useSphericalJoint(segmentRefs[1], segmentRefs[2], [[0, 0, 0], [0, 0, 0]]);
  useSphericalJoint(segmentRefs[2], segmentRefs[3], [[0, 0, 0], [0, 0, 0]]);
  useSphericalJoint(segmentRefs[3], cardRef, [[0, 0, 0], [0, 0.4, 0]]);

  const lineRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<MeshLineGeometry>(new MeshLineGeometry());
  const texture = useMemo(() => new THREE.TextureLoader().load(lanyardTextureSrc), []);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame(() => {
    const pts: THREE.Vector3[] = [];
    if (anchorRef.current) {
      const t = anchorRef.current.translation();
      pts.push(new THREE.Vector3(t.x, t.y, t.z));
    }
    segmentRefs.forEach((r) => {
      if (r.current) {
        const t = r.current.translation();
        pts.push(new THREE.Vector3(t.x, t.y, t.z));
      }
    });
    if (cardRef.current) {
      const t = cardRef.current.translation();
      pts.push(new THREE.Vector3(t.x, t.y + 0.4, t.z));
    }
    geometryRef.current.setPoints(pts);
  });

  return (
    <group>
      {segmentRefs.map((ref, i) => (
        <RigidBody
          ref={ref}
          colliders="ball"
          mass={0.1}
          linearDamping={0.5}
          angularDamping={0.5}
          position={[0, 1.2 - i * 0.2, 0]}
          key={i}
        >
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.02]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </RigidBody>
      ))}
      <mesh ref={lineRef} raycast={raycast}>
        <primitive attach="geometry" object={geometryRef.current} />
        <meshLineMaterial attach="material" map={texture} lineWidth={0.1} color="white" />
      </mesh>
    </group>
  );
};

const CardModel: React.FC<{ cardRef: React.RefObject<RapierRigidBody>; className?: string; children?: React.ReactNode }> = ({ cardRef, className, children }) => {
  const gltf = useGLTF(cardGLB, true);
  const scene = gltf?.scene;
  if (!scene) {
    return (
      <RigidBody ref={cardRef} colliders="cuboid" restitution={0.5} position={[0, 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 1, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        {children && (
          <Html transform occlude="blending" wrapperClass={className} position={[0, 0, 0.06]}>
            {children}
          </Html>
        )}
      </RigidBody>
    );
  }
  return (
    <RigidBody ref={cardRef} colliders="trimesh" restitution={0.5} position={[0, 0.2, 0]}>
      <primitive object={scene} dispose={null} />
      {children && (
        <Html transform occlude="blending" wrapperClass={className} position={[0, 0, 0.06]}>
          {children}
        </Html>
      )}
    </RigidBody>
  );
};

const Lanyard: React.FC<LanyardProps> = ({ className, children, cardClassName }) => {
  const anchorRef = useRef<RapierRigidBody>(null);
  const cardRef = useRef<RapierRigidBody>(null);
  return (
    <div className={cn('w-full h-96', className)}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Suspense fallback={<LoadingFallback />}>
          <Physics gravity={[0, -9.81, 0]}>
            <RigidBody type="fixed" position={[0, 1.5, 0]} ref={anchorRef} />
            <Rope cardRef={cardRef} anchorRef={anchorRef} />
            <CardModel cardRef={cardRef} className={cardClassName}>
              {children}
            </CardModel>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(cardGLB);

export default Lanyard;
