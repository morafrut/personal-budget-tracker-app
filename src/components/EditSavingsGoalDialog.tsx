import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, EXPENSE_CATEGORIES, SavingsGoal } from '@/types/finance';
import { Pencil } from 'lucide-react';

interface EditSavingsGoalDialogProps {
  SavingsGoal: {    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    description?: string
  };
  onUpdateSaving: (id: string, updated: Partial<SavingsGoal>) => void;
}

export const EditSavingsGoalDialog = ({ SavingsGoal, onUpdateSaving }: EditSavingsGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(SavingsGoal.name);
  const [targetAmount, setTargetAmount] = useState(SavingsGoal.targetAmount.toString());
  const [currentAmount, setCurrentAmount] = useState(SavingsGoal.currentAmount.toString());
  const [description, setDescription] = useState(SavingsGoal.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...(name !== SavingsGoal.name && { name }),
      ...(targetAmount !== SavingsGoal.targetAmount.toString() && { targetAmount: parseFloat(targetAmount) }),
      ...(currentAmount !== SavingsGoal.currentAmount.toString() && { currentAmount: parseFloat(currentAmount) }),
      ...(description !== SavingsGoal.description && { description }),
    };

    if (Object.keys(updated).length > 0) {
      onUpdateSaving(SavingsGoal.id, updated);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del gasto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Cantidad Objetivo</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentAmount">Cantidad Real</Label>
            <Input
              id="currentAmount"
              type="number"
              step="0.01"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>



          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
