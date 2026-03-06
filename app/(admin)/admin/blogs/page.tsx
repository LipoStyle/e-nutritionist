import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogsPage() {
  return (
    <div className="admin-page-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="admin-header">
        <h1>Blog Management</h1>
        <p>Write and publish articles for your audience.</p>
      </header>
      <div className="admin-content-card">
        <p className="text-muted">Blog editor coming soon...</p>
      </div>
    </div>
  );
}
