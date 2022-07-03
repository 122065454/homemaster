export default {
  wallet: () => import('./wallet'),
  deposit: () => import('./deposit'),
  withdraw: () => import('./withdraw'),
  selectToken: () => import('./selectToken'),
}