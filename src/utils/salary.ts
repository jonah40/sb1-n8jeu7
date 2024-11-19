export const calculateNetSalary = (
  baseSalary: number,
  bonus: number,
  insurance: number,
  tax: number
): number => {
  return Math.max(0, baseSalary + bonus - insurance - tax);
};

export const calculateTax = (baseSalary: number, bonus: number): number => {
  const totalIncome = baseSalary + bonus;
  // 简单的累进税率计算
  if (totalIncome <= 5000) return 0;
  if (totalIncome <= 8000) return (totalIncome - 5000) * 0.03;
  if (totalIncome <= 17000) return (totalIncome - 8000) * 0.1 + 90;
  if (totalIncome <= 30000) return (totalIncome - 17000) * 0.2 + 990;
  return (totalIncome - 30000) * 0.25 + 3590;
};

export const calculateInsurance = (baseSalary: number): number => {
  // 社保计算（简化版）：养老保险8%，医疗保险2%，失业保险0.5%
  const pensionRate = 0.08;
  const medicalRate = 0.02;
  const unemploymentRate = 0.005;
  
  return baseSalary * (pensionRate + medicalRate + unemploymentRate);
};