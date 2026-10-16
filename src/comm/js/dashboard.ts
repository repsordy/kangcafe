import { state } from './store';

export function renderDashboard(onRender: () => void): string {
  setTimeout(() => {
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const menu = (e.currentTarget as HTMLElement).getAttribute('data-menu');
        if (menu) {
          state.currentMenu = menu;
          onRender();
        }
      });
    });

    document.querySelector('#logout-btn')?.addEventListener('click', () => {
      state.isLoggedIn = false;
      onRender();
    });

    document.querySelectorAll('.status-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = Number((e.currentTarget as HTMLElement).getAttribute('data-id'));
        state.orders = state.orders.map(o => o.id === id ? { ...o, status: o.status === '준비중' ? '완료' : '준비중' } : o);
        onRender();
      });
    });

    document.querySelector('#draw-btn')?.addEventListener('click', () => {
      if (state.isDrawing) return;
      state.isDrawing = true;
      state.lotteryResult = '두근두근 추첨 중입니다... ☕';
      onRender();

      setTimeout(() => {
        const menus = [
          '🎉 당첨! 아이스 아메리카노 무료 쿠폰!',
          '☕ 진한 카페 라떼 한 잔 서비스!',
          '🍰 달콤한 치즈 케이크 50% 할인!',
          '🍵 향긋한 유자차 서비스!'
        ];
        state.lotteryResult = menus[Math.floor(Math.random() * menus.length)];
        state.isDrawing = false;
        onRender();
      }, 800);
    });
  }, 0);

  return `
    <div style="display: flex; height: 100vh; overflow: hidden;">
      <aside style="width: 240px; background-color: #1e293b; color: white; display: flex; flex-direction: column;">
        <div style="padding: 20px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #334155;">☕ 강카페 Admin</div>
        <nav style="padding: 20px 10px; display: flex; flex-direction: column; gap: 8px; flex: 1;">
          <button class="menu-btn" data-menu="dashboard" style="text-align: left; padding: 12px 16px; background: ${state.currentMenu === 'dashboard' ? '#2563eb' : 'transparent'}; color: white; border: none; border-radius: 6px; cursor: pointer;">📊 종합 대시보드</button>
          <button class="menu-btn" data-menu="orders" style="text-align: left; padding: 12px 16px; background: ${state.currentMenu === 'orders' ? '#2563eb' : 'transparent'}; color: white; border: none; border-radius: 6px; cursor: pointer;">📋 주문 관리</button>
          <button class="menu-btn" data-menu="game" style="text-align: left; padding: 12px 16px; background: ${state.currentMenu === 'game' ? '#2563eb' : 'transparent'}; color: white; border: none; border-radius: 6px; cursor: pointer;">🎲 모바일 뽑기</button>
        </nav>
      </aside>

      <div style="flex: 1; display: flex; flex-direction: column; overflow-y: auto;">
        <header style="height: 60px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; padding: 0 24px;">
          <span style="font-size: 16px; font-weight: bold;">관리자 페이지</span>
          <button id="logout-btn" style="padding: 6px 12px; background-color: #fee2e2; color: #dc2626; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">로그아웃</button>
        </header>

        <main style="padding: 30px;">
          ${state.currentMenu === 'dashboard' ? `
            <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3>오늘 총 매출: 148,000원</h3>
              <p>신규 주문 건수: 3건</p>
            </div>
          ` : ''}

          ${state.currentMenu === 'orders' ? `
            <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h3>실시간 주문 접수 현황</h3>
              <table style="width: 100%; border-collapse: collapse; text-align: left;">
                ${state.orders.map(o => `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 12px;">${o.time}</td>
                    <td style="padding: 12px; font-weight: bold;">${o.menu}</td>
                    <td style="padding: 12px;">${o.qty}개</td>
                    <td style="padding: 12px;">
                      <button data-id="${o.id}" class="status-btn" style="padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">${o.status} (변경)</button>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </div>
          ` : ''}

          ${state.currentMenu === 'game' ? `
            <div style="background: white; padding: 40px; border-radius: 8px; text-align: center;">
              <h2>🎁 서비스 메뉴 뽑기</h2>
              <p style="font-size: 18px; font-weight: bold; color: #15803d; margin: 20px 0;">${state.lotteryResult}</p>
              <button id="draw-btn" style="padding: 14px 28px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold;">${state.isDrawing ? '추첨 중...' : '🎲 뽑기 버튼'}</button>
            </div>
          ` : ''}
        </main>
      </div>
    </div>
  `;
}