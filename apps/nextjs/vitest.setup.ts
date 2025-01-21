/* eslint-disable @typescript-eslint/no-empty-function */

import { vi } from "vitest";

/**
 * required to mock server side modules
 */
vi.mock("server-only", () => {
  return {
    // mock server-only module
  };
});

/**
 * required to mock next/navigation
 */
vi.mock("next/navigation", () => {
  const MockParams = URLSearchParams;
  MockParams.prototype.append = () => {};
  MockParams.prototype.delete = () => {};
  MockParams.prototype.set = () => {};
  MockParams.prototype.sort = () => {};
  const mockParams = new MockParams({});

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require("next-router-mock"),
    useSearchParams: () => mockParams,
    useParams: () => ({}) as Record<string, string>,
    usePathname: () => "/",
  } as const;
});

/**
 * required to mock the IntersectionObserver
 */

if (typeof window !== "undefined") {
  window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: () => null,
    disconnect: () => null,
  }));

  // FIX jsdom TypeError: The "event" argument must be an instance of Event. Received an instance of MessageEvent
  window.BroadcastChannel = vi.fn().mockImplementation(() => ({
    onmessage: null,
    postMessage: () => null,
    close: () => null,
    addEventListener: (event: string, cb: (e: MessageEvent) => void) => {
      window.addEventListener(event, cb as EventListenerOrEventListenerObject);
    },
    removeEventListener: (event: string, cb: (e: MessageEvent) => void) => {
      window.removeEventListener(
        event,
        cb as EventListenerOrEventListenerObject,
      );
    },
  }));
}
