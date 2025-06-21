
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
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
  fov = 25,
  transparent = true
}) => {
  return (
    <div className={cn('relative w-full h-96 cursor-grab active:cursor-grabbing', className)}>
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <StaticLanyard cardClassName={cardClassName}>
            {children}
          </StaticLanyard>
        </Suspense>
      </Canvas>
    </div>
  );
};

function StaticLanyard({ children, cardClassName }: {
  children?: React.ReactNode;
  cardClassName?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Simple rotation animation when not dragging
  useFrame((state) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.y = rotation.y + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.x = rotation.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    (event.target as Element).setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging && groupRef.current) {
      const deltaX = (event.clientX - dragStart.x) * 0.01;
      const deltaY = (event.clientY - dragStart.y) * 0.01;
      
      const newRotation = {
        x: rotation.x + deltaY,
        y: rotation.y + deltaX
      };
      
      setRotation(newRotation);
      groupRef.current.rotation.set(newRotation.x, newRotation.y, 0);
    }
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    setIsDragging(false);
    (event.target as Element).releasePointerCapture(event.pointerId);
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Static rope segments */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
      
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
      
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
      
      {/* Interactive card */}
      <group
        position={[0, -0.5, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Card base */}
        <mesh>
          <boxGeometry args={[1.6, 2.25, 0.02]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        
        {/* Blue stripes */}
        <mesh position={[0, 1, 0.02]}>
          <boxGeometry args={[1.6, 0.2, 0.005]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
        <mesh position={[0, -1, 0.02]}>
          <boxGeometry args={[1.6, 0.2, 0.005]} />
          <meshStandardMaterial color="#0038b8" />
        </mesh>
        
        {/* Content area */}
        {children && (
          <Html
            transform
            distanceFactor={10}
            position={[0, 0, 0.03]}
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
        )}
        
        {/* Ring at top */}
        <mesh position={[0, 1.3, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 16]} />
          <meshStandardMaterial 
            color="#666666"
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      </group>
    </group>
  );
}

export default Lanyard;
