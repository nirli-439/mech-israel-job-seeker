import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SimpleLanyard3DProps {
  className?: string;
}

const SimpleLanyard3D: React.FC<SimpleLanyard3DProps> = ({ className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const animationRef = useRef<number>();

  // Get viewport dimensions for full-screen bouncing
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateViewport = () => {
      setViewport({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Physics simulation with full-screen bouncing
  useEffect(() => {
    if (!isDragging) {
      const animate = () => {
        setCardPosition(prev => {
          let newX = prev.x + velocity.x;
          let newY = prev.y + velocity.y;
          
          // Rope constraint - maximum distance from attachment point
          const attachmentX = viewport.width / 2;
          const attachmentY = 50;
          const maxRopeLength = Math.min(viewport.width * 0.8, viewport.height * 0.8);
          
          const distanceFromAttachment = Math.sqrt(
            Math.pow(newX - attachmentX, 2) + Math.pow(newY - attachmentY, 2)
          );
          
          if (distanceFromAttachment > maxRopeLength) {
            const angle = Math.atan2(newY - attachmentY, newX - attachmentX);
            newX = attachmentX + Math.cos(angle) * maxRopeLength;
            newY = attachmentY + Math.sin(angle) * maxRopeLength;
            
            // Bounce off rope constraint
            setVelocity(vel => ({
              x: vel.x * -0.6,
              y: vel.y * -0.6
            }));
          }
          
          // Bounce off screen edges
          const cardWidth = 320;
          const cardHeight = 200;
          
          if (newX <= cardWidth / 2 || newX >= viewport.width - cardWidth / 2) {
            setVelocity(vel => ({ x: vel.x * -0.8, y: vel.y * 0.95 }));
            newX = Math.max(cardWidth / 2, Math.min(viewport.width - cardWidth / 2, newX));
          }
          
          if (newY <= cardHeight / 2 || newY >= viewport.height - cardHeight / 2) {
            setVelocity(vel => ({ x: vel.x * 0.95, y: vel.y * -0.8 }));
            newY = Math.max(cardHeight / 2, Math.min(viewport.height - cardHeight / 2, newY));
          }
          
          // Apply gravity and air resistance
          setVelocity(vel => ({
            x: vel.x * 0.995, // air resistance
            y: vel.y * 0.995 + 0.3 // gravity + air resistance
          }));
          
          // Spring back to center when velocity is low
          if (Math.abs(velocity.x) < 1 && Math.abs(velocity.y) < 1) {
            const centerX = viewport.width / 2;
            const centerY = viewport.height / 3;
            const springForce = 0.01;
            
            setVelocity(vel => ({
              x: vel.x + (centerX - newX) * springForce,
              y: vel.y + (centerY - newY) * springForce
            }));
          }
          
          return { x: newX, y: newY };
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, velocity, viewport]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Check rope constraint during drag
      const attachmentX = viewport.width / 2;
      const attachmentY = 50;
      const maxRopeLength = Math.min(viewport.width * 0.8, viewport.height * 0.8);
      
      const distance = Math.sqrt(
        Math.pow(newX - attachmentX, 2) + Math.pow(newY - attachmentY, 2)
      );
      
      if (distance <= maxRopeLength) {
        setCardPosition({ x: newX, y: newY });
      } else {
        const angle = Math.atan2(newY - attachmentY, newX - attachmentX);
        setCardPosition({
          x: attachmentX + Math.cos(angle) * maxRopeLength,
          y: attachmentY + Math.sin(angle) * maxRopeLength
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Add release velocity for realistic physics
      setVelocity({ 
        x: (Math.random() - 0.5) * 8, 
        y: Math.random() * 4 + 2 
      });
      document.body.style.cursor = 'auto';
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, viewport]);

  // Calculate rope properties
  const attachmentX = viewport.width / 2;
  const attachmentY = 50;
  const ropeLength = Math.sqrt(
    Math.pow(cardPosition.x - attachmentX, 2) + Math.pow(cardPosition.y - attachmentY, 2)
  );
  const ropeAngle = Math.atan2(cardPosition.y - attachmentY, cardPosition.x - attachmentX) * (180 / Math.PI);
  
  // Card rotation based on movement and physics
  const cardRotationX = velocity.y * 0.5;
  const cardRotationY = velocity.x * 0.5;
  const cardRotationZ = (cardPosition.x - attachmentX) * 0.05;

  // Initialize card position
  useEffect(() => {
    if (viewport.width > 0 && cardPosition.x === 0 && cardPosition.y === 0) {
      setCardPosition({
        x: viewport.width / 2,
        y: viewport.height / 3
      });
    }
  }, [viewport]);

  return (
    <>
      {/* Full-screen container */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{ perspective: '1000px' }}
      >
        {/* Attachment Point */}
        <div 
          className="absolute w-6 h-6 bg-gray-600 rounded-full shadow-lg border-2 border-gray-400"
          style={{
            left: `${attachmentX - 12}px`,
            top: `${attachmentY - 12}px`,
          }}
        />
        
        {/* Rope/Lanyard - Fixed positioning */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 45 }}
        >
          <line
            x1={attachmentX}
            y1={attachmentY}
            x2={cardPosition.x}
            y2={cardPosition.y}
            stroke="url(#ropeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="ropeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Visitor Card */}
        <div
          ref={cardRef}
          className={cn(
            'absolute w-80 h-48 cursor-grab select-none pointer-events-auto',
            isDragging && 'cursor-grabbing',
            'transition-transform duration-200 ease-out'
          )}
          style={{
            left: `${cardPosition.x - 160}px`,
            top: `${cardPosition.y - 96}px`,
            transform: `
              rotateX(${cardRotationX}deg) 
              rotateY(${isFlipped ? 180 + cardRotationY : cardRotationY}deg) 
              rotateZ(${cardRotationZ}deg)
            `,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => {
            setIsHovered(true);
            document.body.style.cursor = 'grab';
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            if (!isDragging) {
              document.body.style.cursor = 'auto';
            }
          }}
          onDoubleClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Card Front */}
          <div 
            className={cn(
              'absolute inset-0 bg-white border-2 border-blue-600 rounded-xl shadow-2xl overflow-hidden backface-hidden',
              isHovered && 'shadow-blue-200/50 shadow-3xl'
            )}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Blue Stripe */}
            <div className="h-4 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
              {isHovered && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                  style={{ 
                    animation: 'shimmer 2s ease-in-out infinite',
                    backgroundSize: '200% 100%',
                  }}
                />
              )}
            </div>
            
            {/* Front Content */}
            <div className="p-6 text-center h-full flex flex-col justify-center">
              <h1 className={cn(
                "text-4xl font-black text-blue-600 transition-all duration-300 mb-2",
                isHovered && "text-5xl text-blue-700"
              )}>
                MechJobs IL
              </h1>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className={cn(
                  "w-4 h-4 rounded-full bg-green-500 transition-all duration-300",
                  isHovered && "w-5 h-5 animate-pulse"
                )} />
                <span className="text-sm text-green-600 font-bold">פעיל עכשיו</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">לחץ פעמיים להפוך</p>
            </div>
            
            {/* Bottom Blue Stripe */}
            <div className="absolute bottom-0 h-4 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
              {isHovered && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"
                  style={{ 
                    animation: 'shimmer 2s ease-in-out infinite 0.5s',
                    backgroundSize: '200% 100%',
                  }}
                />
              )}
            </div>
          </div>

          {/* Card Back */}
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-600 rounded-xl shadow-2xl overflow-hidden',
              isHovered && 'shadow-blue-200/50 shadow-3xl'
            )}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Top Blue Stripe */}
            <div className="h-4 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />
            
            {/* Back Content */}
            <div className="p-4 text-center h-full flex flex-col justify-center text-right">
              <p className="text-lg font-bold text-blue-700 mb-2">
                מציאת עבודות לסטודנטים
              </p>
              <p className="text-sm text-blue-600 mb-1">
                להנדסת מכונות בישראל
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                היעד האחד שלך לכל הזדמנויות
                <br />
                בחברות הישראליות המובילות
              </p>
              <div className="mt-3 text-xs text-blue-500">
                🔧 הנדסת מכונות • 🎓 סטודנטים • 🇮🇱 ישראל
              </div>
              <p className="text-xs text-gray-400 mt-2">לחץ פעמיים להפוך</p>
            </div>
            
            {/* Bottom Blue Stripe */}
            <div className="absolute bottom-0 h-4 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600" />
          </div>

          {/* Physics particles when dragging */}
          {isDragging && (
            <>
              <div className="absolute -top-3 -left-3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-2 -right-3 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
              <div className="absolute -bottom-3 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.4s' }} />
            </>
          )}
        </div>
      </div>

      {/* Shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default SimpleLanyard3D;