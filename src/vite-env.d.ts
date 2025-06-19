/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'click-spark': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module 'meshline' {
  import { MeshLineGeometry } from 'meshline/dist/MeshLineGeometry';
  import { MeshLineMaterial } from 'meshline/dist/MeshLineMaterial';
  import { raycast } from 'meshline/dist/raycast';
  export { MeshLineGeometry, MeshLineMaterial, raycast };
}

import { Object3DNode, MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

