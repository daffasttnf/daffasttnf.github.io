declare module 'typewriter-effect' {
  import { ReactElement } from 'react';

  interface TypewriterOptions {
    strings: string[];
    autoStart?: boolean;
    loop?: boolean;
    delay?: number;
    deleteSpeed?: number;
    cursor?: string;
  }

  interface TypewriterProps {
    options: TypewriterOptions;
    onInit?: (typewriter: any) => void;
  }

  export function Typewriter(props: TypewriterProps): ReactElement;
}