const styles: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-800 border-emerald-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  OPTIONS: "bg-amber-100 text-amber-800 border-amber-200",
};

export function MethodBadge({ method }: { method: keyof typeof styles }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${styles[method]}`}
    >
      {method}
    </span>
  );
}
