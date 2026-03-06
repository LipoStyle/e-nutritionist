import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  Check,
  X,
  User,
  Mail,
  Calendar,
  MessageSquare,
  Tag,
} from "lucide-react";
import DeleteButton from "./DeleteButton"; // Import the new client component
import "@/styles/admin-bookings.css";

export default async function AdminBookingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("appointment_date", { ascending: true });

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const status = formData.get("status");
    const supabaseServer = await createSupabaseServerClient();
    await supabaseServer.from("bookings").update({ status }).eq("id", id);
    revalidatePath("/admin/bookings");
  }

  async function deleteBooking(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabaseServer = await createSupabaseServerClient();
    await supabaseServer.from("bookings").delete().eq("id", id);
    revalidatePath("/admin/bookings");
  }

  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <h1>Appointment Calendar</h1>
      </header>

      <div className="admin-content-card">
        <div className="admin-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>
                  <User size={14} /> Client
                </th>
                <th>
                  <Mail size={14} /> Email
                </th>
                <th>
                  <Tag size={14} /> Service
                </th>
                <th>
                  <Calendar size={14} /> Date/Time
                </th>
                <th>
                  <MessageSquare size={14} /> Message
                </th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking) => (
                <tr key={booking.id} className="admin-table-row">
                  <td>
                    <strong>{booking.client_name}</strong>
                  </td>
                  <td>
                    <span className="text-muted">{booking.client_email}</span>
                  </td>
                  <td>
                    <span className="service-tag">
                      {booking.service_name || booking.service_type}
                    </span>
                  </td>
                  <td>
                    <div className="datetime-cell">
                      <span>
                        {new Date(
                          booking.appointment_date,
                        ).toLocaleDateString()}
                      </span>
                      <small>{booking.appointment_time}</small>
                    </div>
                  </td>
                  <td className="notes-cell">
                    <div
                      className="notes-truncate"
                      title={booking.additional_notes}
                    >
                      {booking.additional_notes || "-"}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="admin-actions-group">
                      {booking.status === "pending" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={booking.id} />
                          <input
                            type="hidden"
                            name="status"
                            value="confirmed"
                          />
                          <button
                            type="submit"
                            className="action-icon-btn approve"
                            title="Confirm"
                          >
                            <Check size={18} />
                          </button>
                        </form>
                      )}

                      {booking.status !== "cancelled" && (
                        <form action={updateStatus}>
                          <input type="hidden" name="id" value={booking.id} />
                          <input
                            type="hidden"
                            name="status"
                            value="cancelled"
                          />
                          <button
                            type="submit"
                            className="action-icon-btn decline"
                            title="Decline"
                          >
                            <X size={18} />
                          </button>
                        </form>
                      )}

                      {/* FIXED: Using the Client Component for deletion */}
                      <DeleteButton
                        bookingId={booking.id}
                        onDelete={deleteBooking}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
