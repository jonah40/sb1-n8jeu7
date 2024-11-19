import React from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Employee } from '../types';
import { calculateNetSalary } from '../utils/salary';

interface Props {
  employees: Employee[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEdit: (employee: Employee) => void;
}

export default function EmployeeList({ employees, onAdd, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">员工列表</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          添加员工
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">姓名</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">职位</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">基本工资</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">奖金</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">保险</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">税收</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">实发工资</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
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
                  <td className="px-4 py-3">{employee.baseSalary.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.bonus.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.insurance.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.tax.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">{netSalary.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
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