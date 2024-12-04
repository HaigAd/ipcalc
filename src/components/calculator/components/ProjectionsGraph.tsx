import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { YearlyProjection } from '../types';
import { Card } from '../../ui/card';
import { formatCurrency } from '../../../lib/utils';

interface ProjectionsGraphProps {
  yearlyProjections: YearlyProjection[];
}

const formatAxisValue = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as YearlyProjection;
    return (
      <Card className="p-4 bg-white shadow-lg">
        <h3 className="font-bold mb-2">Year {label}</h3>
        <div className="space-y-1">
          <p>Property Value: {formatCurrency(data.propertyValue)}</p>
          <p>Loan Balance: {formatCurrency(data.effectiveLoanBalance)}</p>
          <p>Net Position: {formatCurrency(data.netPosition)}</p>
          <p>Opportunity Cost: {formatCurrency(data.yearlyOpportunityCost)}</p>
        </div>
      </Card>
    );
  }
  return null;
};

export function ProjectionsGraph({ yearlyProjections }: ProjectionsGraphProps) {
  return (
    <div className="w-full">      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={yearlyProjections}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              label={{ 
                value: 'Net Position', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
              tickFormatter={formatAxisValue}
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="netPosition"
              stroke="#ff7300"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
