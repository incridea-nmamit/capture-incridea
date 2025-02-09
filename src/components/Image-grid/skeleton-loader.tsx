import { Skeleton } from "~/components/ui/skeleton"

/**
 * SkeletonLoader Component
 * Displays a loading placeholder for images while they're being fetched
 */
export function SkeletonLoader() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center space-y-4 border border-gray-300 rounded-lg p-4 w-32 h-32">
                <Skeleton className="h-12 w-12" />
            </div>
        </div>
    )
}
