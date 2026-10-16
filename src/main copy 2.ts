import './style.css'

let currentTab = 'dashboard';
let orders = [
  { id: 1, menu: '아메리카노 (ICE)', qty: 2, status: '준비중', time: '10:42' },
  { id: 2, menu: '카페 라떼 (HOT)', qty: 1, status: '완료', time: '10:35' },
  { id: 3, menu: '치즈 케이크', qty: 1, status: '완료', time: '10:20' },
];

// 모바일 친화적인 터치 미니게임 상태
let lotteryResult = '버튼을 눌러 오늘의 음료를 뽑아보세요!';
let isDrawing = false;

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; min-height: 100vh;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
        <h1 style="margin: 0; font-size: 22px; color: #333;">☕ 강카페 통합 관리자</h1>
        <div>
          <button id="tab-dashboard" style="padding: 6px 12px; margin-right: 5px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'dashboard' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'dashboard' ? 'white' : '#333'}; font-weight: bold;">대시보드</button>
          <button id="tab-game" style="padding: 6px 12px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'game' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'game' ? 'white' : '#333'}; font-weight: bold;">🎲 모바일 뽑기</button>
        </div>
      </header>

      <!-- 대시보드 화면 -->
      <div id="view-dashboard" style="display: ${currentTab === 'dashboard' ? 'block' : 'none'};">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; margin-bottom: 25px;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">오늘 총 매출</p>
            <h2 style="margin: 0; color: #2563eb;">148,000원</h2>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">신규 주문 건수</p>
            <h2 style="margin: 0; color: #d97706;">3건</h2>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">실시간 주문 접수 현황</h3>
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid #eee; color: #555; font-size: 14px;">
                <th style="padding: 10px;">시간</th>
                <th style="padding: 10px;">메뉴명</th>
                <th style="padding: 10px;">수량</th>
                <th style="padding: 10px;">상태</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr style="border-bottom: 1px solid #f2f2f2; font-size: 14px;">
                  <td style="padding: 12px 10px; color: #666;">${order.time}</td>
                  <td style="padding: 12px 10px; font-weight: bold;">${order.menu}</td>
                  <td style="padding: 12px 10px;">${order.qty}개</td>
                  <td style="padding: 12px 10px;">
                    <button data-id="${order.id}" class="status-btn" style="
                      padding: 5px 10px; border-radius: 4px; border: none; cursor: pointer;
                      background-color: ${order.status === '완료' ? '#e0f2fe' : '#fef3c7'};
                      color: ${order.status === '완료' ? '#0369a1' : '#b45309'}; font-weight: bold;
                    ">
                      ${order.status} (변경)
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 모바일 최적화 미니게임 화면 -->
      <div id="view-game" style="display: ${currentTab === 'game' ? 'block' : 'none'}; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #333; margin-top: 0;">🎁 오늘의 서비스 메뉴 뽑기</h2>
        <p style="color: #666; font-size: 15px; margin-bottom: 25px;">버튼을 터치하면 오늘의 행운의 음료가 골라집니다!</p>
        
        <div style="background: #f0fdf4; border: 2px dashed #bbf7d0; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <p id="lottery-result" style="font-size: 18px; font-weight: bold; color: #15803d; margin: 0;">${lotteryResult}</p>
        </div>

        <button id="draw-btn" style="width: 100%; max-width: 300px; padding: 15px; font-size: 18px; background-color: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ${isDrawing ? '추첨 중...' : '🎲 뽑기 버튼 터치!'}
        </button>
      </div>

    </div>
  `;

  // 탭 전환 이벤트
  document.querySelector('#tab-dashboard')?.addEventListener('click', () => {
    currentTab = 'dashboard';
    render();
  });

  document.querySelector('#tab-game')?.addEventListener('click', () => {
    currentTab = 'game';
    render();
  });

  // 주문 상태 변경 버튼
  document.querySelectorAll('.status-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = Number((e.currentTarget as HTMLElement).getAttribute('data-id'));
      orders = orders.map(o => {
        if (o.id === id) {
          return { ...o, status: o.status === '준비중' ? '완료' : '준비중' };
        }
        return o;
      });
      render();
    });
  });

  // 모바일 뽑기 버튼 이벤트
  document.querySelector('#draw-btn')?.addEventListener('click', () => {
    if (isDrawing) return;
    isDrawing = true;
    lotteryResult = '두근두근 추첨 중입니다... ☕';
    render();

    setTimeout(() => {
      const menus = [
        '🎉 당첨! 아이스 아메리카노 무료 쿠폰!',
        '☕ 진한 카페 라떼 한 잔 서비스!',
        '🍰 달콤한 치즈 케이크 50% 할인!',
        '🍵 향긋한 유자차 서비스!',
        '💧 시원한 생수한병 (꽝 아님 주의)'
      ];
      const randomIndex = Math.floor(Math.random() * menus.length);
      lotteryResult = menus[randomIndex];
      isDrawing = false;
      render();
    }, 800);
  });
}

render();