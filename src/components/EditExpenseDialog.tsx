import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, EXPENSE_CATEGORIES, Expense } from '@/types/finance';
import { Pencil } from 'lucide-react';

interface EditExpenseDialogProps {
  expense: {
    id: string;
    name: string;
    amount: number;
    category: string;
    month: string;
    date: string;
  };
  onUpdateExpense: (id: string, updated: Partial<Expense>) => void;
}

export const EditExpenseDialog = ({ expense, onUpdateExpense }: EditExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [month, setMonth] = useState(expense.month);
  const [date, setDate] = useState(expense.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...(name !== expense.name && { name }),
      ...(amount !== expense.amount.toString() && { amount: parseFloat(amount) }),
      ...(category !== expense.category && { category }),
      ...(month !== expense.month && { month }),
      ...(date !== expense.date && { date }),
    };

    if (Object.keys(updated).length > 0) {
      onUpdateExpense(expense.id, updated);
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
            <Label htmlFor="amount">Cantidad</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mes</Label>
            <Select value={month} onValueChange={(value) => setMonth(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un mes" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
