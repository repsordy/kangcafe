import type { SaleRow } from './store';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (v: unknown): string => String(v).replace(/[&<>"']/g, (c) => ESC[c]);

export const won = (n: number): string => n.toLocaleString('ko-KR') + '원';

export type Agg = { qty: number; amt: number };

export function sumBy(rows: SaleRow[], key: (r: SaleRow) => string): Map<string, Agg> {
  const m = new Map<string, Agg>();
  for (const r of rows) {
    const k = key(r);
    const a = m.get(k) ?? { qty: 0, amt: 0 };
    a.qty += r.qty;
    a.amt += r.qty * r.price;
    m.set(k, a);
  }
  return m;
}

export const emptyMsg = (): string =>
  '<p class="kc-empty">업로드된 데이터가 없습니다. 엑셀 업로드 메뉴에서 파일을 올려주세요.</p>';
