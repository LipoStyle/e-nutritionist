"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteService } from "./actions"; // Ensure this path is correct

interface DeleteButtonProps {
  serviceId: string;
  lang: string;
}

export default function DeleteServiceButton({
  serviceId,
  lang,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // The Server Action now handles deleting features and translations automatically
      await deleteService(serviceId, lang);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting service. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="action-btn delete"
      title="Delete service"
    >
      {isDeleting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
