import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Building2, LogOut, LayoutDashboard, PieChart } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: '工资管理', icon: LayoutDashboard },
    { path: '/reports', label: '报表分析', icon: PieChart },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-8">
            <Building2 className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">薪酬管理系统</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center justify-between text-gray-300 px-4 py-2">
            <span>{user?.username}</span>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-gray-100 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}