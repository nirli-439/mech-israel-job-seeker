import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useGLTF, useTexture } from '@react-three/drei';
import { Physics, RigidBody, useSphericalJoint, BallCollider, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import cardGLB from './card.glb';
import lanyardImage from './lanyard.png';

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
}

class ModelErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="p-2 text-red-500">Failed to load assets</div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function CardModel({ children, cardClassName }: { children?: React.ReactNode; cardClassName?: string }) {
  // Load GLB model
  const gltf = useGLTF(cardGLB) as { scene?: THREE.Object3D };
  const scene = useMemo<THREE.Object3D | undefined>(() => gltf.scene?.clone(), [gltf]);

  return (
    <group>
      {/* Fallback box if GLB failed */}
      {scene ? (
        <primitive object={scene} dispose={null} />
      ) : (
        <mesh>
          <boxGeometry args={[1, 1.4, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
      {/* HTML content on front of card */}
      <Html
        transform
        sprite
        position={[0, 0, 0.055]}
        className={cn('pointer-events-auto', cardClassName)}
      >
        {children}
      </Html>
    </group>
  );
}

function RopeWithCard({ children, cardClassName }: { children?: React.ReactNode; cardClassName?: string }) {
  const topRef = useRef(null);
  const midRef = useRef(null);
  const cardRef = useRef(null);

  // Connect the rigid bodies with spherical joints for swinging motion
  useSphericalJoint(topRef, midRef, [ [0, 0, 0], [0, 0.15, 0] ]);
  useSphericalJoint(midRef, cardRef, [ [0, -0.15, 0], [0, 0.8, 0] ]);

  return (
    <group>
      <RigidBody ref={topRef} type="fixed" position={[0, 1.6, 0]} />

      <RigidBody ref={midRef} colliders={false} position={[0, 1.3, 0]}>
        <BallCollider args={[0.03]} />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial map={useTexture(lanyardImage)} />
        </mesh>
      </RigidBody>

      <RigidBody ref={cardRef} colliders={false} position={[0, 0.3, 0]}>
        <CuboidCollider args={[0.5, 0.7, 0.05]} />
        <CardModel cardClassName={cardClassName}>{children}</CardModel>
      </RigidBody>
    </group>
  );
}

const Lanyard: React.FC<LanyardProps> = ({ className, children, cardClassName }) => {
  return (
    <div className={cn('w-full flex justify-center', className)}>
      <Canvas style={{ height: '20rem', width: '20rem' }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 4, 2]} intensity={0.8} />
        <Suspense
          fallback={
            <Html center>
              <div className="p-2 text-sm">Loading...</div>
            </Html>
          }
        >
          <Physics gravity={[0, -9.81, 0]}>
            <ModelErrorBoundary>
              <RopeWithCard cardClassName={cardClassName}>{children}</RopeWithCard>
            </ModelErrorBoundary>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(cardGLB);

export default Lanyard;
