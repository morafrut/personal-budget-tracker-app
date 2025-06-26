
import { useState, useEffect } from 'react';
import { FixedIncome, FixedExpense, Expense, SavingsGoal, MonthlyIncome } from '@/types/finance';

const STORAGE_KEYS = {
  FIXED_INCOMES: 'finance_fixed_incomes',
  FIXED_EXPENSES: 'finance_fixed_expenses',
  EXPENSES: 'finance_expenses',
  SAVINGS_GOALS: 'finance_savings_goals',
  MONTHLY_INCOMES: 'finance_monthly_incomes'
};

export const useFinanceData = () => {
  const [fixedIncomes, setFixedIncomes] = useState<FixedIncome[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [monthlyIncomes, setMonthlyIncomes] = useState<MonthlyIncome[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedFixedIncomes = localStorage.getItem(STORAGE_KEYS.FIXED_INCOMES);
        const savedFixedExpenses = localStorage.getItem(STORAGE_KEYS.FIXED_EXPENSES);
        const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        const savedSavingsGoals = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
        const savedMonthlyIncomes = localStorage.getItem(STORAGE_KEYS.MONTHLY_INCOMES);

        if (savedFixedIncomes) setFixedIncomes(JSON.parse(savedFixedIncomes));
        if (savedFixedExpenses) setFixedExpenses(JSON.parse(savedFixedExpenses));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        if (savedSavingsGoals) setSavingsGoals(JSON.parse(savedSavingsGoals));
        if (savedMonthlyIncomes) setMonthlyIncomes(JSON.parse(savedMonthlyIncomes));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Fixed Incomes
  const addFixedIncome = (income: Omit<FixedIncome, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    const updated = [...fixedIncomes, newIncome];
    setFixedIncomes(updated);
    saveToStorage(STORAGE_KEYS.FIXED_INCOMES, updated);
  };

  const updateFixedIncome = (id: string, income: Partial<FixedIncome>) => {
    const updated = fixedIncomes.map(item => 
      item.id === id ? { ...item, ...income } : item
    );
    setFixedIncomes(updated);
    saveToStorage(STORAGE_KEYS.FIXED_INCOMES, updated);
  };

  const deleteFixedIncome = (id: string) => {
    const updated = fixedIncomes.filter(item => item.id !== id);
    setFixedIncomes(updated);
    saveToStorage(STORAGE_KEYS.FIXED_INCOMES, updated);
  };

  // Fixed Expenses
  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const updated = [...fixedExpenses, newExpense];
    setFixedExpenses(updated);
    saveToStorage(STORAGE_KEYS.FIXED_EXPENSES, updated);
  };

  const updateFixedExpense = (id: string, expense: Partial<FixedExpense>) => {
    const updated = fixedExpenses.map(item => 
      item.id === id ? { ...item, ...expense } : item
    );
    setFixedExpenses(updated);
    saveToStorage(STORAGE_KEYS.FIXED_EXPENSES, updated);
  };

  const deleteFixedExpense = (id: string) => {
    const updated = fixedExpenses.filter(item => item.id !== id);
    setFixedExpenses(updated);
    saveToStorage(STORAGE_KEYS.FIXED_EXPENSES, updated);
  };

  // Expenses
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    saveToStorage(STORAGE_KEYS.EXPENSES, updated);
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    const updated = expenses.map(item => 
      item.id === id ? { ...item, ...expense } : item
    );
    setExpenses(updated);
    saveToStorage(STORAGE_KEYS.EXPENSES, updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(item => item.id !== id);
    setExpenses(updated);
    saveToStorage(STORAGE_KEYS.EXPENSES, updated);
  };

  // Savings Goals
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    saveToStorage(STORAGE_KEYS.SAVINGS_GOALS, updated);
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    const updated = savingsGoals.map(item => 
      item.id === id ? { ...item, ...goal } : item
    );
    setSavingsGoals(updated);
    saveToStorage(STORAGE_KEYS.SAVINGS_GOALS, updated);
  };

  const deleteSavingsGoal = (id: string) => {
    const updated = savingsGoals.filter(item => item.id !== id);
    setSavingsGoals(updated);
    saveToStorage(STORAGE_KEYS.SAVINGS_GOALS, updated);
  };

  // Monthly Incomes
  const addMonthlyIncome = (income: Omit<MonthlyIncome, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    const updated = [...monthlyIncomes, newIncome];
    setMonthlyIncomes(updated);
    saveToStorage(STORAGE_KEYS.MONTHLY_INCOMES, updated);
  };
  

  const updateMonthlyIncome = (id: string, income: Partial<MonthlyIncome>) => {
    const updated = monthlyIncomes.map(item => 
      item.id === id ? { ...item, ...income } : item
    );
    setMonthlyIncomes(updated);
    saveToStorage(STORAGE_KEYS.MONTHLY_INCOMES, updated);
  };

  const deleteMonthlyIncome = (id: string) => {
    const updated = monthlyIncomes.filter(item => item.id !== id);
    setMonthlyIncomes(updated);
    saveToStorage(STORAGE_KEYS.MONTHLY_INCOMES, updated);
  };

  return {
    // Data
    fixedIncomes,
    fixedExpenses,
    expenses,
    savingsGoals,
    monthlyIncomes,
    addFixedIncome,
    updateFixedIncome,
    deleteFixedIncome,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
    addExpense,
    updateExpense,
    deleteExpense,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addMonthlyIncome,
    updateMonthlyIncome,
    deleteMonthlyIncome,
  };
};
