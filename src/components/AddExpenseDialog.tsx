
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES, MONTHS } from '@/types/finance';
import { Plus } from 'lucide-react';

interface AddExpenseDialogProps {
  onAddExpense: (expense: {
    name: string;
    amount: number;
    category: string;
    month: string;
    date: string;
  }) => void;
}

export const AddExpenseDialog = ({ onAddExpense }: AddExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    month: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.category || !formData.month) {
      return;
    }

    onAddExpense({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      month: formData.month,
      date: formData.date
    });

    setFormData({
      name: '',
      amount: '',
      category: '',
      month: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Añadir Gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Gasto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Gasto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Supermercado"
              required
            />
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
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Añadir Gasto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
