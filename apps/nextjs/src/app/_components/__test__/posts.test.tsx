import { fireEvent, screen, waitFor } from "@testing-library/react";
import { render } from "vitest.next.utils";
import { vi } from 'vitest';
import { CreatePostForm, PostList, PostCard } from "../posts";
import { EditablePostTitle } from "../posts/EditablePostTitle";4
import { formatRelative } from "date-fns";

// Mock window.confirm to simulate user interaction with the confirmation dialog
beforeEach(() => {
  global.confirm = vi.fn();
});


describe("CreatePostForm Component", () => {
  it("should render the form correctly", async () => {
    render(<CreatePostForm />);
    expect(screen.getByTestId("post-form")).not.toBe(null);
  });

  it("should have title and content input fields", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Enter a Title...");
    const contentInput = screen.getByPlaceholderText("Share your thoughts here...");
    console.log(titleInput, contentInput)

    expect(titleInput).not.toBe(null);
    expect(contentInput).not.toBe(null);
  });

  it("should allow user to type in input fields", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Enter a Title...");
    const contentInput = screen.getByPlaceholderText("Share your thoughts here...");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });

    expect(titleInput.getAttribute("value")).toBe("Test Title");
    expect(contentInput.getAttribute("value")).toBe("Test Content");
  });

  it("should submit the form when clicking the Create button", async () => {
    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Enter a Title...");
    const contentInput = screen.getByPlaceholderText("Share your thoughts here...");
    const authorIdInput = screen.getByPlaceholderText("Enter your author ID");
    const createButton = screen.getByText("Create");

    fireEvent.change(titleInput, { target: { value: "Sample Post" } });
    fireEvent.change(contentInput, { target: { value: "Sample Content" } });
    fireEvent.change(authorIdInput, { target: { value: "author123" } });

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(titleInput.getAttribute("value")).toBe(""); // Form should reset after submission
      expect(contentInput.getAttribute("value")).toBe("");
      expect(authorIdInput.getAttribute("value")).toBe("");
    });
  });

  /* TODO: Add a test to check if error message is displayed when no title and content are set */
  it("should display an error message and highlight fields if no title and content are set", async () => {
    render(<CreatePostForm />);

    const createButton = screen.getByText("Create");
    fireEvent.click(createButton);

    await waitFor(() => {
      const errorTitleMessage = screen.getByText("Title must be at least 5 characters long");
      const errorContentMessage = screen.getByText("Content must be at least 10 characters long");
      const errorAuthorIdMessage = screen.getByText("Author ID is required");
      expect(errorTitleMessage).not.toBe(null);
      expect(errorContentMessage).not.toBe(null);
      expect(errorAuthorIdMessage).not.toBe(null);
    });
  });
});

describe("PostList Component", () => {
  /* TODO: Add a test to check if clicking delete button triggers confirmation dialog */
  it('should confirm deletion before removing a post', async () => {
    // Mock the `window.confirm` dialog
    const confirmMock = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    // Render the component
    render(<PostList />);

    // Find the delete button (assuming it has the text "Delete")
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).not.toBe(null);

    // Simulate a click on the delete button
    fireEvent.click(deleteButton);

    // Assert that the confirmation dialog was triggered
    expect(confirmMock).toHaveBeenCalledWith('Are you sure you want to delete this post?');

    // Clean up the mock
    confirmMock.mockRestore();
  });
});

describe("EditablePostTitle Component", () => {
  /* TODO: Add a test to check if clicking the title enables editing mode */
  it("should enter edit mode when clicking on the title", async () => {
    render(<EditablePostTitle title="Test Title" content="Test Content" author_id="123" id="1" />);

    // Get the title element
    const title = screen.getByText("Test Title");

    // Simulate clicking on the title to enable editing mode
    fireEvent.click(title);

    // Verify that the input field is displayed
    const input = screen.getByRole("textbox");
    expect(input).not.toBe(null);
  });

  /* TODO: Add a test to verify save button updates the title */
  it("should update the title on save", async () => {
    render(<EditablePostTitle title="Test Title" content="Test Content" author_id="123" id="1" />);

    // Click the title to enter editing mode
    fireEvent.click(screen.getByText("Test Title"));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Title" } });

    // Click the save button
    fireEvent.click(screen.getByText("Save"));

    // Verify the title has been updated
    expect(screen.getByText("New Title")).not.toBe(null);
  });

  /* TODO: Add a test to verify that edit mode gets cancelled on escape key */
  it("should cancel edit mode on escape key", async () => {
    render(<EditablePostTitle title="Old Title" content="Test Content" author_id="123" id="1" />);

    // Click on the title to enter edit mode
    fireEvent.click(screen.getByText("Old Title"));
  
    // Ensure the input field is visible
    const input = screen.getByRole("textbox");
    expect(input).not.toBe(null);
  
    // Simulate pressing the Escape key to cancel edit mode
    fireEvent.keyDown(input, { key: "Escape" });
  
    // Verify that the input field is no longer visible and the title is restored
    expect(input).not.toBe(null);
    expect(screen.getByText("Old Title")).not.toBe(null);
  });

  /* TODO: Add a test to verify that edit mode gets confirmed and saved on enter key */
  it("should save edit mode on enter key", async () => {
    render(<EditablePostTitle title="Old Title" content="Test Content" author_id="123" id="1" />);

    fireEvent.click(screen.getByText("Old Title"));
    const input = screen.getByRole("textbox");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "New Title" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    /* Verify title is updated after save and title is not an input anymore */
     expect(input).not.toBe(null);
     expect(screen.getByText("New Title")).not.toBe(null);
  });

  /* TODO: Add a test to verify cancel button resets the title */
  it("should reset the title on cancel", async () => {
    render(<EditablePostTitle title="Original Title" content="Test Content" author_id="123" id="1" />);

    fireEvent.click(screen.getByText("Original Title"));
    const input = screen.getByRole("textbox");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Modified" },
    });

    fireEvent.click(screen.getByText("Cancel"));

    /* Verify title is reset to original value */
    expect(input).not.toBe(null);
    expect(screen.getByText("Original Title")).not.toBe(null);
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