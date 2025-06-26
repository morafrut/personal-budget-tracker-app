import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS, EXPENSE_CATEGORIES } from '@/types/finance';
import { Pencil } from 'lucide-react';

type EditableItem = {
  id: string;
  name: string;
  amount: number;
  date?: string;
  description?: string;
  category?: string;
  month?: string;
};

interface EditItemDialogProps<T extends EditableItem> {
  item: T;
  onUpdate: (id: string, updated: Partial<T>) => void;
}

export const EditItemDialog = <T extends EditableItem>({ item, onUpdate }: EditItemDialogProps<T>) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(item.amount.toString());
  const [category, setCategory] = useState(item.category || '');
  const [month, setMonth] = useState(item.month || '');
  const [date, setDate] = useState(item.date || '');
  const [description, setDescription] = useState(item.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...(name !== item.name && { name }),
      ...(amount !== item.amount.toString() && { amount: parseFloat(amount) }),
      ...(category !== item.category && category && { category }),
      ...(month !== item.month && month && { month }),
      ...(date !== item.date && date && { date }),
      ...(description !== item.description && description && { description }),
    } as Partial<T> ;

    if (Object.keys(updated).length > 0) {
      onUpdate(item.id, updated);
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
          <DialogTitle>Editar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {item.category !== undefined && (
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {item.month !== undefined && (
            <div className="space-y-2">
              <Label>Mes</Label>
              <Select value={month} onValueChange={(value) => setMonth(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un mes" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {item.date !== undefined && (
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}

          {item.description !== undefined && (
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
