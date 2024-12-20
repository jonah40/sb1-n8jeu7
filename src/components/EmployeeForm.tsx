import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Employee } from '../types';
import { calculateTax, calculateInsurance } from '../utils/salary';

interface Props {
  employee?: Employee;
  onSave: (employee: Employee) => void;
  onClose: () => void;
}

export default function EmployeeForm({ employee, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Employee, 'id' | 'status'>>({
    name: '',
    position: '',
    baseSalary: 0,
    bonus: 0,
    insurance: 0,
    tax: 0,
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    if (employee) {
      const { id, status, ...rest } = employee;
      setForm(rest);
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 自动计算税收和保险
    const calculatedTax = calculateTax(form.baseSalary, form.bonus);
    const calculatedInsurance = calculateInsurance(form.baseSalary);

    onSave({
      id: employee?.id || crypto.randomUUID(),
      ...form,
      tax: calculatedTax,
      insurance: calculatedInsurance,
      status: employee?.status || 'pending', // 新建员工默认为待发放状态
    });
  };

  const handleNumberInput = (value: string, field: keyof typeof form) => {
    const num = Number(value);
    if (num >= 0) {
      setForm({ ...form, [field]: num });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {employee ? '编辑员工' : '添加员工'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.trim() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              职位
            </label>
            <input
              type="text"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value.trim() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发薪月份
            </label>
            <input
              type="month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              基本工资
            </label>
            <input
              type="number"
              value={form.baseSalary}
              onChange={(e) => handleNumberInput(e.target.value, 'baseSalary')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              奖金
            </label>
            <input
              type="number"
              value={form.bonus}
              onChange={(e) => handleNumberInput(e.target.value, 'bonus')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min={0}
              step="0.01"
            />
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              税收和保险将根据工资自动计算
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}