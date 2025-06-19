import React from 'react';
import { cn } from '@/lib/utils';

export interface LanyardProps {
  className?: string;
}

const Lanyard: React.FC<LanyardProps> = ({ className }) => {
  return (
    <div className={cn('flex flex-col items-center animate-swing origin-top', className)}>
      <div className="flex gap-1 h-16">
        <div className="w-1 bg-israel-blue rounded" />
        <div className="w-1 bg-israel-blue rounded" />
      </div>
      <div className="w-24 h-16 bg-white border-2 border-israel-blue rounded shadow-lg overflow-hidden flex flex-col">
        <div className="h-2 w-full bg-israel-blue" />
        <div className="flex-1 flex items-center justify-center text-2xl text-israel-blue">
          ✡
        </div>
        <div className="h-2 w-full bg-israel-blue" />
      </div>
    </div>
  );
};

export default Lanyard;
