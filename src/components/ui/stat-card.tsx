import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl", iconBg, iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-extrabold text-slate-950 font-mono tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-bold flex items-center",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5 inline" />
                )}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
