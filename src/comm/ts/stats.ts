import { state } from './store';
import { emptyMsg, esc, sumBy, won, type Agg } from './util';

export function summaryCards(): string {
  const qty = state.rows.reduce((s, r) => s + r.qty, 0);
  const amt = state.rows.reduce((s, r) => s + r.qty * r.price, 0);
  const card = (t: string, v: string) => `<div class="kc-card"><div class="kc-card-t">${t}</div><div class="kc-card-v">${v}</div></div>`;
  return `<div class="kc-cards">${card('거래 건수', state.rows.length.toLocaleString('ko-KR') + '건')}${card('총 판매수량', qty.toLocaleString('ko-KR') + '개')}${card('총 매출', won(amt))}</div>`;
}

function table(title: string, m: Map<string, Agg>): string {
  const body = [...m.entries()]
    .sort((a, b) => b[1].amt - a[1].amt)
    .map(([k, v]) => `<tr><td>${esc(k)}</td><td class="r">${v.qty.toLocaleString('ko-KR')}</td><td class="r">${won(v.amt)}</td></tr>`)
    .join('');
  return `<h4>${title}</h4><table class="kc-table"><thead><tr><th>${title.replace('별', '')}</th><th>수량</th><th>매출</th></tr></thead><tbody>${body}</tbody></table>`;
}

export function renderStats(): string {
  if (!state.rows.length) return `<h3>통계</h3>${emptyMsg()}`;
  return `<h3>통계</h3>${summaryCards()}${table('매장별', sumBy(state.rows, (r) => r.store))}${table('메뉴별', sumBy(state.rows, (r) => r.menu))}`;
}
