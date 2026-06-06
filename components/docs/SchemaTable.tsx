type Row = {
  field: string;
  type: string;
  required?: boolean;
  description?: string;
  default?: string;
};

export function SchemaTable({ rows, title }: { rows: Row[]; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      {title && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <h4 className="font-mono text-sm font-semibold text-slate-800">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-medium">Field</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Required</th>
              <th className="px-4 py-2.5 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.field} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-[#134A9E]">{row.field}</td>
                <td className="px-4 py-3 text-slate-600">{row.type}</td>
                <td className="px-4 py-3">
                  {row.required === undefined ? (
                    <span className="text-slate-400">—</span>
                  ) : row.required ? (
                    <span className="text-emerald-700">Yes</span>
                  ) : (
                    <span className="text-slate-500">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {row.description}
                  {row.default && (
                    <span className="mt-0.5 block font-mono text-xs text-slate-400">
                      default: {row.default}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
