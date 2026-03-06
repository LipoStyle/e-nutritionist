// components/AdminDashboardGrid/AdminDashboardGrid.tsx
"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import {
  Utensils,
  Newspaper,
  LayoutTemplate,
  Users,
  Calendar,
  MessageSquare,
  ChevronRight,
  Briefcase,
} from "lucide-react";

const categories = [
  { name: "Recipes", slug: "recipes", icon: <Utensils /> },
  { name: "Blogs", slug: "blogs", icon: <Newspaper /> },
  { name: "Hero Slider", slug: "heroslider", icon: <LayoutTemplate /> },
  { name: "Subscriptions", slug: "subscriptions", icon: <Users /> },
  { name: "Bookings", slug: "bookings", icon: <Calendar /> },
  { name: "Messages", slug: "messages", icon: <MessageSquare /> },
  { name: "Services", slug: "services", icon: <Briefcase size={20} /> },
];

export default function AdminDashboardGrid() {
  return (
    <div className="admin-grid">
      {categories.map((cat, index) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/admin/${cat.slug}`} className="nav-card">
            <div className="icon-wrapper">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>Manage {cat.name.toLowerCase()} database entries.</p>
            <div className="card-footer">
              <span>Configure</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
