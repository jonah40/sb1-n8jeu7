import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Employee } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { calculateNetSalary } from '../utils/salary';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
  const [employees] = useLocalStorage<Employee[]>('employees', []);
  const [selectedChart, setSelectedChart] = useState<'monthly' | 'position'>('monthly');

  // 按月份汇总工资数据
  const monthlyData = React.useMemo(() => {
    const salaryByMonth = new Map<string, number>();
    
    employees.forEach(emp => {
      const salary = calculateNetSalary(emp.baseSalary, emp.bonus, emp.insurance, emp.tax);
      salaryByMonth.set(
        emp.month,
        (salaryByMonth.get(emp.month) || 0) + salary
      );
    });

    return Array.from(salaryByMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, totalSalary]) => ({
        month,
        totalSalary,
      }));
  }, [employees]);

  // 按职位统计工资分布
  const positionData = React.useMemo(() => {
    const positionMap = new Map<string, number>();
    employees.forEach((emp) => {
      const salary = calculateNetSalary(
        emp.baseSalary,
        emp.bonus,
        emp.insurance,
        emp.tax
      );
      positionMap.set(
        emp.position,
        (positionMap.get(emp.position) || 0) + salary
      );
    });
    return Array.from(positionMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [employees]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">薪资报表分析</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedChart('monthly')}
              className={`px-4 py-2 rounded-lg ${
                selectedChart === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              月度趋势
            </button>
            <button
              onClick={() => setSelectedChart('position')}
              className={`px-4 py-2 rounded-lg ${
                selectedChart === 'position'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              职位分布
            </button>
          </div>
        </div>

        <div className="h-[400px]">
          {selectedChart === 'monthly' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `¥${value.toLocaleString()}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalSalary"
                  name="总工资"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={positionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    name,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius * 1.35;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#666"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {`${name}: ¥${value.toLocaleString()}`}
                      </text>
                    );
                  }}
                >
                  {positionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `¥${value.toLocaleString()}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}