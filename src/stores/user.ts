import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);

export function checkAuthentication() {
  const token = localStorage.getItem('token');
  console.log(token);
  isAuthenticated.set(!!token);
}

export function logout() {
  localStorage.removeItem('token');
  isAuthenticated.set(false);
}

