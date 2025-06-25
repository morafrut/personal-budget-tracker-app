
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

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
}

export interface MonthlyIncome {
  id: string;
  month: string;
  amount: number;
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
