import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Mail, CheckCircle, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MessagesAdminPage() {
  const supabase = await createSupabaseServerClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  // Server Action to delete
  async function deleteMessage(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabaseServer = await createSupabaseServerClient();
    await supabaseServer.from("contact_messages").delete().eq("id", id);
    revalidatePath("/admin/messages");
  }

  return (
    <div className="admin-page-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="admin-header">
        <h1>Inbox</h1>
        <p>You have {messages?.length || 0} total inquiries.</p>
      </header>

      <div className="admin-grid" style={{ gridTemplateColumns: "1fr" }}>
        {messages?.map((msg) => (
          <div key={msg.id} className="nav-card" style={{ cursor: "default" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "0.2rem" }}>{msg.full_name}</h3>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {msg.email} | {msg.phone || "No Phone"}
                </span>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                {new Date(msg.created_at).toLocaleDateString()}
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                Subject: {msg.subject || "General Inquiry"}
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#334155",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.message}
              </p>
            </div>

            <div className="card-footer">
              <span>Service: {msg.service || "Not specified"}</span>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={msg.id} />
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
