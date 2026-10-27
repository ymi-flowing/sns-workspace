// MatrixTable — the "daily report" matrix: properties × metrics, grouped by region.
//
// A single table that renders a dense per-property × per-metric grid, with:
//   - Two-row header (region groups on top, property abbrs below)
//   - Sticky left metric column
//   - Right-anchored "Portfolio" total column
//   - Divider rows (height-only; use to separate metric groups inside one table)
//   - Alt-row shading
//   - Per-cell alert background (opt-in via row.getAlert → truthy summary string)
//   - Per-cell click handlers via row.popupCategory (+ optional row.popupFilter)
//   - Percent suffix via row.isPercent
//
// Mounts inside a <Card> in typical usage so the floating shadow + rounded chrome
// come from the kit. The MatrixTable itself only owns the table.

import './matrix-table.css';

export type GroupTone = 'purple' | 'sky' | 'teal' | 'rose' | 'slate' | 'brand';

export interface ColumnGroup {
  /** Region / group label shown in the top header row (e.g. "Tampa"). */
  label: string;
  /** Property abbreviations shown as the second-row headers under this group. */
  abbrs: string[];
  /** Optional tint for the group-header cell. Defaults to "slate". */
  tone?: GroupTone;
}

export interface MatrixRow {
  /** Stable key for React reconciliation and click-handler payloads. */
  key: string;
  /** Metric name shown in the sticky left column. */
  label: React.ReactNode;
  /** Optional text-color token/class applied to the value cells + total. */
  color?: string;
  /** Append a "%" to the rendered cell + total. */
  isPercent?: boolean;
  /** When true, render a thin colored divider row instead of a data row. */
  isDivider?: boolean;
  /** Compute the cell value for a given property abbr. Ignored when isDivider. */
  getValue?: (abbr: string) => string | number;
  /** Compute the right-anchored portfolio total. Optional. */
  getTotal?: () => string | number;
  /**
   * Return a non-empty string to flag the cell as alerted (bg tint). The string
   * is used as the native title tooltip. Return null for no alert.
   */
  getAlert?: (abbr: string) => string | null;
  /**
   * When set + the cell value is truthy, the cell becomes clickable and calls
   * onCellClick(popupCategory, abbr, popupFilter?) on click.
   */
  popupCategory?: string;
  popupFilter?: string;
}

export interface MatrixTableProps {
  columnGroups: ColumnGroup[];
  rows: MatrixRow[];
  /** Label for the right-anchored total column. Defaults to "Portfolio". */
  totalLabel?: string;
  /** Label for the top-left corner header (above the metric column). Defaults to "Metric". */
  metricLabel?: string;
  onCellClick?: (category: string, abbr: string, filter?: string) => void;
}

export function MatrixTable({
  columnGroups,
  rows,
  totalLabel = 'Portfolio',
  metricLabel = 'Metric',
  onCellClick,
}: MatrixTableProps): React.ReactElement {
  const allAbbrs: string[] = columnGroups.flatMap((g) => g.abbrs);
  const colSpan = allAbbrs.length + 2; // metric + portfolio

  return (
    <div className="ui-matrix-wrap">
      <table className="ui-matrix">
        <thead>
          <tr className="ui-matrix-group-row">
            <th className="ui-matrix-corner ui-matrix-sticky-left" />
            {columnGroups.map((g) => (
              <th
                key={g.label}
                colSpan={g.abbrs.length}
                className={`ui-matrix-group ui-matrix-group-${g.tone ?? 'slate'}`}
              >
                {g.label}
              </th>
            ))}
            <th className="ui-matrix-total-head">TOTAL</th>
          </tr>
          <tr className="ui-matrix-abbr-row">
            <th className="ui-matrix-metric-head ui-matrix-sticky-left">{metricLabel}</th>
            {allAbbrs.map((abbr) => (
              <th key={abbr} className="ui-matrix-abbr">
                {abbr}
              </th>
            ))}
            <th className="ui-matrix-portfolio-head">{totalLabel}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIdx) => {
            if (row.isDivider) {
              return (
                <tr key={row.key} className="ui-matrix-divider-row">
                  <td colSpan={colSpan} />
                </tr>
              );
            }

            const isAlt = rowIdx % 2 === 1;
            const rowClass = `ui-matrix-row${isAlt ? ' ui-matrix-row-alt' : ''}`;
            const suffix = row.isPercent ? '%' : '';
            const colorClass = row.color ?? '';

            return (
              <tr key={row.key} className={rowClass}>
                <th
                  scope="row"
                  className={`ui-matrix-metric-cell ui-matrix-sticky-left${isAlt ? ' ui-matrix-metric-cell-alt' : ''}`}
                >
                  {row.label}
                </th>

                {allAbbrs.map((abbr) => {
                  const raw = row.getValue?.(abbr) ?? 0;
                  const alertMsg = row.getAlert?.(abbr) ?? null;
                  const clickable = !!(row.popupCategory && onCellClick && Number(raw) > 0);
                  const cellClass = [
                    'ui-matrix-cell',
                    colorClass,
                    alertMsg ? 'ui-matrix-cell-alert' : '',
                    clickable ? 'ui-matrix-cell-clickable' : '',
                  ].filter(Boolean).join(' ');

                  const onClick = clickable
                    ? () => onCellClick!(row.popupCategory!, abbr, row.popupFilter)
                    : undefined;

                  return (
                    <td
                      key={abbr}
                      className={cellClass}
                      onClick={onClick}
                      title={alertMsg ?? undefined}
                    >
                      {raw}{suffix}
                    </td>
                  );
                })}

                <td className={`ui-matrix-total-cell ${colorClass}`}>
                  {row.getTotal ? `${row.getTotal()}${suffix}` : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
