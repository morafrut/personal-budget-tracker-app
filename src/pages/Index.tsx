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
import { MONTHS } from '@/types/finance';
import { PiggyBank, DollarSign, Calendar } from 'lucide-react';

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
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const currentMonthExpensesByCategory = expenses
    .filter(expense => expense.month === selectedMonth)
    .reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Mi Gestor de Finanzas</h1>
          <p className="text-gray-600">Controla tus ingresos, gastos y ahorros de manera inteligente</p>
        </div>

        {/* Month selector */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <Label htmlFor="month-select">Mes actual:</Label>
            <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(value as typeof MONTHS[number])}>
              <SelectTrigger id="month-select" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FinanceCard
            title="Ingresos del Mes"
            amount={totalCurrentMonthIncome}
            subtitle={`${formatCurrency(totalFixedIncome)} fijos + ${formatCurrency(currentMonthIncome)} variables`}
            variant="income"
          />
          <FinanceCard
            title="Gastos del Mes"
            amount={totalCurrentMonthExpenses}
            subtitle={`${formatCurrency(totalFixedExpenses)} fijos + ${formatCurrency(currentMonthExpenses)} variables`}
            variant="expense"
          />
          <FinanceCard
            title="Balance del Mes"
            amount={monthlyBalance}
            subtitle={selectedMonth}
            variant="balance"
          />
          <FinanceCard
            title="Total Ahorrado"
            amount={totalSavings}
            subtitle={`${savingsGoals.length} metas activas`}
            variant="savings"
          />
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="fixed">Fijos</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="incomes">Ingresos</TabsTrigger>
            <TabsTrigger value="savings">Ahorros</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Monthly expenses by category */}
            <Card>
              <CardHeader>
                <CardTitle>Gastos de {selectedMonth} por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(currentMonthExpensesByCategory).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(currentMonthExpensesByCategory).map(([category, amount]) => (
                      <div key={category} className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-sm font-medium text-red-800">{category}</div>
                        <div className="text-lg font-bold text-red-600">{formatCurrency(amount)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay gastos registrados para {selectedMonth}</p>
                )}
              </CardContent>
            </Card>

            {/* Recent expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Gastos Recientes de {selectedMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.filter(expense => expense.month === selectedMonth).length > 0 ? (
                  <div className="space-y-2">
                    {expenses
                      .filter(expense => expense.month === selectedMonth)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{expense.category}</Badge>
                            <span className="font-medium">{expense.name}</span>
                            <span className="text-sm text-gray-500">{expense.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              onClick={() => deleteExpense(expense.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay gastos registrados para {selectedMonth}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixed" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fixed Incomes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Ingresos Fijos Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddFixedIncome} className="space-y-3">
                    <Input
                      placeholder="Nombre del ingreso"
                      value={fixedIncomeForm.name}
                      onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, name: e.target.value })}
                      required
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Cantidad"
                      value={fixedIncomeForm.amount}
                      onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, amount: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Descripción (opcional)"
                      value={fixedIncomeForm.description}
                      onChange={(e) => setFixedIncomeForm({ ...fixedIncomeForm, description: e.target.value })}
                    />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Añadir Ingreso Fijo
                    </Button>
                  </form>
                  
                  <div className="space-y-2">
                    {fixedIncomes.map((income) => (
                      <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <div className="font-medium text-green-800">{income.name}</div>
                          {income.description && <div className="text-sm text-green-600">{income.description}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">{formatCurrency(income.amount)}</span>
                          <Button
                            onClick={() => deleteFixedIncome(income.id)}
                            variant="destructive"
                            size="sm"
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Gastos Fijos Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddFixedExpense} className="space-y-3">
                    <Input
                      placeholder="Nombre del gasto"
                      value={fixedExpenseForm.name}
                      onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, name: e.target.value })}
                      required
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Cantidad"
                      value={fixedExpenseForm.amount}
                      onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, amount: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Descripción (opcional)"
                      value={fixedExpenseForm.description}
                      onChange={(e) => setFixedExpenseForm({ ...fixedExpenseForm, description: e.target.value })}
                    />
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                      Añadir Gasto Fijo
                    </Button>
                  </form>
                  
                  <div className="space-y-2">
                    {fixedExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <div className="font-medium text-red-800">{expense.name}</div>
                          {expense.description && <div className="text-sm text-red-600">{expense.description}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                          <Button
                            onClick={() => deleteFixedExpense(expense.id)}
                            variant="destructive"
                            size="sm"
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
              <h2 className="text-2xl font-bold">Gastos Variables</h2>
              <AddExpenseDialog onAddExpense={addExpense} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Todos los Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-2">
                    {expenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{expense.category}</Badge>
                            <span className="font-medium">{expense.name}</span>
                            <Badge variant="outline">{expense.month}</Badge>
                            <span className="text-sm text-gray-500">{expense.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                            <Button
                              onClick={() => deleteExpense(expense.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay gastos registrados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incomes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ingresos por Mes</h2>
              <AddIncomeDialog onAddIncome={addMonthlyIncome} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Variables por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyIncomes.length > 0 ? (
                  <div className="space-y-2">
                    {monthlyIncomes.map((income) => (
                      <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">{income.month}</Badge>
                          <span className="font-medium">{income.description || 'Ingreso'}</span>
                        </div>
                        <span className="font-bold text-green-600">{formatCurrency(income.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hay ingresos variables registrados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Metas de Ahorro</h2>
              <AddSavingsGoalDialog onAddGoal={addSavingsGoal} />
            </div>
            
            {savingsGoals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-gray-500">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 text-gray-400" />
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
