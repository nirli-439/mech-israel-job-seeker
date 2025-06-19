import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ShinyButton: React.FC<ButtonProps> = ({ className, children, ...props }) => (
  <Button
    className={cn(
      'relative overflow-hidden bg-israel-gradient text-white before:absolute before:left-[-100%] before:top-0 before:h-full before:w-[120%] before:bg-white/40 before:rotate-45 hover:before:animate-glare',
      className,
    )}
    {...props}
  >
    {children}
  </Button>
);

export default ShinyButton;
