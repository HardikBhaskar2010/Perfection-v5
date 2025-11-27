import * as React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useHoverAnimation } from "@/hooks/useHoverAnimation";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  enableAnimation?: boolean;
  enableHover?: boolean;
  animationDelay?: number;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, enableAnimation = true, enableHover = false, animationDelay = 0, ...props }, ref) => {
    const scrollRef = useScrollAnimation<HTMLDivElement>({ 
      animation: 'fadeIn', 
      delay: animationDelay,
      triggerOnce: true 
    });
    
    const hoverRef = useHoverAnimation<HTMLDivElement>({ 
      scale: 1.02, 
      lift: 4, 
      glow: false,
      duration: 200 
    });

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLDivElement) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      if (enableAnimation && scrollRef.ref.current !== node) {
        scrollRef.ref.current = node;
      }
      if (enableHover && hoverRef.current !== node) {
        hoverRef.current = node;
      }
    }, [ref, scrollRef.ref, hoverRef, enableAnimation, enableHover]);

    return (
      <div 
        ref={combinedRef} 
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          enableHover && "cursor-pointer transition-shadow duration-200",
          className
        )} 
        {...props} 
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
