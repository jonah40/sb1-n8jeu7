import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit, Search, FileDown, CheckCircle } from 'lucide-react';
import { Employee } from '../types';
import { calculateNetSalary } from '../utils/salary';

interface Props {
  employees: Employee[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (employee: Employee) => void;
  onExport: () => void;
  onUpdateStatus: (id: string, status: 'pending' | 'paid') => void;
}

export default function EmployeeList({ 
  employees, 
  onAdd, 
  onDelete, 
  onEdit, 
  onExport,
  onUpdateStatus 
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 获取所有唯一的职位和月份
  const positions = ['all', ...new Set(employees.map(emp => emp.position))];
  const months = ['all', ...new Set(employees.map(emp => emp.month))].sort();

  // 过滤员工列表
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || employee.position === positionFilter;
    const matchesMonth = monthFilter === 'all' || employee.month === monthFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesPosition && matchesMonth && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">员工列表</h2>
        <div className="flex gap-4">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileDown size={18} />
            导出Excel
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={18} />
            添加员工
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索员工姓名或职位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {positions.map(position => (
            <option key={position} value={position}>
              {position === 'all' ? '所有职位' : position}
            </option>
          ))}
        </select>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {months.map(month => (
            <option key={month} value={month}>
              {month === 'all' ? '所有月份' : month}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">所有状态</option>
          <option value="pending">待发放</option>
          <option value="paid">已发放</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">职位</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">发薪月份</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">基本工资</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">奖金</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">保险</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">税收</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">实发工资</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const netSalary = calculateNetSalary(
                employee.baseSalary,
                employee.bonus,
                employee.insurance,
                employee.tax
              );
              return (
                <tr key={employee.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.name}</td>
                  <td className="px-4 py-3">{employee.position}</td>
                  <td className="px-4 py-3">{employee.month}</td>
                  <td className="px-4 py-3">{employee.baseSalary.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.bonus.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.insurance.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.tax.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">{netSalary.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {employee.status === 'paid' ? '已发放' : '待发放'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      {employee.status === 'pending' && (
                        <button
                          onClick={() => onUpdateStatus(employee.id, 'paid')}
                          className="text-green-600 hover:text-green-800"
                          title="标记为已发放"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}