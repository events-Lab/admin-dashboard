export type ChartPoint = {
  id: string;
  label: string;
  value: number;
  detail?: string;
};

export type StatusSlice = {
  label: string;
  value: number;
  color: string;
};

export function ColumnChart({
  points,
  format,
  label,
}: {
  points: ChartPoint[];
  format: (value: number) => string;
  label: string;
}) {
  const max = Math.max(...points.map((point) => point.value), 1);

  if (points.length === 0) {
    return <p className="m-0 text-sm text-secondary-500">Nothing to chart yet.</p>;
  }

  return (
    <div className="flex items-end gap-2" role="img" aria-label={label}>
      {points.map((point) => {
        const height = Math.round((point.value / max) * 148);
        return (
          <div
            key={point.id}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-[11px] font-semibold tabular-nums text-secondary-700">
              {format(point.value)}
            </span>
            <div className="flex h-[148px] w-full items-end justify-center">
              <div
                className="w-full max-w-14 rounded-t-xl bg-linear-to-t from-primary-700 via-primary to-accent shadow-[0_8px_16px_rgba(109,40,217,0.18)]"
                style={{ height: Math.max(height, point.value > 0 ? 10 : 4) }}
                title={`${point.label}: ${format(point.value)}`}
              />
            </div>
            <span className="line-clamp-2 h-8 w-full text-center text-[11px] leading-4 text-secondary-500">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MeterList({
  rows,
  label,
  scale = "relative",
}: {
  rows: ChartPoint[];
  label: string;
  scale?: "relative" | "percent";
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  if (rows.length === 0) {
    return <p className="m-0 text-sm text-secondary-500">Nothing to chart yet.</p>;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3.5 p-0" aria-label={label}>
      {rows.map((row) => {
        const share =
          scale === "percent"
            ? Math.min(row.value, 100)
            : (row.value / max) * 100;
        return (
          <li key={row.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium text-secondary-900">
                {row.label}
              </span>
              <span className="shrink-0 tabular-nums text-secondary-600">
                {row.detail ?? String(row.value)}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                style={{ width: `${share}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StatusDonut({
  slices,
  centerLabel,
}: {
  slices: StatusSlice[];
  centerLabel: string;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg
        viewBox="0 0 140 140"
        className="size-36 shrink-0"
        role="img"
        aria-label={centerLabel}
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#f1ecf7"
          strokeWidth="16"
        />
        {total > 0
          ? slices.map((slice) => {
              const length = (slice.value / total) * circumference;
              const dash = `${length} ${circumference - length}`;
              const offset = -cursor;
              cursor += length;
              if (slice.value === 0) return null;
              return (
                <circle
                  key={slice.label}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="16"
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  transform="rotate(-90 70 70)"
                />
              );
            })
          : null}
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fill="#1d1428"
          fontSize="26"
          fontWeight="650"
        >
          {total}
        </text>
        <text x="70" y="86" textAnchor="middle" fill="#6f5e82" fontSize="11">
          events
        </text>
      </svg>
      <ul className="m-0 flex w-max min-w-44 list-none flex-col gap-2.5 p-0">
        {slices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-secondary-700">
              <span
                className="size-2.5 rounded-full"
                style={{ background: slice.color }}
              />
              {slice.label}
            </span>
            <span className="font-semibold tabular-nums text-secondary-900">
              {slice.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
