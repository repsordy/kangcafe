export interface Order {
  id: number;
  menu: string;
  qty: number;
  status: string;
  time: string;
}

export const state = {
  isLoggedIn: false,
  currentMenu: 'dashboard',
  orders: [
    { id: 1, menu: '아메리카노 (ICE)', qty: 2, status: '준비중', time: '10:42' },
    { id: 2, menu: '카페 라떼 (HOT)', qty: 1, status: '완료', time: '10:35' },
    { id: 3, menu: '치즈 케이크', qty: 1, status: '완료', time: '10:20' },
  ] as Order[],
  lotteryResult: '버튼을 눌러 오늘의 메뉴를 뽑아보세요!',
  isDrawing: false,
};