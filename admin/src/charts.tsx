import { useEffect, useId, useRef, useState } from "react";

// Dependency-free SVG charts for the dashboard.

export type Series = { name: string; color: string; values: number[]; area?: boolean };

/** Smooth path through points (monotone-ish Catmull-Rom → Bezier, clamped so it never overshoots). */
function smooth(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const lo = Math.min(p1[1], p2[1]), hi = Math.max(p1[1], p2[1]);
    const c1y = Math.min(hi, Math.max(lo, p1[1] + (p2[1] - p0[1]) / 6));
    const c2y = Math.min(hi, Math.max(lo, p2[1] - (p3[1] - p1[1]) / 6));
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${c1y} ${p2[0] - (p3[0] - p1[0]) / 6},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const niceMax = (v: number) => {
  if (v <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * step >= v) return m * step;
  return v;
};

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Tiny trend line for KPI cards. */
export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const id = useId().replace(/:/g, "");
  const W = 120, H = 36, pad = 3;
  const max = Math.max(1, ...values);
  const pts: [number, number][] = values.map((v, i) => [
    pad + (i * (W - pad * 2)) / Math.max(1, values.length - 1),
    H - pad - (v / max) * (H - pad * 2),
  ]);
  const line = smooth(pts);
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {line && <path d={`${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`} fill={`url(#${id})`} />}
      {line && <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

/** Multi-series line/area chart with y grid, x labels and a hover tooltip. */
export function TrendChart({ labels, tips, series, height = 260 }: { labels: string[]; tips?: string[]; series: Series[]; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const uid = useId().replace(/:/g, "");
  const m = { t: 12, r: 14, b: 28, l: 34 };
  const W = Math.max(width, 240), H = height;
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const top = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const ticks = [0, 1, 2, 3, 4].map((i) => (top * i) / 4);
  const x = (i: number) => m.l + (labels.length < 2 ? iw / 2 : (i * iw) / (labels.length - 1));
  const y = (v: number) => m.t + ih - (v / top) * ih;
  const every = Math.ceil(labels.length / Math.max(2, Math.floor(iw / 48)));
  const summary = series.map((s) => `${s.name}: ${s.values.reduce((a, b) => a + b, 0)} total`).join(", ");

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - m.l) / iw) * (labels.length - 1));
    setHover(Math.min(labels.length - 1, Math.max(0, i)));
  };

  return (
    <div className="chart" ref={ref} style={{ height }}>
      {width > 0 && (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Monthly trend. ${summary}`}
          onPointerMove={onMove} onPointerLeave={() => setHover(null)} onPointerDown={onMove}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`${uid}${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity=".22" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} className="grid" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="axis">{Number.isInteger(t) ? t : t.toFixed(1)}</text>
            </g>
          ))}
          {labels.map((l, i) => i % every === 0 && (
            <text key={l + i} x={x(i)} y={H - 8} textAnchor="middle" className="axis">{l}</text>
          ))}
          {series.map((s, i) => {
            const pts = s.values.map((v, j) => [x(j), y(v)] as [number, number]);
            const line = smooth(pts);
            return (
              <g key={s.name}>
                {s.area && <path d={`${line} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={`url(#${uid}${i})`} />}
                <path d={line} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {labels.length <= 8 && pts.map(([px, py], j) => <circle key={j} cx={px} cy={py} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />)}
              </g>
            );
          })}
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} className="guide" />
              {series.map((s) => <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="5" fill={s.color} stroke="#fff" strokeWidth="2" />)}
            </g>
          )}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div className="tip" style={{ left: Math.min(Math.max(x(hover), 70), W - 70) }}>
          <b>{(tips ?? labels)[hover]}</b>
          {series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name} <b>{s.values[hover]}</b></span>)}
        </div>
      )}
    </div>
  );
}