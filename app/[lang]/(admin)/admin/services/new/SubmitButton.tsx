"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2 } from "lucide-react";

export default function SubmitButton() {
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
          Processing Media...
        </>
      ) : (
        <>
          <Save size={18} />
          Publish Service
        </>
      )}
    </button>
  );
}
