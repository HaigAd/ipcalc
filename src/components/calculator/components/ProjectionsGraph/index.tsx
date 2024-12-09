import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { useProjectionsData, formatAxisValue } from './useProjectionsData';
import { useCalculator } from '../../context/CalculatorContext';

export function ProjectionsGraph() {
  const { calculationResults } = useCalculator();
  
  const processedData = useProjectionsData(calculationResults?.yearlyProjections || []);

  return (
    <div className="w-full">      
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{
              top: 5,
              right: 5,
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
                value: 'Net Position', 
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
            <Line
              type="monotone"
              dataKey="positiveValue"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="negativeValue"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export * from './types';
