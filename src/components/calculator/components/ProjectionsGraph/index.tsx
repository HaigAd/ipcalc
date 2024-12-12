import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { useProjectionsData, formatAxisValue } from './useProjectionsData';

interface ProjectionsGraphProps {
  calculationResults: any; // TODO: Add proper type
}

export function ProjectionsGraph({ calculationResults }: ProjectionsGraphProps) {
  const processedData = useProjectionsData(calculationResults?.yearlyProjections || []);

  return (
    <div className="w-full">      
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ 
                value: 'Year', 
                position: 'insideBottom', 
                offset: -5,
                style: { fontSize: '10px', fontWeight: 500 }
              }}
              tick={{ fontSize: 10 }}
              tickMargin={5}
            />
            <YAxis
              label={{ 
                value: 'Value ($)', 
                angle: -90, 
                position: 'insideLeft',
                style: { 
                  textAnchor: 'middle', 
                  fontSize: '10px',
                  fontWeight: 500
                }
              }}
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10 }}
              tickMargin={5}
              width={45}
            />
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="equity"
              name="Equity"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cashFlow"
              name="Cash Flow"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rentalIncome"
              name="Rental Income"
              stroke="#9333ea"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export * from './types';
