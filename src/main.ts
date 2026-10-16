import './style.css'

// 대시보드 데이터 샘플
let orders = [
  { id: 1, menu: '아메리카노 (ICE)', qty: 2, status: '준비중', time: '10:42' },
  { id: 2, menu: '카페 라떼 (HOT)', qty: 1, status: '완료', time: '10:35' },
  { id: 3, menu: '치즈 케이크', qty: 1, status: '완료', time: '10:20' },
];

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; min-height: 100vh;">
      <!-- 상단 타이틀 -->
      <header style="display: flex; justifyContent: space-between; alignItems: center; marginBottom: 20px; borderBottom: 2px solid #ddd; paddingBottom: 10px;">
        <h1 style="margin: 0; fontSize: 24px; color: #333;">☕ 강카페 통합 관리자</h1>
        <span style="backgroundColor: #10b981; color: white; padding: 5px 10px; borderRadius: 15px; fontSize: 12px;">🟢 라이브 배포됨</span>
      </header>

      <!-- 통계 카드 섹션 -->
      <div style="display: grid; gridTemplateColumns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; marginBottom: 25px;">
        <div style="background: white; padding: 20px; borderRadius: 8px; boxShadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 0 0 5px 0; color: #666; fontSize: 14px;">오늘 총 매출</p>
          <h2 style="margin: 0; color: #2563eb;">148,000원</h2>
        </div>
        <div style="background: white; padding: 20px; borderRadius: 8px; boxShadow: 0 2px 4px rgba(0,0,0,0.05);">
          <p style="margin: 0 0 5px 0; color: #666; fontSize: 14px;">신규 주문 건수</p>
          <h2 style="margin: 0; color: #d97706;">3건</h2>
        </div>
      </div>

      <!-- 실시간 주문 현황 테이블 -->
      <div style="background: white; padding: 20px; borderRadius: 8px; boxShadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="marginTop: 0; marginBottom: 15px; color: #333;">실시간 주문 접수 현황</h3>
        <table style="width: 100%; borderCollapse: collapse; textAlign: left;">
          <thead>
            <tr style="borderBottom: 1px solid #eee; color: #555; fontSize: 14px;">
              <th style="padding: 10px;">시간</th>
              <th style="padding: 10px;">메뉴명</th>
              <th style="padding: 10px;">수량</th>
              <th style="padding: 10px;">상태</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(order => `
              <tr style="borderBottom: 1px solid #f2f2f2; fontSize: 14px;">
                <td style="padding: 12px 10px; color: #666;">${order.time}</td>
                <td style="padding: 12px 10px; fontWeight: bold;">${order.menu}</td>
                <td style="padding: 12px 10px;">${order.qty}개</td>
                <td style="padding: 12px 10px;">
                  <button data-id="${order.id}" class="status-btn" style="
                    padding: 5px 10px;
                    borderRadius: 4px;
                    border: none;
                    cursor: pointer;
                    backgroundColor: ${order.status === '완료' ? '#e0f2fe' : '#fef3c7'};
                    color: ${order.status === '완료' ? '#0369a1' : '#b45309'};
                    fontWeight: bold;
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
  `;

  // 버튼 클릭 이벤트 연결
  document.querySelectorAll('.status-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = Number((e.currentTarget as HTMLElement).getAttribute('data-id'));
      orders = orders.map(o => {
        if (o.id === id) {
          return { ...o, status: o.status === '준비중' ? '완료' : '준비중' };
        }
        return o;
      });
      render(); // 화면 다시 그리기
    });
  });
}

render();