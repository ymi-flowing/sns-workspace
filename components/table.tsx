// v2 Table — generic data table. Caller defines columns + rows; the component
// handles layout, sticky header, optional checkbox selection, optional sort
// (controlled), hover + click rows, empty state, loading state, and a sticky
// footer slot for summary rows.
//
// Example:
//   const columns: Column<Order>[] = [
//     { key: 'name', header: '#', cell: (o) => o.name, width: 80 },
//     { key: 'total', header: 'Total', align: 'right', sortable: true, cell: (o) => fmtArs(o.total) },
//     { key: 'status', header: 'Estado', cell: (o) => <StatusBadge value={o.status} /> },
//   ];
//   <Table columns={columns} rows={orders} getRowId={(o) => o.id} ... />

import { Checkbox } from './checkbox';
import './table.css';

type Align = 'left' | 'right' | 'center';
export type SortDir = 'asc' | 'desc';
export type Sort = { col: string; dir: SortDir };

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: Align;
  sortable?: boolean;
  /** CSS width — e.g. "80px" or "20%" or a number (px). */
  width?: string | number;
  /** Extra class on the <th> and matching <td>. */
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  // Selection (optional — omit all three to render without checkboxes)
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
  onToggleAll?: () => void;
  // Sorting (optional)
  sort?: Sort;
  onSort?: (next: Sort) => void;
  // Row interaction
  onRowClick?: (row: T) => void;
  // State
  loading?: boolean;
  emptyState?: React.ReactNode;
  // Layout
  stickyHeader?: boolean;
  /** Height of the table scroll container. Pass a CSS length or omit to grow. */
  height?: string | number;
  /** Rendered BELOW the scroll area in a card-styled panel. Used for totals / summary. */
  footer?: React.ReactNode;
  className?: string;
}

function IconSortChevron({ dir }: { dir?: SortDir | 'none' }): React.ReactElement {
  // Up for asc, down for desc, down (muted) for the hover-only hint on unsorted.
  const d = dir === 'asc' ? 'M2 6L5 3L8 6' : 'M2 4L5 7L8 4';
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Table<T>({
  columns,
  rows,
  getRowId,
  selectedIds,
  onToggle,
  onToggleAll,
  sort,
  onSort,
  onRowClick,
  loading = false,
  emptyState,
  stickyHeader = true,
  height,
  footer,
  className = '',
}: TableProps<T>): React.ReactElement {
  const selectable = !!selectedIds && !!onToggle && !!onToggleAll;

  // Header checkbox tri-state based on currently-rendered rows.
  const visibleSelected = selectable
    ? rows.filter((r) => selectedIds!.has(getRowId(r))).length
    : 0;
  const headerCheckState: 'none' | 'some' | 'all' =
    !selectable ? 'none'
    : rows.length === 0 ? 'none'
    : visibleSelected === 0 ? 'none'
    : visibleSelected === rows.length ? 'all'
    : 'some';

  function headerClick(col: Column<T>): void {
    if (!col.sortable || !onSort) return;
    if (sort?.col === col.key) {
      onSort({ col: col.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSort({ col: col.key, dir: 'desc' });
    }
  }

  function cellStyle(col: Column<T>): React.CSSProperties {
    const style: React.CSSProperties = {};
    if (col.width != null) style.width = typeof col.width === 'number' ? `${col.width}px` : col.width;
    if (col.align === 'right') style.textAlign = 'right';
    else if (col.align === 'center') style.textAlign = 'center';
    return style;
  }

  return (
    <>
    <div
      className={`ui-table-wrap ${stickyHeader ? 'ui-table-sticky' : ''} ${className}`}
      style={{ height: height != null ? (typeof height === 'number' ? `${height}px` : height) : undefined }}
    >
      <table className="ui-table">
        <thead>
          <tr>
            {selectable && (
              <th className="ui-table-select">
                <Checkbox
                  checked={headerCheckState === 'all'}
                  indeterminate={headerCheckState === 'some'}
                  onChange={() => onToggleAll?.()}
                  aria-label="Seleccionar todo"
                />
              </th>
            )}
            {columns.map((col) => {
              const isActive = sort?.col === col.key;
              const dir: SortDir | 'none' = isActive ? sort!.dir : 'none';
              return (
                <th
                  key={col.key}
                  style={cellStyle(col)}
                  className={`${col.sortable ? 'ui-table-sortable' : ''} ${isActive ? 'ui-table-sorted' : ''} ${col.className ?? ''}`}
                  onClick={col.sortable ? () => headerClick(col) : undefined}
                  aria-sort={isActive ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <span className="ui-table-header-inner">
                    {col.header}
                    {col.sortable && <IconSortChevron dir={dir} />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="ui-table-state">
                <div className="ui-table-skeleton" aria-busy="true">Cargando…</div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="ui-table-state">
                {emptyState ?? <span className="ui-text-tertiary">Sin resultados</span>}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              const checked = selectable && selectedIds!.has(id);
              return (
                <tr
                  key={id}
                  className={`${checked ? 'ui-table-row-selected' : ''} ${onRowClick ? 'ui-table-row-clickable' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    // IMPORTANT: just stopPropagation here. The Checkbox fires
                    // onChange on its own; the previous td onClick ALSO called
                    // onToggle which cancelled it out (nothing could check or
                    // uncheck).
                    <td
                      className="ui-table-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => onToggle?.(id)}
                        aria-label="Seleccionar fila"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={cellStyle(col)} className={col.className ?? ''}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
    {footer && <div className="ui-table-summary">{footer}</div>}
    </>
  );
}
