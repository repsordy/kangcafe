import { state } from './store';
import { emptyMsg, esc, sumBy } from './util';

const W = 640;
const H = 260;
const L = 70;
const B = 40;
const T = 20;

const scale = (max: number) => (v: number) => H - B - (max ? (v / max) * (H - B - T) : 0);

function bar(labels: string[], values: number[]): string {
  const max = Math.max(...values);
  const y = scale(max);
  const step = (W - L) / labels.length;
  const items = labels
    .map((l, i) => {
      const x = L + i * step + step * 0.15;
      const w = step * 0.7;
      return `<rect x="${x}" y="${y(values[i])}" width="${w}" height="${H - B - y(values[i])}" fill="#2563eb"/>
        <text x="${x + w / 2}" y="${y(values[i]) - 4}" font-size="10" text-anchor="middle">${values[i].toLocaleString('ko-KR')}</text>
        <text x="${x + w / 2}" y="${H - B + 16}" font-size="11" text-anchor="middle">${esc(l)}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="kc-svg"><line x1="${L}" y1="${H - B}" x2="${W}" y2="${H - B}" stroke="#94a3b8"/>${items}</svg>`;
}

function line(labels: string[], values: number[]): string {
  const max = Math.max(...values);
  const y = scale(max);
  const step = (W - L) / Math.max(labels.length - 1, 1);
  const pts = values.map((v, i) => `${L + i * step},${y(v)}`);
  const dots = values.map((v, i) => `<circle cx="${L + i * step}" cy="${y(v)}" r="3" fill="#2563eb"/>`).join('');
  const every = Math.ceil(labels.length / 8);
  const xs = labels
    .map((l, i) => (i % every ? '' : `<text x="${L + i * step}" y="${H - B + 16}" font-size="10" text-anchor="middle">${esc(l.slice(5))}</text>`))
    .join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="kc-svg"><line x1="${L}" y1="${H - B}" x2="${W}" y2="${H - B}" stroke="#94a3b8"/><text x="4" y="${T}" font-size="10">최대 ${max.toLocaleString('ko-KR')}</text><polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2"/>${dots}${xs}</svg>`;
}

export function renderChart(): string {
  if (!state.rows.length) return `<h3>차트</h3>${emptyMsg()}`;
  const byMenu = [...sumBy(state.rows, (r) => r.menu).entries()].sort((a, b) => b[1].amt - a[1].amt);
  const byDate = [...sumBy(state.rows, (r) => r.date).entries()].sort((a, b) => a[0].localeCompare(b[0]));
  return `
    <h3>차트</h3>
    <h4>메뉴별 매출</h4>${bar(byMenu.map((e) => e[0]), byMenu.map((e) => e[1].amt))}
    <h4>일자별 매출</h4>${line(byDate.map((e) => e[0]), byDate.map((e) => e[1].amt))}
  `;
}
