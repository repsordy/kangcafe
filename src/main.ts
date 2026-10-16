import './comm/css/main.css';
import { state } from './comm/js/store';
import { renderLogin } from './comm/js/login';
import { renderDashboard } from './comm/js/dashboard';

function appRender() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  if (!state.isLoggedIn) {
    app.innerHTML = renderLogin(appRender);
  } else {
    app.innerHTML = renderDashboard(appRender);
  }
}

appRender();