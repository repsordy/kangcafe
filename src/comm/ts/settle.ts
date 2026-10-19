import { state } from './store';
import { emptyMsg, esc, sumBy, won } from './util';

export function renderSettle(onRender: () => void): string {
  setTimeout(() => {
    document.querySelector<HTMLInputElement>('#fee-rate')?.addEventListener('change', (e) => {
      const v = Number((e.target as HTMLInputElement).value);
      state.feeRate = Number.isFinite(v) ? Math.min(Math.max(v, 0), 100) : 0;
      onRender();
    });
  }, 0);

  if (!state.rows.length) return `<h3>정산</h3>${emptyMsg()}`;

  let totalAmt = 0;
  let totalFee = 0;
  const body = [...sumBy(state.rows, (r) => r.store).entries()]
    .map(([store, v]) => {
      const fee = Math.floor((v.amt * state.feeRate) / 100);
      totalAmt += v.amt;
      totalFee += fee;
      return `<tr><td>${esc(store)}</td><td class="r">${won(v.amt)}</td><td class="r">${won(fee)}</td><td class="r">${won(v.amt - fee)}</td></tr>`;
    })
    .join('');

  return `
    <h3>정산</h3>
    <p>수수료율 <input type="number" id="fee-rate" value="${state.feeRate}" min="0" max="100" step="0.1" style="width:70px" /> % <span class="kc-note">(샘플 값, 실제 정산 기준에 맞게 변경)</span></p>
    <table class="kc-table">
      <thead><tr><th>매장</th><th>매출</th><th>수수료</th><th>정산금액</th></tr></thead>
      <tbody>${body}</tbody>
      <tfoot><tr><th>합계</th><th class="r">${won(totalAmt)}</th><th class="r">${won(totalFee)}</th><th class="r">${won(totalAmt - totalFee)}</th></tr></tfoot>
    </table>
  `;
}
