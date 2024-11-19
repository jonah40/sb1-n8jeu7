import { create } from 'zustand';
import { AuthState, User } from '../types';

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  login: (username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      set({ user });
      return true;
    }
    return false;
  },
  register: (username: string, password: string, role: 'admin' | 'user') => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    if (users.some((u) => u.username === username)) {
      return false;
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password,
      role,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    set({ user: newUser });
    return true;
  },
  logout: () => {
    set({ user: null });
  },
}));

export default useAuthStore;