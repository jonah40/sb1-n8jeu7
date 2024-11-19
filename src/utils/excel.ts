import * as XLSX from 'xlsx';
import { Employee } from '../types';
import { calculateNetSalary } from './salary';

export const exportToExcel = (employees: Employee[]) => {
  const workbook = XLSX.utils.book_new();
  
  // 准备员工数据
  const employeeData = employees.map((emp) => ({
    姓名: emp.name,
    职位: emp.position,
    基本工资: emp.baseSalary,
    奖金: emp.bonus,
    保险: emp.insurance,
    税收: emp.tax,
    实发工资: calculateNetSalary(emp.baseSalary, emp.bonus, emp.insurance, emp.tax),
  }));

  // 创建员工工资表
  const worksheet = XLSX.utils.json_to_sheet(employeeData);

  // 设置列宽
  const columnWidths = [
    { wch: 10 }, // 姓名
    { wch: 15 }, // 职位
    { wch: 12 }, // 基本工资
    { wch: 10 }, // 奖金
    { wch: 10 }, // 保险
    { wch: 10 }, // 税收
    { wch: 12 }, // 实发工资
  ];
  worksheet['!cols'] = columnWidths;

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '员工工资表');

  // 导出文件
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `薪酬报表_${date}.xlsx`);
};