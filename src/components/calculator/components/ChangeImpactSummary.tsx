import { formatCurrency } from '../utils/formatters';

interface ImpactDelta {
  label: string;
  value: number;
}

interface ChangeImpactSummaryProps {
  reasons: string[];
  deltas: ImpactDelta[];
}

const formatDelta = (value: number) => {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
};

export function ChangeImpactSummary({ reasons, deltas }: ChangeImpactSummaryProps) {
  if (!reasons.length || !deltas.length) return null;

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5">
      <h2 className="text-lg sm:text-xl font-semibold text-amber-900">What Changed</h2>
      <p className="mt-1 text-sm text-amber-800">
        Model outputs changed due to updated assumptions:
      </p>

      <ul className="mt-3 list-disc pl-5 text-sm text-amber-900 space-y-1">
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {deltas.map((delta) => (
          <div key={delta.label} className="rounded-md border border-amber-200 bg-white/70 px-3 py-2">
            <div className="text-xs text-slate-600">{delta.label}</div>
            <div className={`text-sm font-semibold ${delta.value >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatDelta(delta.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
