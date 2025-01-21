import type { RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import { render as renderReact } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { vi } from "vitest";

import { TRPCReactProvider } from "~/trpc/react";

/**
 * required to mock the IntersectionObserver
 */
export const mockWebApi = () => {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: () => null,
    disconnect: () => null,
  }));
};

/**
 * render a component with the next router provider and the test root provider
 * @param ui ui component to render
 * @param url url to render the component at
 * @param options options to pass to the render function
 * @returns
 */
export const render = (
  ui: ReactNode,
  url = "/",
  options: RenderOptions = {},
) => {
  return renderReact(ui, {
    ...options,
    wrapper: ({ children }) => (
      <MemoryRouterProvider url={url}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </MemoryRouterProvider>
    ),
  });
};
