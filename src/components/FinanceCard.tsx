
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
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 text-pink-800 shadow-lg shadow-pink-100/50';
      case 'expense':
        return 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-800 shadow-lg shadow-rose-100/50';
      case 'savings':
        return 'border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-pink-50 text-fuchsia-800 shadow-lg shadow-fuchsia-100/50';
      default:
        return 'border-pink-200 bg-gradient-to-br from-white to-pink-50 text-gray-800 shadow-lg shadow-pink-100/50';
    }
  };

  const getAmountColor = () => {
    switch (variant) {
      case 'income':
        return 'text-pink-600';
      case 'expense':
        return 'text-rose-600';
      case 'savings':
        return 'text-fuchsia-600';
      default:
        return amount >= 0 ? 'text-pink-600' : 'text-rose-600';
    }
  };

  return (
    <Card className={cn(
      'transform transition-all duration-300 hover:scale-105 hover:shadow-xl',
      getVariantStyles(), 
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold animate-fade-in", getAmountColor())}>
          {formatCurrency(amount)}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1 opacity-75">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
