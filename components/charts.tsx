// v2 charts — pure-SVG LineChart + DonutChart designed to match the v2 vibe:
// dark card bg, brand-green primary, subtle grid, tabular numerals, soft area
// gradient. No chart library — the shapes are simple enough that owning them
// end-to-end gives us pixel control.
//
//   <LineChart series={[{ label, points, color? }]} formatValue={fmt} />
//   <DonutChart segments={[{ label, value, color? }]} centerLabel="Total" />
'use client';

import { useId, useMemo, useState } from 'react';
import './charts.css';

/* ============================================================================
   LineChart
   ============================================================================ */

export interface LinePoint { label: string; value: number }
export interface LineSeries {
  label: string;
  points: LinePoint[];
  color?: string;
  /** When true, don't draw the shaded area underneath. */
  noArea?: boolean;
  /** Dashed stroke (for comparison series like "mes anterior"). */
  dashed?: boolean;
}

export interface LineChartProps {
  series: LineSeries[];
  height?: number;
  formatValue?: (n: number) => string;
  /** Hide the small color-coded legend above the chart. */
  hideLegend?: boolean;
  /** Hide the y-axis gridlines. */
  hideGrid?: boolean;
  /** Hide the y-axis value labels. */
  hideYAxis?: boolean;
  /** CSS color string. Defaults to brand green. */
  primaryColor?: string;
}

const WIDTH = 720;

/**
 * Build a smooth cubic-bezier path through the given points.
 * Uses symmetric control points at 50% of each segment's x-run so the
 * curve glides between data points without overshoot. Not a true spline,
 * but visually indistinguishable at chart sizes and WAY simpler.
 */
function smoothPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0]![0]},${pts[0]![1]}`;
  let d = `M ${pts[0]![0]},${pts[0]![1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const dx = (x1 - x0) * 0.5;
    const cp1x = x0 + dx;
    const cp1y = y0;
    const cp2x = x1 - dx;
    const cp2y = y1;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
  }
  return d;
}

function niceStep(range: number, targetTicks = 4): number {
  const raw = range / targetTicks;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / pow;
  const stepN =
    normalized < 1.5 ? 1 :
    normalized < 3   ? 2 :
    normalized < 7   ? 5 :
    10;
  return stepN * pow;
}

