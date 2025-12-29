import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProjectStatusChartProps {
  stats: {
    completed: number;
    inProgress: number;
    planning: number;
  };
}

const COLORS = {
  completed: '#10b981', // green
  inProgress: '#3b82f6', // blue
  planning: '#f59e0b', // orange
};

export const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ stats }) => {
  const data = [
    { name: 'Completed', value: stats.completed, color: COLORS.completed },
    { name: 'In Progress', value: stats.inProgress, color: COLORS.inProgress },
    { name: 'Planning', value: stats.planning, color: COLORS.planning },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Overview of your project statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No projects yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
        <CardDescription>Overview of your project statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
