
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS } from '@/types/finance';
import { Plus } from 'lucide-react';

interface AddIncomeDialogProps {
  onAddIncome: (income: {
    month: string;
    amount: number;
    description?: string;
  }) => void;
}

export const AddIncomeDialog = ({ onAddIncome }: AddIncomeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    amount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.month || !formData.amount) {
      return;
    }

    onAddIncome({
      month: formData.month,
      amount: parseFloat(formData.amount),
      description: formData.description || undefined
    });

    setFormData({
      month: '',
      amount: '',
      description: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Ingreso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Ingreso Mensual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Mes</Label>
            <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un mes" />
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
          
          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Salario, freelance, etc."
            />
          </div>
          
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Añadir Ingreso
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
