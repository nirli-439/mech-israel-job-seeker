import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';

export interface LanyardProps {
  className?: string;
}

const Lanyard: React.FC<LanyardProps> = ({ className }) => {
  const [{ x, y, rotateZ }, api] = useSpring(() => ({ x: 0, y: 0, rotateZ: 0 }));

  const bind = useDrag(({ movement: [mx, my], down }) => {
    api.start({
      x: down ? mx : 0,
      y: down ? my : 0,
      rotateZ: down ? mx / 4 : 0,
      immediate: down,
      config: { tension: 200, friction: 20 },
    });
  });

  return (
    <animated.div
      {...bind()}
      className={cn(
        'flex flex-col items-center origin-top cursor-grab active:cursor-grabbing',
        className,
      )}
      style={{ x, y, rotateZ }}
    >
      <div className="flex gap-1 h-24">
        <div className="w-1.5 bg-israel-blue rounded" />
        <div className="w-1.5 bg-israel-blue rounded" />
      </div>
      <div className="w-40 h-24 bg-white border-2 border-israel-blue rounded shadow-lg overflow-hidden flex flex-col">
        <div className="h-3 w-full bg-israel-blue" />
        <div className="flex-1 flex items-center justify-center text-4xl text-israel-blue">
          ✡
        </div>
        <div className="h-3 w-full bg-israel-blue" />
      </div>
    </animated.div>
  );
};

export default Lanyard;
