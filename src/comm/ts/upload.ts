import { readSheet } from 'read-excel-file/browser';
import { state, type SaleRow } from './store';
import { esc, won } from './util';

const HEADERS = ['일자', '매장', '메뉴', '수량', '단가'];

export function parseRows(data: unknown[][]): { rows: SaleRow[]; skipped: number } {
  const head = (data[0] ?? []).map((h) => String(h ?? '').trim());
  const idx = HEADERS.map((h) => head.indexOf(h));
  if (idx.includes(-1)) throw new Error(`헤더가 맞지 않습니다. (${HEADERS.join(', ')})`);

  const rows: SaleRow[] = [];
  let skipped = 0;
  for (const r of data.slice(1)) {
    const [d, store, menu, qty, price] = idx.map((i) => r[i]);
    const date = d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? '').trim();
    const q = Number(qty);
    const p = Number(price);
    if (!date || !store || !menu || !Number.isFinite(q) || !Number.isFinite(p)) {
      skipped++;
      continue;
    }
    rows.push({ date, store: String(store).trim(), menu: String(menu).trim(), qty: q, price: p });
  }
  return { rows, skipped };
}

export function renderUpload(onRender: () => void): string {
  setTimeout(() => {
    document.querySelector<HTMLInputElement>('#file-input')?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const { rows, skipped } = parseRows((await readSheet(file)) as unknown[][]);
        state.rows = rows;
        state.uploadMsg = `${rows.length}건 업로드 완료` + (skipped ? ` (형식 오류 ${skipped}건 제외)` : '');
      } catch (err) {
        state.uploadMsg = err instanceof Error ? err.message : '파일을 읽을 수 없습니다.';
      }
      onRender();
    });
  }, 0);

  const preview = state.rows
    .slice(0, 10)
    .map((r) => `<tr><td>${esc(r.date)}</td><td>${esc(r.store)}</td><td>${esc(r.menu)}</td><td class="r">${r.qty}</td><td class="r">${won(r.price)}</td></tr>`)
    .join('');

  return `
    <h3>엑셀 업로드</h3>
    <p>컬럼: ${HEADERS.join(' / ')} · <a href="/sample_sales.xlsx" download>샘플 파일 받기</a></p>
    <input type="file" id="file-input" accept=".xlsx" />
    <p class="kc-msg">${esc(state.uploadMsg)}</p>
    ${preview ? `<table class="kc-table"><thead><tr><th>일자</th><th>매장</th><th>메뉴</th><th>수량</th><th>단가</th></tr></thead><tbody>${preview}</tbody></table><p class="kc-note">상위 10건만 표시</p>` : ''}
  `;
}
