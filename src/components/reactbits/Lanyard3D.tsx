import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import { Vector3, Line as ThreeLine } from 'three';

export interface Lanyard3DProps {
  children?: React.ReactNode;
  className?: string;
  canvasClassName?: string;
}

const RopeCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const leftAnchor = useRef<RapierRigidBody | null>(null);
  const rightAnchor = useRef<RapierRigidBody | null>(null);
  const card = useRef<RapierRigidBody | null>(null);
  const leftLine = useRef<ThreeLine | null>(null);
  const rightLine = useRef<ThreeLine | null>(null);

  useSphericalJoint(leftAnchor, card, [[0, 0, 0], [-0.5, 0.6, 0]]);
  useSphericalJoint(rightAnchor, card, [[0, 0, 0], [0.5, 0.6, 0]]);

  useFrame(() => {
    if (!card.current || !leftAnchor.current || !rightAnchor.current) return;
    const leftPos = leftAnchor.current.translation();
    const rightPos = rightAnchor.current.translation();
    const cardPos = card.current.translation();
    if (leftLine.current) {
      leftLine.current.points = [
        new Vector3(leftPos.x, leftPos.y, leftPos.z),
        new Vector3(cardPos.x - 0.5, cardPos.y + 0.6, cardPos.z),
      ];
    }
    if (rightLine.current) {
      rightLine.current.points = [
        new Vector3(rightPos.x, rightPos.y, rightPos.z),
        new Vector3(cardPos.x + 0.5, cardPos.y + 0.6, cardPos.z),
      ];
    }
  });

  return (
    <>
      <RigidBody type="fixed" ref={leftAnchor} position={[-0.5, 1.8, 0]} />
      <RigidBody type="fixed" ref={rightAnchor} position={[0.5, 1.8, 0]} />
      <Line ref={leftLine} color="black" lineWidth={1} points={[new Vector3(), new Vector3()]} />
      <Line ref={rightLine} color="black" lineWidth={1} points={[new Vector3(), new Vector3()]} />
      <RigidBody
        ref={card}
        colliders="cuboid"
        restitution={0.2}
        position={[0, 1, 0]}
        rotation={[0, 0, 0]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1.2, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <Html center transform occlude>
          <div className="w-80 max-w-full">
            {children}
          </div>
        </Html>
      </RigidBody>
    </>
  );
};

const Lanyard3D: React.FC<Lanyard3DProps> = ({ children, className, canvasClassName }) => {
  return (
    <div className={className}>
      <Canvas className={canvasClassName} camera={{ position: [0, 1.5, 4], fov: 50 }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Physics gravity={[0, -9.81, 0]}>
          <RopeCard>{children}</RopeCard>
        </Physics>
      </Canvas>
    </div>
  );
};

export default Lanyard3D;
