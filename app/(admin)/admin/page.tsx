// app/[locale]/admin/page.tsx
import AdminDashboardGrid from "@/components/AdminDashboardGrid/AdminDashboardGrid"; // Adjust path as needed

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Control Center
          </h1>
          <p className="text-gray-600 mt-2">
            Select a section below to manage your website content.
          </p>
        </div>

        {/* This is where your NavCards load */}
        <AdminDashboardGrid />
      </div>
    </main>
  );
}
