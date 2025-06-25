
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinanceCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  variant?: 'income' | 'expense' | 'savings' | 'balance';
  className?: string;
}

export const FinanceCard = ({ 
  title, 
  amount, 
  subtitle, 
  variant = 'balance',
  className 
}: FinanceCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'expense':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'savings':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-white text-gray-800';
    }
  };

  const getAmountColor = () => {
    switch (variant) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'savings':
        return 'text-blue-600';
      default:
        return amount >= 0 ? 'text-green-600' : 'text-red-600';
    }
  };

  return (
    <Card className={cn(getVariantStyles(), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", getAmountColor())}>
          {formatCurrency(amount)}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