export function LineChart({
  series,
  height = 260,
  formatValue = (n) => n.toLocaleString('es-AR'),
  hideLegend = false,
  hideGrid = false,
  hideYAxis = false,
  primaryColor = 'var(--ui-brand-500)',
}: LineChartProps): React.ReactElement {
  const uid = useId().replace(/[^a-z0-9]/gi, '');
  const padding = { top: 16, right: 16, bottom: 32, left: hideYAxis ? 16 : 56 };
  const chartW = WIDTH - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const allValues = series.flatMap((s) => s.points.map((p) => p.value));
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  // Pad the y-axis up so the top point has breathing room above it.
  const step = niceStep(dataMax - dataMin || 1);
  const yMin = Math.floor(dataMin / step) * step;
  const yMax = Math.ceil(dataMax / step) * step + step;
  const range = yMax - yMin || 1;

  const labels = series[0]?.points.map((p) => p.label) ?? [];
  const n = labels.length;
  const xAt = (i: number): number => padding.left + (chartW / Math.max(n - 1, 1)) * i;
  const yAt = (v: number): number => padding.top + chartH - ((v - yMin) / range) * chartH;

  const ticks: number[] = useMemo(() => {
    const out: number[] = [];
    for (let v = yMin; v <= yMax; v += step) out.push(v);
    return out;
  }, [yMin, yMax, step]);

  // X-axis labels — don't crowd when there are many points.
  const xLabelInterval = n > 12 ? Math.ceil(n / 7) : 1;

  return (
    <div className="ui-chart">
      {!hideLegend && (
        <div className="ui-chart-legend">
          {series.map((s, i) => (
            <span key={i} className="ui-chart-legend-item">
              <span
                className={`ui-chart-legend-swatch ${s.dashed ? 'ui-chart-legend-swatch-dashed' : ''}`}
                style={{ background: s.color ?? primaryColor }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div className="ui-chart-canvas">
        <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label="Gráfico de líneas">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`uiline-${uid}-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={s.color ?? primaryColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={s.color ?? primaryColor} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Y-axis gridlines + labels */}
          {!hideGrid && ticks.map((t) => (
            <g key={t} className="ui-chart-gridline">
              <line x1={padding.left} x2={padding.left + chartW} y1={yAt(t)} y2={yAt(t)} />
            </g>
          ))}
          {!hideYAxis && ticks.map((t) => (
            <text
              key={t}
              x={padding.left - 8}
              y={yAt(t)}
              className="ui-chart-tick"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {formatValue(t)}
            </text>
          ))}

          {/* Area fills (smooth) */}
          {series.map((s, i) => {
            if (s.noArea) return null;
            const pts: Array<[number, number]> = s.points.map((p, j) => [xAt(j), yAt(p.value)]);
            const firstX = xAt(0);
            const lastX = xAt(s.points.length - 1);
            const base = padding.top + chartH;
            const d = `M ${firstX},${base} L ${pts[0]![0]},${pts[0]![1]}${smoothPath(pts).slice(smoothPath(pts).indexOf(' C'))} L ${lastX},${base} Z`;
            return <path key={i} d={d} fill={`url(#uiline-${uid}-${i})`} />;
          })}

          {/* Lines (smooth) */}
          {series.map((s, i) => {
            const pts: Array<[number, number]> = s.points.map((p, j) => [xAt(j), yAt(p.value)]);
            return (
              <path
                key={i}
                d={smoothPath(pts)}
                fill="none"
                stroke={s.color ?? primaryColor}
                strokeWidth="2"
                strokeDasharray={s.dashed ? '4 4' : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}

          {/* X-axis labels */}
          {labels.map((l, i) =>
            i % xLabelInterval === 0 ? (
              <text key={i} x={xAt(i)} y={height - 10} className="ui-chart-tick" textAnchor="middle">
                {l}
              </text>
            ) : null,
          )}

          {/* Hover crosshair + points */}
          {hoverIdx !== null && (
            <line
              x1={xAt(hoverIdx)}
              x2={xAt(hoverIdx)}
              y1={padding.top}
              y2={padding.top + chartH}
              className="ui-chart-crosshair"
            />
          )}
          {series.map((s, i) =>
            s.points.map((p, j) => (
              <circle
                key={`${i}-${j}`}
                cx={xAt(j)}
                cy={yAt(p.value)}
                r={hoverIdx === j ? 5 : 3}
                className="ui-chart-point"
                fill="var(--ui-bg-primary)"
                stroke={s.color ?? primaryColor}
                strokeWidth="2"
                style={{ opacity: hoverIdx === null || hoverIdx === j ? 1 : 0.3 }}
              />
            )),
          )}

          {/* Transparent capture rects per column so the whole vertical strip is hoverable */}
          {labels.map((_, i) => (
            <rect
              key={i}
              x={xAt(i) - (chartW / Math.max(n - 1, 1)) / 2}
              y={padding.top}
              width={chartW / Math.max(n - 1, 1)}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((v) => (v === i ? null : v))}
              style={{ cursor: 'crosshair' }}
            />
          ))}
        </svg>

        {/* Hover tooltip (HTML overlay — SVG can't host DOM tooltips cleanly) */}
        {hoverIdx !== null && (
          <div
            className="ui-chart-tt"
            style={{
              left: `${(xAt(hoverIdx) / WIDTH) * 100}%`,
              top: 0,
            }}
          >
            <div className="ui-chart-tt-label">{labels[hoverIdx]}</div>
            {series.map((s, i) => (
              <div key={i} className="ui-chart-tt-row">
                <span className="ui-chart-tt-swatch" style={{ background: s.color ?? primaryColor }} />
                <span className="ui-chart-tt-name">{s.label}</span>
                <strong>{formatValue(s.points[hoverIdx]?.value ?? 0)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   DonutChart
   ============================================================================ */

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  /** Thickness of the ring as a fraction of radius. 0.0 = full pie, 0.5 = balanced donut. */
  thickness?: number;
  /** Big center label (e.g. "Total"). */
  centerLabel?: React.ReactNode;
  /** Big center value (e.g. "$1.247.300"). Defaults to Σ segments. */
  centerValue?: React.ReactNode;
  formatValue?: (n: number) => string;
  /** Hide the legend to the right of the ring. */
  hideLegend?: boolean;
}

const PALETTE = [
  'var(--ui-brand-500)',
  '#6ba6d9',
  '#f79009',
  '#d97757',
  '#9f87c8',
  'var(--ui-text-tertiary)',
];

function polar(cx: number, cy: number, r: number, angleRad: number): [number, number] {
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)];
}
function arcPath(cx: number, cy: number, rOuter: number, rInner: number, start: number, end: number): string {
  const [x1o, y1o] = polar(cx, cy, rOuter, start);
  const [x2o, y2o] = polar(cx, cy, rOuter, end);
  const [x1i, y1i] = polar(cx, cy, rInner, end);
  const [x2i, y2i] = polar(cx, cy, rInner, start);
  const large = end - start > Math.PI ? 1 : 0;
  return [
    `M ${x1o} ${y1o}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2o} ${y2o}`,
    `L ${x1i} ${y1i}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x2i} ${y2i}`,
    'Z',
  ].join(' ');
}

export function DonutChart({
  segments,
  size = 200,
  thickness = 0.4,
  centerLabel,
  centerValue,
  formatValue = (n) => n.toLocaleString('es-AR'),
  hideLegend = false,
}: DonutChartProps): React.ReactElement {
  const [hover, setHover] = useState<number | null>(null);
  const total = segments.reduce((a, s) => a + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 4;
  const rInner = rOuter * (1 - thickness);

  let angle = -Math.PI / 2; // start at 12 o'clock
  const paths = segments.map((s, i) => {
    const slice = total === 0 ? 0 : (s.value / total) * Math.PI * 2;
    const d = arcPath(cx, cy, rOuter, rInner, angle, angle + slice);
    angle += slice;
    return { d, color: s.color ?? PALETTE[i % PALETTE.length] };
  });

  return (
    <div className="ui-chart ui-donut-wrap">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        role="img"
        aria-label="Gráfico de torta"
        className="ui-donut-svg"
      >
        {paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.color}
            className="ui-donut-slice"
            style={{ opacity: hover === null ? 1 : hover === i ? 1 : 0.35 }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
          />
        ))}
        {/* Center text — static, always shows total. */}
        <text x={cx} y={cy - 6} textAnchor="middle" className="ui-donut-center-label">
          {centerLabel ?? 'Total'}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="ui-donut-center-value">
          {centerValue ?? formatValue(total)}
        </text>
      </svg>

      {!hideLegend && (
        <ul className="ui-donut-legend">
          {segments.map((s, i) => {
            const pct = total === 0 ? 0 : (s.value / total) * 100;
            return (
              <li
                key={i}
                className={`ui-donut-legend-item ${hover === i ? 'ui-donut-legend-item-active' : ''}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              >
                <span
                  className="ui-donut-legend-swatch"
                  style={{ background: s.color ?? PALETTE[i % PALETTE.length] }}
                />
                <span className="ui-donut-legend-label">{s.label}</span>
                <strong className="ui-donut-legend-value">{formatValue(s.value)}</strong>
                <span className="ui-donut-legend-pct">{pct.toFixed(0)}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
