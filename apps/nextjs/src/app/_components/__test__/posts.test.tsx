import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "vitest.next.utils";
import { CreatePostForm, PostList } from "../posts";

describe("CreatePostForm Component", () => {
  it("should render the form correctly", async () => {
    render(<CreatePostForm />);
    expect(screen.getByTestId("post-form")).not.toBe(null);
  });

  it("should have title and content input fields", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");

    expect(titleInput).not.toBe(null);
    expect(contentInput).not.toBe(null);
  });

  it("should allow user to type in input fields", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });

    expect(titleInput.getAttribute("value")).toBe("Test Title");
    expect(contentInput.getAttribute("value")).toBe("Test Content");
  });

  it("should submit the form when clicking the Create button", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const createButton = screen.getByText("Create");

    fireEvent.change(titleInput, { target: { value: "Sample Post" } });
    fireEvent.change(contentInput, { target: { value: "Sample Content" } });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(titleInput.getAttribute("value")).toBe(""); // Form should reset after submission
      expect(contentInput.getAttribute("value")).toBe("");
    });
  });

  /* TODO: Add a test to check if error message is displayed when no title and content are set */
  it.skip("should display an error message and highlight fields if no title and content are set", async () => {
    render(<CreatePostForm />);

    const createButton = screen.getByText("Create");
    fireEvent.click(createButton);

    await waitFor(() => {
      const errorMessage = screen.getByText("Title and content is required");
      expect(errorMessage).not.toBe(null);
    });
  });
});

describe("PostList Component", () => {
  /* TODO: Add a test to check if clicking delete button triggers confirmation dialog */
  it.skip("should confirm deletion before removing a post", async () => {
    render(<PostList />);
    
    const deleteButton = screen.getByText("DELETE");
    fireEvent.click(deleteButton);
    
    /* Mock confirmation and test expected behavior */
  });
});

describe("EditablePostTitle Component", () => {
  /* TODO: Add a test to check if clicking the title enables editing mode */
  it.skip("should enter edit mode when clicking on the title", async () => {
    // render(<EditablePostTitle value="Test Title" />);
    
    const title = screen.getByText("Test Title");
    fireEvent.click(title);
    
    /* Verify input field is displayed after click */
  });

  /* TODO: Add a test to verify save button updates the title */
  it.skip("should update the title on save", async () => {
    // render(<EditablePostTitle value="Old Title" />);
    
    fireEvent.click(screen.getByText("Old Title"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Title" } });
    
    /* Verify title is updated after save and title is not an input anymore */
  });

  /* TODO: Add a test to verify that edit mode gets cancelled on escape key */
  it.skip("should cancel edit mode on escape key", async () => {
    // render(<EditablePostTitle value="Old Title" />);
    
    fireEvent.click(screen.getByText("Old Title"));
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Escape" });
    
    /* Verify title is not an input anymore */
  });

  /* TODO: Add a test to verify that edit mode gets confirmed and saved on enter key */
  it.skip("should save edit mode on enter key", async () => {
    // render(<EditablePostTitle value="Old Title" />);
    
    fireEvent.click(screen.getByText("Old Title"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "New Title" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    
    /* Verify title is updated after save and title is not an input anymore */
  });


  /* TODO: Add a test to verify cancel button resets the title */
  it.skip("should reset the title on cancel", async () => {
    // render(<EditablePostTitle initialTitle="Original Title" />);
    
    fireEvent.click(screen.getByText("Original Title"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Modified" } });
    
    fireEvent.click(screen.getByTestId("cancel"));
    
    /* Verify title is reset to original value */
  });

  /* TODO: Add a test to verify created date is displayed as relative time (e.g. 5 minutes ago) */
  it.skip("should display created date as relative time", async () => {
    // render(<EditablePostTitle createdDate={new Date()} />);
    
    /* Verify date is displayed as relative time */
  });

  /* TODO: Add a test to verify updated date is displayed as relative time (e.g. 5 minutes ago) */
  it.skip("should display updated date as relative time", async () => {
    // render(<EditablePostTitle updatedDate={new Date()} />);
    
    /* Verify date is displayed as relative time */
  });

  /* TODO: Add a test to verify full date is displayed when hovering over relative time */
  it.skip("should display full date on hover", async () => {
    // render(<EditablePostTitle createdDate={new Date()} />);
    
    /* Verify full date is displayed on hover */
  });
});