interface WelcomeBannerProps {
  name?: string | null;
  email: string;
}

export default function WelcomeBanner({ name, email }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-indigo-950/40 p-6 sm:p-8">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 right-0 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-24 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl" />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-400">
          Welcome back
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {name ? `Hey, ${name} 👋` : "Your Dashboard"}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Signed in as{" "}
          <span className="font-medium text-slate-300">{email}</span>
        </p>
      </div>
    </div>
  );
}
