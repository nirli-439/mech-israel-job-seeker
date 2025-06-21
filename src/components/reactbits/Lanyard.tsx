
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, BallCollider, CuboidCollider, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
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
            <LanyardBand cardClassName={cardClassName}>
              {children}
            </LanyardBand>
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

function LanyardBand({ children, cardClassName, maxSpeed = 50, minSpeed = 10 }: { 
  children?: React.ReactNode; 
  cardClassName?: string;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);
  
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const segmentProps = { 
    type: 'dynamic' as const, 
    canSleep: true, 
    colliders: false as const, 
    angularDamping: 2, 
    linearDamping: 2 
  };
  
  const [curve] = useState(() => 
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(), 
      new THREE.Vector3(), 
      new THREE.Vector3(), 
      new THREE.Vector3()
    ])
  );
  
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  // Create rope joints
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  // Handle cursor changes
  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  // Animation loop
  useFrame((state, delta) => {
    if (dragged && card.current) {
      // Calculate mouse position in 3D space
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      
      // Wake up physics bodies
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      
      // Move card to mouse position
      const dragOffset = dragged as THREE.Vector3;
      card.current.setNextKinematicTranslation({ 
        x: vec.x - dragOffset.x, 
        y: vec.y - dragOffset.y, 
        z: vec.z - dragOffset.z 
      });
    }

    // Update rope visualization
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      // Smooth rope movement
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      // Update curve points
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      
      // Update rope geometry using TubeGeometry for better Three.js compatibility
      if (band.current?.geometry) {
        const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.02, 8, false);
        band.current.geometry.dispose();
        band.current.geometry = tubeGeometry;
      }

      // Add rotation damping to card
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ 
        x: ang.x, 
        y: ang.y - rot.y * 0.25, 
        z: ang.z 
      });
    }
  });

  // Configure curve
  curve.curveType = 'chordal';

  return (
    <>
      {/* Physics chain */}
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.05]} />
        </RigidBody>
        
        {/* Interactive card */}
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
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
      </group>

      {/* Lanyard rope using a simple cylinder initially */}
      <mesh ref={band}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#0038b8" />
      </mesh>
    </>
  );
}

export default Lanyard;
