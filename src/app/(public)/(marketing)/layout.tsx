import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { getSessionUser } from "@/lib/auth";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const serializedUser = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    : null;

  return (
    <SmoothScrollProvider>
      <div className="flex flex-col min-h-screen bg-[#090a0f] text-slate-100">
        <Navbar user={serializedUser} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
