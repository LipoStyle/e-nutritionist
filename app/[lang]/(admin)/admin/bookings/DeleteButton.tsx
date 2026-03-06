"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  bookingId: string;
  onDelete: (formData: FormData) => void;
}

export default function DeleteButton({
  bookingId,
  onDelete,
}: DeleteButtonProps) {
  return (
    <form
      action={onDelete}
      onSubmit={(e) => {
        if (
          !confirm("Are you sure you want to permanently delete this booking?")
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={bookingId} />
      <button
        type="submit"
        className="action-icon-btn delete"
        title="Delete Permanently"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}
