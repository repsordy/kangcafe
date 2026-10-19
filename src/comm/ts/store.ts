export type SaleRow = { date: string; store: string; menu: string; qty: number; price: number };

export const state = {
  isLoggedIn: false,
  userName: '',
  currentMenu: 'dashboard',
  rows: [] as SaleRow[],
  uploadMsg: '',
  feeRate: 5,
};
