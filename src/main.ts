import './style.css'

let currentTab = 'dashboard';
let orders = [
  { id: 1, menu: '아메리카노 (ICE)', qty: 2, status: '준비중', time: '10:42' },
  { id: 2, menu: '카페 라떼 (HOT)', qty: 1, status: '완료', time: '10:35' },
  { id: 3, menu: '치즈 케이크', qty: 1, status: '완료', time: '10:20' },
];

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; min-height: 100vh;">
      
      <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px;">
        <h1 style="margin: 0; font-size: 22px; color: #333;">☕ 강카페 통합 관리자</h1>
        <div>
          <button id="tab-dashboard" style="padding: 6px 12px; margin-right: 5px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'dashboard' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'dashboard' ? 'white' : '#333'}; font-weight: bold;">대시보드</button>
          <button id="tab-game" style="padding: 6px 12px; cursor: pointer; border: none; border-radius: 4px; background-color: ${currentTab === 'game' ? '#2563eb' : '#e5e7eb'}; color: ${currentTab === 'game' ? 'white' : '#333'}; font-weight: bold;">🎮 똥피하기</button>
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

      <div id="view-game" style="display: ${currentTab === 'game' ? 'block' : 'none'}; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #333; margin-top: 0;">💩 원두 똥피하기 게임</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">좌우 방향키 또는 마우스로 컵을 움직여 떨어지는 원두를 피하세요!</p>
        <canvas id="gameCanvas" width="400" height="400" style="background: #1e293b; border-radius: 8px; display: block; margin: 0 auto; cursor: pointer;"></canvas>
        <button id="start-game-btn" style="margin-top: 15px; padding: 8px 16px; background-color: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">게임 시작 / 재시작</button>
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
    initGame();
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
}

// 똥피하기 게임 로직
function initGame() {
  const canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D; // <--- 이 부분에 'as CanvasRenderingContext2D'를 붙여줍니다.
  if (!ctx) return;
  
  let playerX = 180;
  const playerY = 350;
  const playerWidth = 40;
  const playerHeight = 30;

  let obstacles: { x: number; y: number; speed: number }[] = [];
  let score = 0;
  let isPlaying = false;
  let animationId: number;

  // 마우스 움직임으로 조작
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    playerX = e.clientX - rect.left - playerWidth / 2;
    if (playerX < 0) playerX = 0;
    if (playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
  });

  document.querySelector('#start-game-btn')?.addEventListener('click', () => {
    obstacles = [];
    score = 0;
    isPlaying = true;
    cancelAnimationFrame(animationId);
    loop();
  });

  function loop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 플레이어(카페 컵) 그리기
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // 장애물(원두) 생성
    if (Math.random() < 0.05) {
      obstacles.push({
        x: Math.random() * (canvas.width - 20),
        y: 0,
        speed: 3 + Math.random() * 4
      });
    }

    // 장애물 이동 및 충돌 체크
    ctx.fillStyle = '#f59e0b';
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let obs = obstacles[i];
      obs.y += obs.speed;
      ctx.fillRect(obs.x, obs.y, 20, 20);

      // 충돌 체크
      if (
        obs.x < playerX + playerWidth &&
        obs.x + 20 > playerX &&
        obs.y < playerY + playerHeight &&
        obs.y + 20 > playerY
      ) {
        isPlaying = false;
        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText(`게임 종료! 점수: ${score}`, 90, 200);
        return;
      }

      // 화면 아래로 나가면 점수 증가 후 제거
      if (obs.y > canvas.height) {
        obstacles.splice(i, 1);
        score += 10;
      }
    }

    // 점수 표시
    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.fillText(`점수: ${score}`, 15, 25);

    animationId = requestAnimationFrame(loop);
  }
}

render();