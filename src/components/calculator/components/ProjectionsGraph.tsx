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

interface TooltipPayload {
  value: number | null;
  payload: YearlyProjection;
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
    // Find the non-null value if it exists
    const validPayload = payload.find((p: TooltipPayload) => p.value !== null);
    if (!validPayload) return null;
    
    const data = validPayload.payload as YearlyProjection;
    return (
      <Card className="p-3 sm:p-4 bg-white shadow-lg max-w-[280px] sm:max-w-none">
        <h3 className="font-bold mb-2 text-sm sm:text-base">Year {label}</h3>
        
        {/* Basic Info */}
        <div className="mb-2">
          <p className="text-xs text-slate-500 font-medium mb-1">Basic Info</p>
          <div className="space-y-0.5 text-sm">
            <p>Property Value: {formatCurrency(data.propertyValue)}</p>
          </div>
        </div>

        {/* Loan Details */}
        <div className="mb-2">
          <p className="text-xs text-slate-500 font-medium mb-1">Loan Details</p>
          <div className="space-y-0.5 text-sm">
            <p>Loan Balance: {formatCurrency(data.loanBalance)}</p>
            <p>Total Principal: <span className="text-green-800 font-medium">
              {formatCurrency(data.cumulativePrincipalPaid)}
            </span></p>
            <p>Equity Position: <span className="text-green-800 font-medium">
              {formatCurrency(data.propertyValue - data.loanBalance)}
            </span></p>
          </div>
        </div>

        {/* Rental Scenario */}
        <div className="mb-2">
          <p className="text-xs text-slate-500 font-medium mb-1">Rental Scenario</p>
          <div className="space-y-0.5 text-sm">
            <p>Yearly Rent: <span className="text-purple-700">
              {formatCurrency(data.rentalCosts)}
            </span></p>
            <p>Cash Flow Diff: <span className={data.yearlyRentVsBuyCashFlow >= 0 ? 'text-purple-700' : 'text-red-700'}>
              {formatCurrency(data.yearlyRentVsBuyCashFlow)}
            </span></p>
            <p>Annual Returns: <span className="text-blue-600">
              {formatCurrency(data.yearlyOpportunityCost)}
            </span></p>
            <p>Total Returns: <span className="text-blue-700 font-medium">
              {formatCurrency(data.cumulativeOpportunityCost)}
            </span></p>
            <p>Investment Pool: <span className="text-blue-800 font-medium">
              {formatCurrency(data.cumulativeInvestmentReserves)}
            </span></p>
          </div>
        </div>

        {/* Comparative Analysis */}
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Comparative Analysis</p>
          <div className="space-y-0.5 text-sm">
            <p>Net Position: <span className={data.netPosition >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
              {formatCurrency(data.netPosition)}
            </span></p>
          </div>
        </div>
      </Card>
    );
  }
  return null;
};

export function ProjectionsGraph({ yearlyProjections }: ProjectionsGraphProps) {
  // Create data arrays with null values for non-matching points
  const processedData = yearlyProjections.map(point => ({
    ...point,
    year: point.year,
    positiveValue: point.netPosition >= 0 ? point.netPosition : null,
    negativeValue: point.netPosition < 0 ? point.netPosition : null,
    // Add an extra point at the transition
    transitionValue: point.netPosition === 0 ? 0 : null
  }));

  // Find transition points and add overlap
  for (let i = 1; i < processedData.length; i++) {
    const prev = processedData[i - 1];
    const curr = processedData[i];
    if ((prev.netPosition >= 0) !== (curr.netPosition >= 0)) {
      // Add overlap by including the value in both segments
      if (prev.netPosition >= 0) {
        prev.negativeValue = prev.netPosition;
      } else {
        prev.positiveValue = prev.netPosition;
      }
    }
  }

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
