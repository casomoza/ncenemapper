import { createFileRoute, redirect } from "@tanstack/react-router";

// The public GE Requirements page was retired; GE data is managed only in the admin area.
export const Route = createFileRoute("/ge")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
