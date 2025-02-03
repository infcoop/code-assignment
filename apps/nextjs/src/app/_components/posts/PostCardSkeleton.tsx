import { cn } from "@inf/ui";

export function PostCardSkeleton(props: { pulse?: boolean }) {
    const { pulse = true } = props;
    return (
      <div className="flex flex-row rounded-lg bg-muted p-4">
        <div className="flex-grow">
          <h2
            className={cn(
              "w-1/4 rounded bg-stone-500/[0.2] text-2xl font-bold",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </h2>
          <p
            className={cn(
              "mt-2 w-1/3 rounded bg-stone-500/[0.2] text-sm",
              pulse && "animate-pulse",
            )}
          >
            &nbsp;
          </p>
        </div>
      </div>
    );
  }