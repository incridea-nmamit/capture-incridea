import { Skeleton } from "~/components/ui/skeleton"

/**
 * SkeletonLoader Component
 * Displays loading placeholders for the MoreInfo drawer content
 * Uses two full-width skeleton blocks in a responsive layout
 */
export function SkeletonLoader() {
  return (
    <div className="flex flex-col md:flex-row space-x-3">
      {/* Loading placeholder for charts/content */}
      <Skeleton className="h-96 w-full rounded-xl" /> 
      <Skeleton className="h-96 w-full rounded-xl" /> 
    </div>
  );
}
