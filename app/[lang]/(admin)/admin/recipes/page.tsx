import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RecipesPage() {
  return (
    <div className="admin-page-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="admin-header">
        <h1>Recipe Management</h1>
        <p>Create, edit, and delete your nutritional meal plans.</p>
      </header>
      <div className="admin-content-card">
        <p className="text-muted">Table and Form coming soon...</p>
      </div>
    </div>
  );
}
