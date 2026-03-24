import { pageShellAccents } from "@/components/PageShell";
import { RouteLoadingState } from "@/components/RouteLoadingState";
import { SurfacePanel } from "@/components/SurfacePanel";

function LoadingBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/80 ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <RouteLoadingState
      eyebrow="Developer Docs"
      title="Preparing the API docs"
      description="Loading the OpenAPI explorer, developer shortcuts, and dataset notes."
      tone="sky"
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrbSoft,
      ]}
      skeleton={
        <div className="space-y-6">
          <SurfacePanel rounded="3xl" className="space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap gap-3">
              <LoadingBlock className="h-11 w-40" />
              <LoadingBlock className="h-11 w-36" />
              <LoadingBlock className="h-11 w-32" />
              <LoadingBlock className="h-11 w-36" />
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((itemIndex) => (
                <LoadingBlock key={itemIndex} className="h-14 w-full" />
              ))}
            </div>
            <LoadingBlock className="h-4 w-full" />
            <LoadingBlock className="h-4 w-4/5" />
          </SurfacePanel>

          <SurfacePanel rounded="3xl" className="space-y-4 p-6 md:p-8">
            <LoadingBlock className="h-8 w-56" />
            <LoadingBlock className="h-[32rem] w-full" />
          </SurfacePanel>
        </div>
      }
    />
  );
}
