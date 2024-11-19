export interface Employee {
  id: string;
  name: string;
  position: string;
  baseSalary: number;
  bonus: number;
  insurance: number;
  tax: number;
}

export interface SalaryReport {
  totalSalary: number;
  averageSalary: number;
  highestSalary: number;
  lowestSalary: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, role: 'admin' | 'user') => boolean;
  logout: () => void;
}