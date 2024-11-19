import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { SalaryReport } from '../types';

interface Props {
  report: SalaryReport;
}

export default function SalaryRepor_1({ report }: Props) {
  const stats = [
    {
      title: '总工资支出',
      value: report.totalSalary.toLocaleString(),
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      title: '平均工资',
      value: report.averageSalary.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: '最高工资',
      value: report.highestSalary.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">¥ {stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}