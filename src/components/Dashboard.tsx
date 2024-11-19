import React from 'react';
import { Building2, LogOut, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import SalaryReport from './SalaryReport';
import { Employee, SalaryReport as SalaryReportType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateNetSalary } from '../utils/salary';
import { exportToExcel } from '../utils/excel';
import useAuthStore from '../store/authStore';

const calculateReport = (employees: Employee[]): SalaryReportType => {
  if (employees.length === 0) {
    return {
      totalSalary: 0,
      averageSalary: 0,
      highestSalary: 0,
      lowestSalary: 0,
    };
  }

  const netSalaries = employees.map((emp) =>
    calculateNetSalary(emp.baseSalary, emp.bonus, emp.insurance, emp.tax)
  );

  return {
    totalSalary: netSalaries.reduce((a, b) => a + b, 0),
    averageSalary: netSalaries.reduce((a, b) => a + b, 0) / employees.length,
    highestSalary: Math.max(...netSalaries),
    lowestSalary: Math.min(...netSalaries),
  };
};

export default function Dashboard() {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', []);
  const [showForm, setShowForm] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | undefined>();
  
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportExcel = () => {
    exportToExcel(employees);
  };

  const handleSaveEmployee = (employee: Employee) => {
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) => (emp.id === employee.id ? employee : emp))
      );
    } else {
      setEmployees([...employees, employee]);
    }
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('确定要删除该员工吗？')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                薪酬管理系统
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileDown size={18} />
                导出Excel
              </button>
              <span className="text-gray-600">
                欢迎，{user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={18} />
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SalaryReport report={calculateReport(employees)} />
        <EmployeeList
          employees={employees}
          onAdd={() => setShowForm(true)}
          onDelete={handleDeleteEmployee}
          onEdit={handleEditEmployee}
        />
        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onClose={() => {
              setShowForm(false);
              setEditingEmployee(undefined);
            }}
          />
        )}
      </main>
    </div>
  );
}