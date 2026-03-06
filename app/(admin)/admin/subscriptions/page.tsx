import { createSupabaseServerClient } from "@/lib/supabase/server"; // Adjust path to your server file
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function SubscriptionsAdmin() {
  const supabase = await createSupabaseServerClient();

  // Fetch data directly on the server
  const { data: emails, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  // Server Action for deleting a subscriber
  async function deleteSubscriber(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabaseServer = await createSupabaseServerClient();

    await supabaseServer.from("subscribers").delete().eq("id", id);
    revalidatePath("/admin/subscriptions"); // Refresh the data
  }

  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <h1>Newsletter Subscriptions</h1>
        <p>Total active subscribers: {emails?.length || 0}</p>
      </header>

      <div className="admin-content-card">
        {error ? (
          <p>Error loading subscribers. Check your RLS policies.</p>
        ) : (
          <table
            style={{
              width: "100%",
              textAlign: "left",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "12px" }}>Email Address</th>
                <th style={{ padding: "12px" }}>Joined Date</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {emails?.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>
                    {sub.email}
                  </td>
                  <td style={{ padding: "12px", color: "#64748b" }}>
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <form action={deleteSubscriber}>
                      <input type="hidden" name="id" value={sub.id} />
                      <button
                        type="submit"
                        style={{
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
