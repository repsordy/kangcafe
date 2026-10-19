import { state } from './store';
import { esc } from './util';
import { renderUpload } from './upload';
import { renderStats, summaryCards } from './stats';
import { renderChart } from './chart';
import { renderSettle } from './settle';

const MENUS: [string, string][] = [
  ['dashboard', '요약'],
  ['upload', '엑셀 업로드'],
  ['stats', '통계'],
  ['chart', '차트'],
  ['settle', '정산'],
];

export function renderDashboard(onRender: () => void): string {
  setTimeout(() => {
    document.querySelectorAll<HTMLButtonElement>('[data-menu]').forEach((b) =>
      b.addEventListener('click', () => {
        state.currentMenu = b.dataset.menu!;
        onRender();
      }),
    );
    document.querySelector('#logout-btn')?.addEventListener('click', () => {
      state.isLoggedIn = false;
      state.userName = '';
      state.rows = [];
      state.uploadMsg = '';
      state.currentMenu = 'dashboard';
      onRender();
    });
  }, 0);

  const content: Record<string, () => string> = {
    dashboard: () => `<h3>요약</h3>${state.rows.length ? summaryCards() : '<p class="kc-empty">엑셀 업로드 메뉴에서 샘플 파일을 올려보세요.</p>'}`,
    upload: () => renderUpload(onRender),
    stats: renderStats,
    chart: renderChart,
    settle: () => renderSettle(onRender),
  };

  const nav = MENUS.map(
    ([k, n]) => `<button data-menu="${k}" class="kc-nav${k === state.currentMenu ? ' on' : ''}">${n}</button>`,
  ).join('');

  return `
    <div class="kc-wrap">
      <aside class="kc-side"><h2>☕ 강카페</h2>${nav}</aside>
      <main class="kc-main">
        <header class="kc-head"><span>${esc(state.userName)}님</span><button id="logout-btn">로그아웃</button></header>
        ${content[state.currentMenu]()}
      </main>
    </div>
  `;
}
