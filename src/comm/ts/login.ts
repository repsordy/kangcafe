import { state } from './store';

export function renderLogin(onLoginSuccess: () => void): string {
  setTimeout(() => {
    document.querySelector('#login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      state.isLoggedIn = true;
      onLoginSuccess();
    });
  }, 0);

  return `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f3f4f6;">
      <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); width: 100%; max-width: 380px; text-align: center;">
        <h2 style="color: #1f2937; margin-bottom: 8px;">☕ 강카페 관리자</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">관리자 계정으로 로그인해주세요.</p>
        
        <form id="login-form" style="display: flex; flex-direction: column; gap: 14px;">
          <input type="text" id="login-id" placeholder="아이디" value="admin" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;" />
          <input type="password" id="login-pw" placeholder="비밀번호" value="1234" style="padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px;" />
          <button type="submit" style="padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 6px;">로그인</button>
        </form>
      </div>
    </div>
  `;
}