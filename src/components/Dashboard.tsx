import React from 'react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import SalaryReport from './SalaryReport';
import { Employee, SalaryReport as SalaryReportType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateNetSalary } from '../utils/salary';
import { exportToExcel } from '../utils/excel';

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

  const handleUpdateStatus = (id: string, status: 'pending' | 'paid') => {
    if (window.confirm('确定要将此工资标记为已发放吗？')) {
      setEmployees(
        employees.map((emp) =>
          emp.id === id ? { ...emp, status } : emp
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <SalaryReport report={calculateReport(employees)} />
      <EmployeeList
        employees={employees}
        onAdd={() => setShowForm(true)}
        onDelete={handleDeleteEmployee}
        onEdit={handleEditEmployee}
        onExport={handleExportExcel}
        onUpdateStatus={handleUpdateStatus}
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
    </div>
  );
}