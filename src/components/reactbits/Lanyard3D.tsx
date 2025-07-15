/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Lanyard3D({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  children
}: {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative z-50 w-full h-[400px] flex justify-center items-start transform scale-100 origin-center pointer-events-auto">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band>{children}</Band>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, children }: {
  maxSpeed?: number;
  minSpeed?: number;
  children?: React.ReactNode;
}) {
  const band = useRef<any>(), fixed = useRef<any>(), j1 = useRef<any>(), j2 = useRef<any>(), j3 = useRef<any>(), card = useRef<any>();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
  const segmentProps = { type: 'dynamic' as const, canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]));

  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.50, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e: any) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            {/* Card Background */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 2.25, 0.02]} />
              <meshPhysicalMaterial
                color="white"
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>

            {/* Blue Header Stripe */}
            <mesh position={[0, 0.9, 0.01]}>
              <boxGeometry args={[1.6, 0.2, 0.01]} />
              <meshPhysicalMaterial color="#0066cc" />
            </mesh>

            {/* Blue Footer Stripe */}
            <mesh position={[0, -0.9, 0.01]}>
              <boxGeometry args={[1.6, 0.2, 0.01]} />
              <meshPhysicalMaterial color="#0066cc" />
            </mesh>

            {/* Content Area */}
            <group position={[0, 0, 0.02]}>
              {children || (
                <>
                  <Text
                    position={[0, 0.3, 0]}
                    fontSize={0.15}
                    color="#0066cc"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/inter-bold.woff"
                    maxWidth={1.4}
                  >
                    MechJobs IL
                  </Text>
                  <Text
                    position={[0, -0.1, 0]}
                    fontSize={0.08}
                    color="#333"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.4}
                    textAlign="center"
                  >
                    מציאת עבודות לסטודנטים{'\n'}להנדסת מכונות בישראל
                  </Text>
                  <Text
                    position={[0, -0.5, 0]}
                    fontSize={0.06}
                    color="#666"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.4}
                    textAlign="center"
                  >
                    היעד האחד שלך לכל הזדמנויות{'\n'}בחברות הישראליות המובילות
                  </Text>
                </>
              )}
            </group>
          </group>
        </RigidBody>
      </group>

      {/* Lanyard String */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#0066cc"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          lineWidth={2}
        />
      </mesh>
    </>
  );
}