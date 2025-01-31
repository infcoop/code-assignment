import { useState } from "react";
import { formatRelative } from "date-fns";
import { Input } from "@inf/ui/input";
import { Button } from "@inf/ui/button";
import { api } from "~/trpc/react";
import { toast } from "@inf/ui/toast";

interface EditablePostTitleProps {
  title: string;
  content: string;
  author_id: string;
  created_at?: string;
  updated_at?: string;
  id: string;
}

// Here i need to add content and author_id, becuase in backend for update query both of these fields are also required.

export function EditablePostTitle(props: EditablePostTitleProps) {
   
  const {title, id, content, author_id,created_at, updated_at} = props

  const [isEditing, setIsEditing] = useState(false);
  const [intialTitle, setIntialTitle] = useState(title);
  const [newTitle, setNewTitle] = useState(title);

  const utils = api.useUtils();
  const updatePost = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.byId.invalidate({id}); // Refresh post data
      toast.success("Post updated successfully!");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to update this post"
          : "Failed to update post"
      );
    },
  });
  

  const handleSave = () => {
    if (newTitle.trim() && newTitle !== title) {
      setIntialTitle(newTitle)
      updatePost.mutate({
        id, title: newTitle,
        content,
        author_id,

        updated_at: new Date().toDateString()
      }); // Call update mutation
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <Button onClick={handleSave}>Save</Button>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <h2
          className="cursor-pointer text-2xl font-bold"
          onClick={() => setIsEditing(true)}
        >
          {intialTitle}
        </h2>
      )}
      {created_at && (
        <p className="text-sm text-gray-500">
          Created: {created_at}
        </p>
      )}
      {updated_at && (
        <p className="text-sm text-gray-500">
          Updated: {updated_at}
        </p>
      )}
    </div>
  );
}