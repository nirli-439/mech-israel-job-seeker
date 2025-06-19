import React from 'react';
import { cn } from '@/lib/utils';

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
}

const Lanyard: React.FC<LanyardProps> = ({ className, children, cardClassName }) => {
  return (
    <div className={cn('flex flex-col items-center animate-swing origin-top', className)}>
      <div className="flex gap-1 h-16">
        <div className="w-1 bg-israel-blue rounded" />
        <div className="w-1 bg-israel-blue rounded" />
      </div>
      <div
        className={cn(
          'bg-white border-2 border-israel-blue rounded shadow-lg overflow-hidden flex flex-col w-80',
          cardClassName,
        )}
      >
        <div className="h-2 w-full bg-israel-blue" />
        <div className="flex-1 flex items-center justify-center p-2">
          {children ?? <span className="text-2xl text-israel-blue">✡</span>}
        </div>
        <div className="h-2 w-full bg-israel-blue" />
      </div>
    </div>
  );
};

export default Lanyard;
