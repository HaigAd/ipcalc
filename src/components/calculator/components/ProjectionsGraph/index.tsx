import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { useState } from 'react';
import { CustomTooltip } from './CustomTooltip';
import { useProjectionsData, formatAxisValue } from './useProjectionsData';
import { YearlyProjection } from '../../types/market';

interface ProjectionsGraphProps {
  calculationResults: {
    yearlyProjections: YearlyProjection[];
  };
}

export function ProjectionsGraph({ calculationResults }: ProjectionsGraphProps) {
  const processedData = useProjectionsData(calculationResults?.yearlyProjections || []);
  const [zoomDomain, setZoomDomain] = useState<{ x1: number, x2: number } | null>(null);

  const handleBrushChange = (domain: any) => {
    setZoomDomain({ x1: domain.startIndex, x2: domain.endIndex });
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

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
              domain={zoomDomain ? [zoomDomain.x1, zoomDomain.x2] : ['dataMin', 'dataMax']}
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
            <Line
              type="monotone"
              dataKey="equity"
              name="Equity"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="cashFlow"
              name="Cash Flow"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="rentalIncome"
              name="Rental Income"
              stroke="#9333ea"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Brush 
              height={20}
              startIndex={zoomDomain?.x1}
              endIndex={zoomDomain?.x2}
              onChange={handleBrushChange}
              className="select-none touch-none"
              stroke="#94a3b8"
              fill="#f1f5f9" 
              travellerWidth={10}
              alwaysShowText
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {zoomDomain && (
        <div className="flex justify-end mt-2">
          <button
            onClick={handleResetZoom}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1 px-2 rounded text-sm"
          >
            Reset Zoom
          </button>
        </div>
      )}
    </div>
  );
}

export * from './types';
