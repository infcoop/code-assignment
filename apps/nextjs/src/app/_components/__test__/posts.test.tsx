import { prettyDOM, screen, waitFor } from "@testing-library/react";
import { render } from "vitest.next.utils";

import { CreatePostForm } from "../posts";

describe("posts", () => {
  it("component smoke test", async () => {
    render(<CreatePostForm />);

    const row = await waitFor(() => {
      return screen.getByTestId("post-form");
    });

    expect(row).not.toBe(null);
  });
});
