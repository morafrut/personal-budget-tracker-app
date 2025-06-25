
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PiggyBank } from 'lucide-react';

interface AddSavingsGoalDialogProps {
  onAddGoal: (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    description?: string;
  }) => void;
}

export const AddSavingsGoalDialog = ({ onAddGoal }: AddSavingsGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      return;
    }

    onAddGoal({
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      description: formData.description || undefined
    });

    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      description: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PiggyBank className="h-4 w-4 mr-2" />
          Nueva Meta de Ahorro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Meta de Ahorro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Meta</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Vacaciones, Coche nuevo, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Cantidad Objetivo</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Cantidad Actual</Label>
            <Input
              id="currentAmount"
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu meta de ahorro..."
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Crear Meta de Ahorro
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
