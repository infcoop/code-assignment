import { useState } from "react";
import { formatRelative } from "date-fns";

interface EditablePostTitleProps {
  value: string;
  createdDate?: Date;
  updatedDate?: Date;
  onSave?: (newTitle: string) => void;
  onClick?: () => void; // Optional click handler to trigger editing mode
}

export const EditablePostTitle: React.FC<EditablePostTitleProps> = ({
  value,
  createdDate,
  updatedDate,
  onSave,
  onClick, // Handle the onClick to trigger editing
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(value);
  const [hovered, setHovered] = useState(false);

  const handleSave = () => {
    if (title.trim()) {
      onSave?.(title);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(value);
    setIsEditing(false);
  };

  return (
    <div>
      {/* Editable Title */}
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <button onClick={handleSave}>Save</button>
          <button data-testid="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <h2 onClick={onClick}>{title}</h2> // Trigger the editing mode on title click
      )}

      {/* Created & Updated Time */}
      {createdDate && (
        <p
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Created:{" "}
          {hovered ? createdDate.toLocaleString() : formatRelative(createdDate, new Date())}
        </p>
      )}

      {updatedDate && (
        <p
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Updated:{" "}
          {hovered ? updatedDate.toLocaleString() : formatRelative(updatedDate, new Date())}
        </p>
      )}
    </div>
  );
};
