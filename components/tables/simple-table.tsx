type SimpleTableProps = {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
};

export function SimpleTable({ columns, rows }: SimpleTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-slate-100">
                {row.map((cell, cellIndex) => (
                  <td key={`${index}-${cellIndex}`} className="px-4 py-3 align-top">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
