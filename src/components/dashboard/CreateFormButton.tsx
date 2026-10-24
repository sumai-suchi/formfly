"use client";

export default function CreateFormButton() {
  return (
    <button
      onClick={() => {
        // TODO: wire up form creation flow
        alert("Create Form — coming soon!");
      }}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30 active:scale-95"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Create Form
    </button>
  );
}
