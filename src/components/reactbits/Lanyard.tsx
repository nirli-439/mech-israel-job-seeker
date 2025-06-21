
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier';
import { Environment, Lightformer, Html } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

const Lanyard: React.FC<LanyardProps> = ({ 
  className, 
  children, 
  cardClassName,
  position = [0, 0, 8],
  gravity = [0, -20, 0],
  fov = 25,
  transparent = true
}) => {
  return (
    <div className={cn('relative w-full h-96 cursor-grab active:cursor-grabbing', className)}>
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <Physics gravity={gravity} timeStep={1 / 60}>
            <SimpleLanyardBand cardClassName={cardClassName}>
              {children}
            </SimpleLanyardBand>
          </Physics>
          <Environment blur={0.75}>
            <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
};

function SimpleLanyardBand({ children, cardClassName }: { 
  children?: React.ReactNode; 
  cardClassName?: string;
}) {
  const card = useRef<any>(null);
  const rope1 = useRef<any>(null);
  const rope2 = useRef<any>(null);
  const rope3 = useRef<any>(null);
  
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  // Handle cursor changes
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  // Simple animation loop without complex rope physics
  useFrame((state) => {
    if (dragged && card.current) {
      // Calculate mouse position in 3D space
      const vec = new THREE.Vector3();
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      const dir = vec.clone().sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      // Move card to mouse position with offset
      const dragOffset = dragged as THREE.Vector3;
      card.current.setNextKinematicTranslation({ 
        x: vec.x - dragOffset.x, 
        y: vec.y - dragOffset.y, 
        z: vec.z - dragOffset.z 
      });
    }

    // Simple rope segment positioning
    if (card.current && rope1.current && rope2.current && rope3.current) {
      const cardPos = card.current.translation();
      
      // Position rope segments to create a simple chain effect
      rope3.current.setNextKinematicTranslation({
        x: cardPos.x * 0.8,
        y: cardPos.y + 1,
        z: cardPos.z * 0.8
      });

      rope2.current.setNextKinematicTranslation({
        x: cardPos.x * 0.6,
        y: cardPos.y + 2,
        z: cardPos.z * 0.6
      });

      rope1.current.setNextKinematicTranslation({
        x: cardPos.x * 0.4,
        y: cardPos.y + 3,
        z: cardPos.z * 0.4
      });
    }
  });

  return (
    <>
      {/* Simplified rope segments */}
      <RigidBody ref={rope1} type="kinematicPosition" position={[0, 3.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
      </RigidBody>

      <RigidBody ref={rope2} type="kinematicPosition" position={[0, 2.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
      </RigidBody>

      <RigidBody ref={rope3} type="kinematicPosition" position={[0, 1.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
      </RigidBody>
      
      {/* Interactive card */}
      <RigidBody 
        position={[0, 0, 0]} 
        ref={card} 
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        canSleep={true}
        colliders={false}
        angularDamping={2}
        linearDamping={2}
      >
        <CuboidCollider args={[0.8, 1.125, 0.01]} />
        <group
          scale={1.5}
          position={[0, -1.2, -0.05]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerUp={(e) => {
            (e.target as any).releasePointerCapture(e.pointerId);
            setDragged(false);
          }}
          onPointerDown={(e) => {
            (e.target as any).setPointerCapture(e.pointerId);
            const cardPos = new THREE.Vector3().copy(card.current.translation());
            setDragged(new THREE.Vector3().copy((e as any).point).sub(cardPos));
          }}
        >
          {/* Card mesh */}
          <mesh>
            <boxGeometry args={[1.6, 2.25, 0.02]} />
            <meshPhysicalMaterial 
              color="#ffffff"
              clearcoat={1}
              clearcoatRoughness={0.1}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
          
          {/* Card content */}
          <group position={[0, 0, 0.02]}>
            {/* Blue stripes */}
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[1.6, 0.2, 0.005]} />
              <meshStandardMaterial color="#0038b8" />
            </mesh>
            <mesh position={[0, -1, 0]}>
              <boxGeometry args={[1.6, 0.2, 0.005]} />
              <meshStandardMaterial color="#0038b8" />
            </mesh>
            
            {/* Content area */}
            <group position={[0, 0, 0.01]}>
              {children ? (
                <Html
                  transform
                  distanceFactor={10}
                  position={[0, 0, 0]}
                  style={{
                    width: '160px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#0038b8',
                    textAlign: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <div className={cn('p-2', cardClassName)}>
                    {children}
                  </div>
                </Html>
              ) : (
                <mesh>
                  <boxGeometry args={[0.3, 0.3, 0.005]} />
                  <meshStandardMaterial color="#0038b8" />
                </mesh>
              )}
            </group>
          </group>
          
          {/* Clip/ring at top */}
          <mesh position={[0, 1.5, 0]}>
            <torusGeometry args={[0.1, 0.02, 8, 16]} />
            <meshStandardMaterial 
              color="#666666"
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}

export default Lanyard;
