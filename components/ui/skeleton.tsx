import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Pre-built skeleton patterns
function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 space-y-4",
        className
      )}
    >
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-2">
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  )
}

function SkeletonAvatar({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-10 w-10 rounded-full", className)}
    />
  )
}

function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-10 w-24 rounded-lg", className)}
    />
  )
}

function SkeletonInput({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-10 w-full rounded-lg", className)}
    />
  )
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
}
