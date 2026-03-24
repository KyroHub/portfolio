"use client";

import { useEffect } from "react";
import { pageShellAccents } from "@/components/PageShell";
import { RouteErrorState } from "@/components/RouteErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("API docs route failed to render", error);
  }, [error]);

  return (
    <RouteErrorState
      eyebrow="Developer Docs"
      title="We couldn't load the API docs"
      description="The documentation view ran into a temporary problem before Swagger finished rendering."
      details="You can retry the interactive docs, or fall back to the raw OpenAPI document while this page recovers."
      tone="sky"
      primaryHref="/api/openapi.json"
      primaryLabel="Open raw spec"
      reset={reset}
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrbSoft,
      ]}
    />
  );
}
