
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface LanyardProps {
  className?: string;
  children?: React.ReactNode;
  cardClassName?: string;
}

const Lanyard: React.FC<LanyardProps> = ({ className, children, cardClassName }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lanyardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      setMousePosition({ x: mouseX, y: mouseY });
      
      // Create 3D rotation based on mouse position
      const rotateX = (mouseY / rect.height) * -30;
      const rotateY = (mouseX / rect.width) * 30;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
      setIsHovered(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const cardStyle = {
    transform: isHovered 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(20px) scale(1.05)`
      : `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)`,
    transition: isPressed 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const lanyardStyle = {
    transform: isHovered 
      ? `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.01}px) rotate(${mousePosition.x * 0.02}deg)`
      : 'translateX(0px) translateY(0px) rotate(0deg)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div 
      ref={lanyardRef}
      className={cn('flex flex-col items-center origin-top cursor-pointer select-none', className)}
      style={lanyardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Lanyard strings with physics */}
      <div className="flex gap-1 h-16 relative">
        <div 
          className={cn(
            "w-1 bg-israel-blue rounded origin-bottom transition-all duration-500",
            isHovered ? "animate-pulse bg-gradient-to-b from-israel-blue to-blue-600" : ""
          )} 
          style={{
            transform: isHovered ? `scaleY(1.1) rotate(${mousePosition.x * 0.01}deg)` : 'scaleY(1) rotate(0deg)',
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className={cn(
            "w-1 bg-israel-blue rounded origin-bottom transition-all duration-500",
            isHovered ? "animate-pulse bg-gradient-to-b from-israel-blue to-blue-600" : ""
          )}
          style={{
            transform: isHovered ? `scaleY(1.1) rotate(${mousePosition.x * -0.01}deg)` : 'scaleY(1) rotate(0deg)',
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Floating particles effect */}
        {isHovered && (
          <>
            <div className="absolute -top-2 -left-2 w-1 h-1 bg-israel-blue rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-8 -left-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.4s' }} />
          </>
        )}
      </div>

      {/* Card with 3D physics */}
      <div
        ref={cardRef}
        className={cn(
          'bg-white border-2 border-israel-blue rounded shadow-lg overflow-hidden flex flex-col w-80 relative',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-blue-50 before:opacity-0 before:transition-opacity before:duration-300',
          isHovered ? 'before:opacity-100 shadow-2xl shadow-blue-200/50' : 'shadow-lg',
          isPressed ? 'shadow-md' : '',
          cardClassName,
        )}
        style={cardStyle}
      >
        {/* Top stripe with shimmer */}
        <div 
          className={cn(
            "h-2 w-full bg-israel-blue relative overflow-hidden",
            isHovered ? "bg-gradient-to-r from-israel-blue via-blue-400 to-israel-blue" : ""
          )}
        >
          {isHovered && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
              style={{ 
                animation: 'shimmer 2s ease-in-out infinite',
                backgroundSize: '200% 100%',
              }}
            />
          )}
        </div>
        
        {/* Content area with bounce effect */}
        <div 
          className={cn(
            "flex-1 flex items-center justify-center p-2 transition-all duration-300",
            isHovered ? "transform scale-105" : "",
            isPressed ? "transform scale-95" : ""
          )}
        >
          {children ?? (
            <div className="text-center">
              <span 
                className={cn(
                  "text-2xl text-israel-blue transition-all duration-300",
                  isHovered ? "text-3xl animate-bounce" : ""
                )}
              >
                ✡
              </span>
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-israel-blue/20 text-6xl animate-ping">✡</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Bottom stripe with shimmer */}
        <div 
          className={cn(
            "h-2 w-full bg-israel-blue relative overflow-hidden",
            isHovered ? "bg-gradient-to-r from-israel-blue via-blue-400 to-israel-blue" : ""
          )}
        >
          {isHovered && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ 
                animation: 'shimmer 2s ease-in-out infinite 0.5s',
                backgroundSize: '200% 100%',
              }}
            />
          )}
        </div>

        {/* Glowing edge effect */}
        {isHovered && (
          <div className="absolute inset-0 border-2 border-blue-300/50 rounded animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Add custom keyframes for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Lanyard;
