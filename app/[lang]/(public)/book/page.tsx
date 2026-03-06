"use client";

import { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Video,
  ChevronDown,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import "@/styles/google-calendar.css";

const TIME_SLOTS = [
  "10:00",
  "10:15",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
];

export default function BookingSystem() {
  const { t } = useLanguage();
  const supabase = createSupabaseBrowserClient();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"calendar" | "details" | "success">(
    "calendar",
  );
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  // Data States
  const [services, setServices] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({});
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // Form States
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch & Merge Services
  useEffect(() => {
    async function getServices() {
      const { data: coaching } = await supabase
        .from("services_current")
        .select("id, slug, price, service_type, duration_minutes");

      const { data: main } = await supabase
        .from("services_2025_12_11_13_27")
        .select("id, title");

      if (coaching && main) {
        const merged = coaching.map((c) => {
          const match = main.find((m) => m.id === c.id);
          return {
            ...c,
            name: match ? match.title : c.slug.toUpperCase().replace(/-/g, " "),
          };
        });
        setServices(merged);
      }
    }
    if (mounted) getServices();
  }, [mounted, supabase]);

  // 2. Fetch Existing Bookings (to disable slots)
  useEffect(() => {
    async function getBookings() {
      const { data } = await supabase
        .from("bookings")
        .select("appointment_date, appointment_time")
        .neq("status", "cancelled");

      if (data) {
        const mapping: Record<string, string[]> = {};
        data.forEach((b) => {
          if (!mapping[b.appointment_date]) mapping[b.appointment_date] = [];
          mapping[b.appointment_date].push(b.appointment_time.slice(0, 5));
        });
        setBookedSlots(mapping);
      }
    }
    if (mounted) getBookings();
  }, [mounted, supabase, step]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentViewDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentViewDate]);

  // 3. Final Booking Submission
  const handleBooking = async () => {
    if (!selectedService || !selectedSlot || !formData.name || !formData.email)
      return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          service_id: selectedService.id,
          service_name: selectedService.name,
          service_type: selectedService.service_type || "consultation",
          appointment_date: selectedSlot.date,
          appointment_time: selectedSlot.time,
          client_name: formData.name,
          client_email: formData.email,
          additional_notes: formData.notes,
          status: "pending",
          price: selectedService.price || 0,
          duration_minutes: selectedService.duration_minutes || 15,
        },
      ]);

      if (error) throw error;
      setStep("success");
    } catch (err: any) {
      alert(`Booking Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (step === "success")
    return (
      <div className="google-cal-page-wrapper">
        <div className="cal-success-full">
          <CheckCircle2 size={80} color="#075056" />
          <h2>{t("confirmed", "Confirmed")}</h2>
          <p>{t("success_msg", "Check your email for the meeting link.")}</p>
        </div>
      </div>
    );

  return (
    <div className="google-cal-page-wrapper">
      <div className="google-cal-container full-width">
        <header className="google-cal-header">
          <div className="brand-text">
            <div className="service-dropdown-wrapper">
              <select
                onChange={(e) =>
                  setSelectedService(
                    services.find((s) => s.id === e.target.value),
                  )
                }
                className="service-select"
              >
                <option value="">
                  {t("choose_service", "Select Service")}
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-icon" size={16} />
            </div>
            <h1>
              {selectedService?.name ||
                t("booking_title", "Book a Consultation")}
            </h1>
          </div>
          <div className="event-meta">
            <span>
              <Clock size={16} /> {selectedService?.duration_minutes || 15} min
            </span>
            <span>
              <Video size={16} /> Google Meet
            </span>
            {selectedService?.price && (
              <span>
                <strong>€{selectedService.price}</strong>
              </span>
            )}
          </div>
        </header>

        <div className="google-cal-body">
          {step === "calendar" ? (
            <main className="week-grid-container">
              <div className="nav-controls">
                <button
                  className="nav-arrow"
                  onClick={() => {
                    const d = new Date(currentViewDate);
                    d.setDate(d.getDate() - 1);
                    setCurrentViewDate(d);
                  }}
                >
                  <ChevronLeft />
                </button>
                <button
                  className="nav-today-btn"
                  onClick={() => setCurrentViewDate(new Date())}
                >
                  {t("today", "Today")}
                </button>
                <button
                  className="nav-arrow"
                  onClick={() => {
                    const d = new Date(currentViewDate);
                    d.setDate(d.getDate() + 1);
                    setCurrentViewDate(d);
                  }}
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="responsive-grid">
                {weekDays.map((day) => {
                  const dateStr = day.toISOString().split("T")[0];
                  return (
                    <div key={dateStr} className="slot-column">
                      <div className="day-label">
                        <span className="dow">
                          {day
                            .toLocaleDateString(undefined, { weekday: "short" })
                            .toUpperCase()}
                        </span>
                        <span className="dom">{day.getDate()}</span>
                      </div>
                      {TIME_SLOTS.map((time) => {
                        const isTaken = bookedSlots[dateStr]?.includes(time);
                        return (
                          <button
                            key={time}
                            disabled={isTaken}
                            className={`slot-btn ${isTaken ? "booked" : ""} ${selectedSlot?.time === time && selectedSlot?.date === dateStr ? "selected" : ""}`}
                            onClick={() =>
                              setSelectedSlot({ date: dateStr, time })
                            }
                          >
                            {isTaken ? t("booked", "Booked") : time}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {selectedSlot && (
                <div className="floating-footer">
                  <button
                    className="confirm-btn"
                    onClick={() => setStep("details")}
                  >
                    {t("next", "Next")}
                  </button>
                </div>
              )}
            </main>
          ) : (
            <div className="details-form-container">
              <button className="back-btn" onClick={() => setStep("calendar")}>
                <ChevronLeft size={16} /> {t("back", "Back")}
              </button>
              <h2>{t("enter_details", "Enter Details")}</h2>
              <div className="form-group">
                <label>
                  <User size={16} /> {t("name", "Full Name")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Mail size={16} /> {t("email", "Email Address")}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <MessageSquare size={16} /> {t("notes", "Additional Notes")}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <button
                className="confirm-btn full-width-btn"
                onClick={handleBooking}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("processing", "Processing...")
                  : t("schedule_event", "Schedule Event")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
