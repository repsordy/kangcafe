import './comm/css/main.css';
import { state } from './comm/ts/store';
import { renderLogin } from './comm/ts/login';
import { renderDashboard } from './comm/ts/dashboard';

function appRender() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  if (!state.isLoggedIn) {
    app.innerHTML = renderLogin(appRender);
  } else {
    app.innerHTML = renderDashboard(appRender);
  }
}

appRender();