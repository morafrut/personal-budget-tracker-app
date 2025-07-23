
import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { FinanceCard } from '@/components/FinanceCard';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { EditItemDialog } from '@/components/EditItemDialog';
import { EditSavingsGoalDialog } from '@/components/EditSavingsGoalDialog';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MONTHS } from '@/types/finance';
import { PiggyBank, DollarSign, Calendar, Sparkles, TrendingUp, Wallet, Heart } from 'lucide-react';

const Index = () => {
  const {
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
  } = useFinanceData();

  const [selectedMonth, setSelectedMonth] = useState<typeof MONTHS[number]>(MONTHS[new Date().getMonth()]);
  const [fixedIncomeForm, setFixedIncomeForm] = useState({ name: '', amount: '', description: '' });
  const [fixedExpenseForm, setFixedExpenseForm] = useState({ name: '', amount: '', description: '' });

  // Calculations
  const totalFixedIncome = fixedIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const currentMonthIncome = monthlyIncomes
    .filter(income => income.month === selectedMonth)
    .reduce((sum, income) => sum + income.amount, 0);
  
  const currentMonthExpenses = expenses
    .filter(expense => expense.month === selectedMonth)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const totalCurrentMonthIncome = totalFixedIncome + currentMonthIncome;
  const totalCurrentMonthExpenses = totalFixedExpenses + currentMonthExpenses;
  const monthlyBalance = totalCurrentMonthIncome - totalCurrentMonthExpenses;
  
  const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleAddFixedIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (fixedIncomeForm.name && fixedIncomeForm.amount) {
      addFixedIncome({
        name: fixedIncomeForm.name,
        amount: parseFloat(fixedIncomeForm.amount),
        description: fixedIncomeForm.description || undefined
      });
      setFixedIncomeForm({ name: '', amount: '', description: '' });
    }
  };

  const handleAddFixedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (fixedExpenseForm.name && fixedExpenseForm.amount) {
      addFixedExpense({
        name: fixedExpenseForm.name,
        amount: parseFloat(fixedExpenseForm.amount),
        description: fixedExpenseForm.description || undefined
      });
      setFixedExpenseForm({ name: '', amount: '', description: '' });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const currentMonthExpensesByCategory = expenses
    .filter(expense => expense.month === selectedMonth)
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-6">
        {/* Header - More compact on mobile */}
        <div className="text-center space-y-2 sm:space-y-4 animate-fade-in px-2">
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
            <Avatar className="h-12 w-12 sm:h-20 sm:w-20 lg:h-32 lg:w-32 border-2 border-pink-200 shadow-lg">
              <AvatarImage src="/images/corazon.jpg" />
              <AvatarFallback className="bg-gradient-to-br from-pink-200 to-rose-200 text-pink-700">
                <Heart className="h-3 w-3 sm:h-5 sm:w-5 lg:h-8 lg:w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-lg sm:text-xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 bg-clip-text text-transparent leading-tight">
                Gestor de finanzas 
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 animate-pulse" />
                <p className="text-xs sm:text-sm text-gray-600">tus finanzas pero coquette</p>
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Month selector - Smaller on mobile */}
        <div className="flex justify-center animate-fade-in px-2">
          <Card className="bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 shadow-lg w-full max-w-xs">
            <CardContent className="p-3">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-4 w-4 text-pink-600" />
                <Label htmlFor="month-select" className="text-pink-700 font-medium text-sm">Mes:</Label>
                <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value as typeof MONTHS[number])}>
                  <SelectTrigger id="month-select" className="w-full h-9 border-pink-200 bg-white/80 backdrop-blur-sm text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-pink-200">
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month} className="hover:bg-pink-50 text-sm">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards - Better mobile spacing */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 animate-fade-in px-2">
          <FinanceCard
            title="💰 Ingresos"
            amount={totalCurrentMonthIncome}
            subtitle={`${formatCurrency(totalFixedIncome)} fijos`}
            variant="income"
            className="text-xs sm:text-base"
          />
          <FinanceCard
            title="💸 Gastos"
            amount={totalCurrentMonthExpenses}
            subtitle={`${formatCurrency(totalFixedExpenses)} fijos`}
            variant="expense"
            className="text-xs sm:text-base"
          />
          <FinanceCard
            title="💎 Balance"
            amount={monthlyBalance}
            subtitle={selectedMonth}
            variant="balance"
            className="text-xs sm:text-base"
          />
          <FinanceCard
            title="🏦 Ahorros"
            amount={totalSavings}
            subtitle={`${savingsGoals.length} metas`}
            variant="savings"
            className="text-xs sm:text-base"
          />
        </div>

        {/* Tabs - More compact on mobile with all tabs visible */}
        <div className="px-1 sm:px-0">
          <Tabs defaultValue="dashboard" className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="    grid w-full grid-cols-2 sm:grid-cols-5 bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 shadow-lg py-2 sm:py-0  h-20       sm:h-9  min-w-max">
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800 px-2 py-1 text-xs whitespace-nowrap">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dash</span>
                </TabsTrigger>
                <TabsTrigger value="fixed" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800 px-2 py-1 text-xs whitespace-nowrap">
                  <Wallet className="h-3 w-3 mr-1" />
                  Fijos
                </TabsTrigger>
                <TabsTrigger value="expenses" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800 px-2 py-1 text-xs whitespace-nowrap">
                  💸 Gastos
                </TabsTrigger>
                <TabsTrigger value="incomes" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800 px-2 py-1 text-xs whitespace-nowrap">
                  💰 Ingresos
                </TabsTrigger>
                <TabsTrigger value="savings" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800 px-2 py-1 text-xs whitespace-nowrap">
                  <PiggyBank className="h-3 w-3 mr-1" />
                  Ahorros
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dashboard Content */}
            <TabsContent value="dashboard" className="space-y-3 mt-3">
              {/* Monthly expenses by category */}
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-pink-800 text-base">
                    <Sparkles className="h-4 w-4" />
                    Gastos de {selectedMonth} por Categoría
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {Object.keys(currentMonthExpensesByCategory).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(currentMonthExpensesByCategory).map(([category, amount]) => (
                        <div key={category} className="text-center p-3 bg-gradient-to-br from-rose-50 to-pink-100 rounded-lg border border-rose-200 shadow-md">
                          <div className="text-xs font-medium text-rose-800 mb-1 truncate">{category}</div>
                          <div className="text-sm font-bold text-rose-600">{formatCurrency(amount)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <PiggyBank className="h-8 w-8 mx-auto mb-2 text-pink-300" />
                      <p className="text-gray-500 text-sm">No hay gastos registrados para {selectedMonth}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent expenses */}
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-pink-800 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Gastos Recientes de {selectedMonth}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  {expenses.filter(expense => expense.month === selectedMonth).length > 0 ? (
                    <div className="space-y-2">
                      {expenses
                        .filter(expense => expense.month === selectedMonth)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5)
                        .map((expense) => (
                          <div key={expense.id} className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200 shadow-sm">
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap items-center gap-1">
                                <Badge variant="secondary" className="bg-pink-200 text-pink-800 border-pink-300 text-xs">
                                  {expense.category}
                                </Badge>
                                <span className="font-medium text-gray-800 text-sm truncate">{expense.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                                  {expense.date}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-rose-600 text-sm">{formatCurrency(expense.amount)}</span>
                                  <Button
                                    onClick={() => deleteExpense(expense.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="bg-rose-500 hover:bg-rose-600 text-xs h-7 px-2"
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Wallet className="h-8 w-8 mx-auto mb-2 text-pink-300" />
                      <p className="text-gray-500 text-sm">No hay gastos registrados para {selectedMonth}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fixed Incomes and Expenses */}
            <TabsContent value="fixed" className="space-y-6 mt-3">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Fixed Incomes */}
                <Card className="w-full bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Ingresos Fijos Mensuales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleAddFixedIncome} className="space-y-3">
                      <Input
                        placeholder="Nombre del ingreso"
                        value={fixedIncomeForm.name}
                        onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, name: e.target.value })}
                        required
                        className="border-green-200"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Cantidad"
                        value={fixedIncomeForm.amount}
                        onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, amount: e.target.value })}
                        required
                        className="border-green-200"
                      />
                      <Input
                        placeholder="Descripción (opcional)"
                        value={fixedIncomeForm.description}
                        onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, description: e.target.value })}
                        className="border-green-200"
                      />
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 shadow-md">
                        Añadir Ingreso Fijo
                      </Button>
                    </form>
                    
                    <div className="space-y-2">
                      {fixedIncomes.map((income) => (
                        <div key={income.id}
                        className="
                          flex flex-col sm:flex-row
                          justify-between
                          items-start sm:items-center
                          p-4
                          bg-gradient-to-r from-green-50 to-lime-50
                          rounded-xl border border-green-200 shadow-sm
                          space-y-2 sm:space-y-0
                        ">
                          <div>
                            <div className="font-medium text-green-800">{income.name}</div>
                            {income.description && <div className="text-sm text-green-600">{income.description}</div>}
                          </div>
                          <div className="flex items-center gap-3">

                            <span className="font-bold text-green-600">{formatCurrency(income.amount)}</span>
                            <Button
                              onClick={() => deleteFixedIncome(income.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 shadow-sm"
                            >
                              Eliminar
                            </Button>
                            <EditItemDialog item={income} onUpdate={updateFixedIncome} />
                          </div>
                        </div>
                      ))}
                      {fixedIncomes.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay ingresos fijos configurados</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Fixed Expenses */}
                <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg ">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Gastos Fijos Mensuales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleAddFixedExpense} className="space-y-3">
                      <Input
                        placeholder="Nombre del gasto"
                        value={fixedExpenseForm.name}
                        onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, name: e.target.value })}
                        required
                        className="border-red-200"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Cantidad"
                        value={fixedExpenseForm.amount}
                        onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, amount: e.target.value })}
                        required
                        className="border-red-200"
                      />
                      <Input
                        placeholder="Descripción (opcional)"
                        value={fixedExpenseForm.description}
                        onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, description: e.target.value })}
                        className="border-red-200"
                      />
                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 shadow-md">
                        Añadir Gasto Fijo
                      </Button>
                    </form>
                    
                    <div className="space-y-2">
                      {fixedExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 shadow-sm">
                          <div>
                            <div className="font-medium text-red-800">{expense.name}</div>
                            {expense.description && <div className="text-sm text-red-600">{expense.description}</div>}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              onClick={() => deleteFixedExpense(expense.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600 shadow-sm"
                            >
                              Eliminar
                            </Button>
                            <EditItemDialog item={expense} onUpdate={updateFixedExpense} />
                          </div>
                        </div>
                      ))}
                      {fixedExpenses.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No hay gastos fijos configurados</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Expenses */}
            <TabsContent value="expenses" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-pink-700 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  Gastos Variables
                </h2>
                <AddExpenseDialog onAddExpense={addExpense} />
              </div>
              
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-pink-800 flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Todos los Gastos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expenses.length > 0 ? (
                    <div className="space-y-3">
                      {expenses
                        .filter(expense => expense.month === selectedMonth)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((expense) => (
                          <div key={expense.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="bg-pink-200 text-pink-800 border-pink-300 text-xs">
                                {expense.category}
                              </Badge>
                              <span className="font-medium text-gray-800 text-sm">{expense.name}</span>
                              <Badge variant="outline" className="bg-white/50 border-pink-200 text-gray-600 text-xs">
                                {expense.month}
                              </Badge>
                              <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                                {expense.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-rose-600 text-sm">{formatCurrency(expense.amount)}</span>
                              <Button
                                onClick={() => deleteExpense(expense.id)}
                                variant="destructive"
                                size="sm"
                                className="bg-rose-500 hover:bg-rose-600 shadow-sm text-xs h-8 px-3"
                              >
                                Eliminar
                              </Button>
                              <EditItemDialog item={expense} onUpdate={updateExpense} />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                      <p className="text-gray-500">No hay gastos registrados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Incomes */}
            <TabsContent value="incomes" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-green-700 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  Ingresos por Mes
                </h2>
                <AddIncomeDialog onAddIncome={addMonthlyIncome} />
              </div>
              
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Ingresos Variables por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlyIncomes.length > 0 ? (
                    <div className="space-y-3">
                      {monthlyIncomes
                      .filter(income => income.month === selectedMonth)
                      .map((income) => (
                        <div key={income.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200 shadow-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                              {income.month}
                            </Badge>
                            <span className="font-medium text-gray-800 text-sm">{income.description || 'Ingreso'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600 text-sm">{formatCurrency(income.amount)}</span>
                            <Button
                              onClick={() => deleteMonthlyIncome(income.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-400 shadow-sm text-xs h-8 px-3"
                            >
                              Eliminar
                            </Button>
                            <EditItemDialog item={income} onUpdate={updateMonthlyIncome} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-300" />
                      <p className="text-gray-500">No hay ingresos variables registrados</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Savings */}
            <TabsContent value="savings" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-fuchsia-700 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  Metas de Ahorro
                </h2>
                <AddSavingsGoalDialog onAddGoal={addSavingsGoal} />
              </div>
              
              {savingsGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savingsGoals.map((goal) => (
                    <SavingsGoalCard
                      key={goal.id}
                      goal={goal}
                      onUpdateGoal={updateSavingsGoal}
                      onDeleteGoal={deleteSavingsGoal}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
                  <CardContent className="py-8">
                    <div className="text-center text-gray-500">
                      <PiggyBank className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                      <p>No tienes metas de ahorro configuradas</p>
                      <p className="text-sm">¡Comienza a ahorrar para tus objetivos!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
