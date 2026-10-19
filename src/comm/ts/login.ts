// src/comm/ts/login.ts
import { state } from './store';

export function renderLogin(onLoginSuccess: () => void): string {
  setTimeout(() => {
    const form = document.querySelector('#login-form') as HTMLFormElement;
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = (document.querySelector('#login-id') as HTMLInputElement).value;
      const password = (document.querySelector('#login-pw') as HTMLInputElement).value;
      const errorMsgEl = document.querySelector('#error-msg') as HTMLElement;

      try {
        // 상대 경로 '/api/login'을 이용해 Vercel 서버리스 함수 호출
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
          state.isLoggedIn = true;
          if (data.user && data.user.name) {
            state.userName = data.user.name; // 사용자 이름 저장
          }
          onLoginSuccess();
        } else {
          if (errorMsgEl) errorMsgEl.innerText = data.message;
        }
      } catch (err) {
        console.error('통신 에러:', err);
        if (errorMsgEl) errorMsgEl.innerText = '서버와 연결할 수 없습니다.';
      }
    });
  }, 0);

  return `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6;">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); width: 100%; max-width: 380px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 8px;">☕ 강카페 관리자</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">NeonDB 계정으로 로그인해주세요.</p>
        
        <form id="login-form" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="text" id="login-id" placeholder="아이디" required style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;" />
          <input type="password" id="login-pw" placeholder="비밀번호" required style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;" />
          <button type="submit" style="padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 6px;">로그인</button>
        </form>
        <p id="error-msg" style="font-size: 13px; color: #dc2626; margin-top: 14px; min-height: 20px;"></p>
      </div>
    </div>
  `;
}