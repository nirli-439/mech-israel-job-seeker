import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface BallpitBackgroundProps {
  amount?: number;
  colors?: string[];
}

const BallpitBackground: React.FC<BallpitBackgroundProps> = ({
  amount = 40,
  colors = ["#FF6B6B", "#F7B801", "#6BCB77", "#4D96FF"],
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const spheres: THREE.Mesh[] = [];
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < amount; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 1.2 + 0.3, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.5,
        metalness: 0.1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 40,
      );
      spheres.push(sphere);
      velocities.push(
        new THREE.Vector3(
          Math.random() * 0.5 - 0.25,
          Math.random() * 0.5 - 0.25,
          Math.random() * 0.5 - 0.25,
        ),
      );
      scene.add(sphere);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(0, 0, 50);
    scene.add(light);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    const limit = 20;
    const animate = () => {
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        const v = velocities[i];
        s.position.add(v);
        if (s.position.x > limit || s.position.x < -limit) v.x *= -1;
        if (s.position.y > limit || s.position.y < -limit) v.y *= -1;
        if (s.position.z > limit || s.position.z < -limit) v.z *= -1;
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      mount.removeChild(renderer.domElement);
      spheres.forEach((s) => s.geometry.dispose());
    };
  }, [amount, colors]);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -10 }} />;
};

export default BallpitBackground;
