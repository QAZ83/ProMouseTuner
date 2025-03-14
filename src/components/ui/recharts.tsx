import React from "react";
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  AreaChart as RechartsAreaChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: any[];
  width?: number | string;
  height?: number | string;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const defaultColors = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
];

export function LineChart({
  data,
  width = "100%",
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}: ChartProps) {
  // Extract keys excluding 'name' for lines
  const dataKeys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "name") : [];

  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.2}
            />
          )}
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                borderRadius: "0.375rem",
              }}
            />
          )}
          {showLegend && <Legend />}

          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  width = "100%",
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}: ChartProps) {
  // Extract keys excluding 'name' for bars
  const dataKeys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "name") : [];

  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.2}
            />
          )}
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                borderRadius: "0.375rem",
              }}
            />
          )}
          {showLegend && <Legend />}

          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChart({
  data,
  width = "100%",
  height = 300,
  colors = defaultColors,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}: ChartProps) {
  // Extract keys excluding 'name' for areas
  const dataKeys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "name") : [];

  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.2}
            />
          )}
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                borderRadius: "0.375rem",
              }}
            />
          )}
          {showLegend && <Legend />}

          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({
  data,
  width = "100%",
  height = 300,
  colors = defaultColors,
  showLegend = true,
  showTooltip = true,
  className,
}: ChartProps) {
  // For pie chart, data should have 'name' and 'value' properties
  return (
    <div className={className}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsPieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                borderRadius: "0.375rem",
              }}
            />
          )}
          {showLegend && <Legend />}

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
