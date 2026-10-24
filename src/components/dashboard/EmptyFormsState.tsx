import CreateFormButton from "./CreateFormButton";

export default function EmptyFormsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-8 py-16 text-center">
      {/* Illustration */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-600/25 bg-indigo-600/10">
        <svg
          className="h-8 w-8 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-white">No forms yet</h3>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">
        Create your first conversational form and start collecting smart responses.
      </p>

      <div className="mt-6">
        <CreateFormButton />
      </div>
    </div>
  );
}
