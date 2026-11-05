export const menuItemClass = "block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-navy-900 hover:bg-paper";

export function DataTable({
  columns,
  empty,
  children,
}: {
  columns: string[];
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 w-full overflow-x-auto rounded-[1.5rem] border border-navy-900/10 bg-white">
      <table className="data-table min-w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empty ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center font-semibold text-muted">
                No data found
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
