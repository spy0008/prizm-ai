import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  helperText?: string;
  isLoading?: boolean;
};

export function StatCard({
  title,
  value,
  icon,
  helperText,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          {isLoading ? "..." : value }
        </div>
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </CardContent>
    </Card>
  );
}