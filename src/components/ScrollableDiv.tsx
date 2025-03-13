/**
 * Custom scrollable container with hidden scrollbars
 * Features:
 * - Cross-browser scrollbar hiding
 * - Dynamic height adjustment
 * - Styled-components integration
 */
import { cn } from "~/lib/utils";

const ScrollableContainer: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({ 
  children,
  className,
  ...rest 
}) => {
  return (
    <div
      {...rest}
      className={cn("max-h-[60vh] overflow-y-scroll scrollbar-hide", className)}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;

