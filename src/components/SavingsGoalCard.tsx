
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SavingsGoal } from "@/types/finance";
import { PiggyBank } from "lucide-react";
import { EditSavingsGoalDialog } from "./EditSavingsGoalDialog";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalCard = ({ goal, onUpdateGoal, onDeleteGoal }: SavingsGoalCardProps) => {
  const [addAmount, setAddAmount] = useState('');
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      onUpdateGoal(goal.id, {
        currentAmount: goal.currentAmount + amount
      });
      setAddAmount('');
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <PiggyBank className="h-5 w-5" />
          {goal.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-600">Progreso</span>
            <span className="text-blue-600 font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        {remaining > 0 && (
          <div className="text-sm text-gray-600">
            Faltan: <span className="font-medium text-blue-600">{formatCurrency(remaining)}</span>
          </div>
        )}

        {goal.description && (
          <p className="text-sm text-gray-600">{goal.description}</p>
        )}

        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            placeholder="Añadir..."
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAddMoney}
            disabled={!addAmount || parseFloat(addAmount) <= 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Añadir
          </Button>
        </div>

        <Button 
          onClick={() => onDeleteGoal(goal.id)}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          Eliminar Meta
        </Button>
        <EditSavingsGoalDialog SavingsGoal={goal} onUpdateSaving={onUpdateGoal} />
      </CardContent>
    </Card>
  );
};
