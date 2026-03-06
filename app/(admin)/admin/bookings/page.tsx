import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="admin-page-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="admin-header">
        <h1>Hero Slider</h1>
        <p>Update your homepage banner images and text.</p>
      </header>
      <div className="admin-content-card">
        <p className="text-muted">Image uploader coming soon...</p>
      </div>
    </div>
  );
}
