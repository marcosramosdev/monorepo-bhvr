import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="bottom-right" />
      <TanStackRouterDevtools position="top-right" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  ),
});
