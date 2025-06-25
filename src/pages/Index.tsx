import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { FinanceCard } from '@/components/FinanceCard';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
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
    addFixedExpense,
    addExpense,
    addSavingsGoal,
    addMonthlyIncome,
    updateSavingsGoal,
    deleteSavingsGoal,
    deleteExpense,
    deleteFixedIncome,
    deleteFixedExpense
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Avatar className="h-40 w-40 border-4 border-pink-200 shadow-lg">
              <AvatarImage src="/images/corazon.png" />
              <AvatarFallback className="bg-gradient-to-br from-pink-200 to-rose-200 text-pink-700">
                <Heart className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
                Gestor de finanzas para Valen 
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="h-5 w-5 text-pink-500 animate-pulse" />
                <p className="text-gray-600">Pookie Bear edition</p>
                <Sparkles className="h-5 w-5 text-pink-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Month selector */}
        <div className="flex justify-center animate-fade-in">
          <Card className="bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-pink-600" />
                <Label htmlFor="month-select" className="text-pink-700 font-medium">Mes actual:</Label>
                <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value as typeof MONTHS[number])}>
                  <SelectTrigger id="month-select" className="w-40 border-pink-200 bg-white/80 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border-pink-200">
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month} className="hover:bg-pink-50">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <FinanceCard
            title="💰 Ingresos del Mes"
            amount={totalCurrentMonthIncome}
            subtitle={`${formatCurrency(totalFixedIncome)} fijos + ${formatCurrency(currentMonthIncome)} variables`}
            variant="income"
          />
          <FinanceCard
            title="💸 Gastos del Mes"
            amount={totalCurrentMonthExpenses}
            subtitle={`${formatCurrency(totalFixedExpenses)} fijos + ${formatCurrency(currentMonthExpenses)} variables`}
            variant="expense"
          />
          <FinanceCard
            title="💎 Balance del Mes"
            amount={monthlyBalance}
            subtitle={selectedMonth}
            variant="balance"
          />
          <FinanceCard
            title="🏦 Total Ahorrado"
            amount={totalSavings}
            subtitle={`${savingsGoals.length} metas activas`}
            variant="savings"
          />
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 shadow-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="fixed" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
              <Wallet className="h-4 w-4 mr-2" />
              Fijos
            </TabsTrigger>
            <TabsTrigger value="expenses" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
              💸 Gastos
            </TabsTrigger>
            <TabsTrigger value="incomes" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
              💰 Ingresos
            </TabsTrigger>
            <TabsTrigger value="savings" className="data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800">
              <PiggyBank className="h-4 w-4 mr-2" />
              Ahorros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Monthly expenses by category */}
            <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <Sparkles className="h-5 w-5" />
                  Gastos de {selectedMonth} por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(currentMonthExpensesByCategory).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(currentMonthExpensesByCategory).map(([category, amount]) => (
                      <div key={category} className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl border border-rose-200 shadow-md transform transition-all duration-300 hover:scale-105">
                        <div className="text-sm font-medium text-rose-800 mb-1">{category}</div>
                        <div className="text-lg font-bold text-rose-600">{formatCurrency(amount)}</div>
                        <div className="w-full bg-rose-200 rounded-full h-1 mt-2">
                          <div className="bg-rose-500 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                    <p className="text-gray-500">No hay gastos registrados para {selectedMonth}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent expenses */}
            <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-800">
                  <TrendingUp className="h-5 w-5" />
                  Gastos Recientes de {selectedMonth}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.filter(expense => expense.month === selectedMonth).length > 0 ? (
                  <div className="space-y-3">
                    {expenses
                      .filter(expense => expense.month === selectedMonth)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-pink-200 text-pink-800 border-pink-300">
                              {expense.category}
                            </Badge>
                            <span className="font-medium text-gray-800">{expense.name}</span>
                            <span className="text-sm text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                              {expense.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-rose-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              onClick={() => deleteExpense(expense.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600 shadow-sm"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-pink-300" />
                    <p className="text-gray-500">No hay gastos registrados para {selectedMonth}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixed" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fixed Incomes */}
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
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
                      <div key={income.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
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
              <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
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
                      <div key={expense.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
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

          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Gastos Variables
              </h2>
              <AddExpenseDialog onAddExpense={addExpense} />
            </div>
            
            <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-pink-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Todos los Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-pink-200 text-pink-800 border-pink-300">
                              {expense.category}
                            </Badge>
                            <span className="font-medium text-gray-800">{expense.name}</span>
                            <Badge variant="outline" className="bg-white/50 border-pink-200 text-gray-600">
                              {expense.month}
                            </Badge>
                            <span className="text-sm text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                              {expense.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-rose-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              onClick={() => deleteExpense(expense.id)}
                              variant="destructive"
                              size="sm"
                              className="bg-rose-500 hover:bg-rose-600 shadow-sm"
                            >
                              Eliminar
                            </Button>
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

          <TabsContent value="incomes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Ingresos por Mes
              </h2>
              <AddIncomeDialog onAddIncome={addMonthlyIncome} />
            </div>
            
            <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ingresos Variables por Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyIncomes.length > 0 ? (
                  <div className="space-y-3">
                    {monthlyIncomes.map((income) => (
                      <div key={income.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-lime-50 rounded-xl border border-green-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            {income.month}
                          </Badge>
                          <span className="font-medium text-gray-800">{income.description || 'Ingreso'}</span>
                        </div>
                        <span className="font-bold text-green-600">{formatCurrency(income.amount)}</span>
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

          <TabsContent value="savings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-fuchsia-700 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Metas de Ahorro
              </h2>
              <AddSavingsGoalDialog onAddGoal={addSavingsGoal} />
            </div>
            
            {savingsGoals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default Index;
