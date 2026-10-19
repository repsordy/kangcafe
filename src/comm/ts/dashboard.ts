import { state } from './store';

export function renderDashboard(onLogout: () => void): string {
  setTimeout(() => {
    document.querySelector('#logout-btn')?.addEventListener('click', () => {
      state.isLoggedIn = false;
      state.userName = '';
      onLogout();
    });
  }, 0);

  return `
    <div style="padding: 24px;">
      <header style="display: flex; justify-content: space-between; align-items: center;">
        <h2>☕ 강카페 관리자</h2>
        <div>
          <span>${state.userName}님</span>
          <button id="logout-btn" style="margin-left: 12px;">로그아웃</button>
        </div>
      </header>
    </div>
  `;
}