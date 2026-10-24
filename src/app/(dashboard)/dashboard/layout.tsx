import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Double-check on the server — middleware is the primary guard
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f] text-slate-100">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <DashboardTopbar userName={user.name} userEmail={user.email} />

      {/* ── Body: sidebar + main ────────────────────────────────────────── */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
