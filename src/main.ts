import './style.css'

let currentTab = 'dashboard';
let orders = [
  { id: 1, menu: '아메리카노 (ICE)', qty: 2, status: '준비중', time: '10:42' },
  { id: 2, menu: '카페 라떼 (HOT)', qty: 1, status: '완료', time: '10:35' },
  { id: 3, menu: '치즈 케이크', qty: 1, status: '완료', time: '10:20' },
];

let targetNumber = Math.floor(Math.random() * 50) + 1;
let attempts = 0;
let gameMessage = '1부터 50 사이의 숫자를 맞춰보세요!';

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; min-height: 100vh;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
        <h1 style="margin: 0; font-size: 22px; color: #333;">☕ 강카페 통합 관리자</h1>
        <div>
          <button id="tab-dashboard" style="padding: 6px 12px; margin-right: 5px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'dashboard' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'dashboard' ? 'white' : '#333'}; font-weight: bold;">대시보드</button>
          <button id="tab-game" style="padding: 6px 12px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'game' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'game' ? 'white' : '#333'}; font-weight: bold;">🎮 미니게임</button>
        </div>
      </header>

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

      <div id="view-game" style="display: ${currentTab === 'game' ? 'block' : 'none'}; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #333; margin-top: 0;">🎯 카페 쉬는 시간 숫자 맞추기</h2>
        <p style="color: #666; margin-bottom: 20px;">${gameMessage}</p>
        <div style="margin-bottom: 20px;">
          <input type="number" id="guess-input" placeholder="1~50 숫자 입력" style="padding: 10px; font-size: 16px; width: 150px; border: 1px solid #ccc; border-radius: 4px; text-align: center;" />
          <button id="guess-btn" style="padding: 10px 20px; font-size: 16px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">확인</button>
        </div>
        <p style="font-size: 14px; color: #888;">시도 횟수: <b>${attempts}회</b></p>
        <button id="reset-game" style="padding: 6px 12px; background-color: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">다시 하기</button>
      </div>

    </div>
  `;

  document.querySelector('#tab-dashboard')?.addEventListener('click', () => {
    currentTab = 'dashboard';
    render();
  });

  document.querySelector('#tab-game')?.addEventListener('click', () => {
    currentTab = 'game';
    render();
  });

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

  document.querySelector('#guess-btn')?.addEventListener('click', () => {
    const inputEl = document.querySelector('#guess-input') as HTMLInputElement;
    const val = Number(inputEl.value);
    if (!val) return;

    attempts++;
    if (val === targetNumber) {
      gameMessage = `🎉 정답입니다! ${targetNumber}을(를) ${attempts}회 만에 맞추셨습니다!`;
    } else if (val < targetNumber) {
      gameMessage = `📈 UP! 더 큰 숫자입니다.`;
    } else {
      gameMessage = `📉 DOWN! 더 작은 숫자입니다.`;
    }
    render();
  });

  document.querySelector('#reset-game')?.addEventListener('click', () => {
    targetNumber = Math.floor(Math.random() * 50) + 1;
    attempts = 0;
    gameMessage = '새 게임 시작! 1부터 50 사이의 숫자를 맞춰보세요!';
    render();
  });
}

render();