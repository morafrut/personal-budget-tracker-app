export interface FinancialItemBase {
  id: string;
  name: string;
  amount: number;
  description?: string;
  date?: string;
  month?: string;
}

// Ingreso fijo
export interface FixedIncome extends FinancialItemBase {}

// Gasto fijo
export interface FixedExpense extends FinancialItemBase {}

// Gasto variable
export interface Expense extends FinancialItemBase {
  category: string;
  month: string;
  date: string;
}

// Ingreso variable
export interface MonthlyIncome extends FinancialItemBase {
  month: string;
  date: string;
}


/*
export interface FixedIncome {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  month: string;
  date: string;
}


export interface MonthlyIncome {
  id: string;
  month: string;
  amount: number;
  description?: string;
}
*/
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
}
export const EXPENSE_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Ropa',
  'Hogar',
  'Tecnología',
  'Otros'
] as const;

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const;
