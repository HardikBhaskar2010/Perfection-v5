import React, { useEffect, useRef } from 'react';

interface PageFlipProps {
  children: React.ReactNode;
  direction: 'next' | 'prev' | null;
}

const PageFlip: React.FC<PageFlipProps> = ({ children, direction }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (direction && containerRef.current) {
      containerRef.current.classList.add('page-flip');
      containerRef.current.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');
      
      const timer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove('page-flip', 'flip-next', 'flip-prev');
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [direction]);

  return (
    <div ref={containerRef} className="page-flip-container">
      {children}
    </div>
  );
};

export default PageFlip;