/**
 * Skeleton Component
 * A loading placeholder component that animates with a pulse effect
 * Used to indicate content is loading
 */
import { cn } from "~/lib/utils"

// Skeleton component with customizable styling through className prop
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
