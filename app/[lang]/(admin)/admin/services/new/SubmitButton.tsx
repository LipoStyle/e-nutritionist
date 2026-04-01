"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

export default function SubmitButton({
  text = "Publish Service",
}: {
  text?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn-save-main ${pending ? "is-loading" : ""}`}
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Save size={18} />
          {text}
        </>
      )}
    </button>
  );
}
