export const getLocalStorage = () => ({
  token: localStorage.getItem('token'),
  tokenExp: localStorage.getItem('tokenExp'),
  account: localStorage.getItem('account'),
});

export function setLocalStorage(
  key: 'account' | 'token' | 'tokenExp',
  value: string,
) {
  localStorage.setItem(key, value);
}

export const clearLocalStorage = () => {
  localStorage.clear();
};
