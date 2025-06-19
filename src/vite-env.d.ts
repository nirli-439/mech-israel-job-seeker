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

declare module '*.png' {
  const src: string;
  export default src;
}

