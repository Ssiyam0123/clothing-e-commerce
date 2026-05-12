"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw } from "lucide-react";

const MONTHS = [
  { label: "All Months", value: "all" },
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];

export function UserGrowthChart({ 
  data, 
  selectedYear, 
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  isFetching,
  isLoading
}) {
  return (
    <Card className="bg-card rounded-[3rem] border border-border shadow-sm relative overflow-hidden transition-all duration-500">
      {(isFetching && !isLoading) && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
          </div>
        </div>
      )}
      
      <CardHeader className="flex flex-col space-y-4 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
              User Registrations
            </CardTitle>
            <CardDescription className="text-xs font-bold text-muted-foreground mt-1 uppercase">
              Growth Trend in {selectedMonth === "all" ? selectedYear : `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}`}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => {
                setSelectedYear(Number(value));
                setSelectedMonth("all");
              }}
            >
              <SelectTrigger className="w-[100px] bg-muted rounded-xl text-[9px] font-black uppercase border-border h-8">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((y) => (
                  <SelectItem key={y} value={y.toString()} className="text-[10px] font-bold uppercase">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-[110px] bg-muted rounded-xl text-[9px] font-black uppercase border-border h-8">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-[10px] font-bold uppercase">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full rounded-[2rem]" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "var(--muted-foreground)" }}
                  dy={15}
                  tickFormatter={(val) =>
                    val
                      ? selectedMonth === "all"
                        ? val.split("-")[1]
                        : val.split("-")[2]
                      : ""
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase"
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorUser)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
