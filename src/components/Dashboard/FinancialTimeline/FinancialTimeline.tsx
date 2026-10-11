import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useRootContext } from "@/context/RootContext";
import { useFinContext } from "@/context/FinContext";
import { formattedAmount } from "@/utils/utility";
import { AUTHORIZED_SNAPSHOT_USER_IDS } from "@/utils/constants";
import DashboardCard from "../DashboardCard/DashboardCard";
import { RiCameraLensLine } from "react-icons/ri";

const formatMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  isYearly?: boolean;
}

/**
 * Custom X-Axis Tick that splits "Month Year" into two lines for monthly views
 * to avoid horizontal cramping on mobile/narrow screens, and renders single line for yearly views.
 */
const CustomXAxisTick = ({ x = 0, y = 0, payload, isYearly = false }: CustomTickProps) => {
  if (!payload || !payload.value) return null;

  if (isYearly) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={14}
          textAnchor="middle"
          fill="#4b5563"
          fontSize={11}
          fontWeight={600}
        >
          {payload.value}
        </text>
      </g>
    );
  }

  // Monthly view: two lines (Month on line 1, Year on line 2)
  const date = new Date(payload.value);
  const month = date.toLocaleDateString("en-IN", { month: "short" });
  const year = date.toLocaleDateString("en-IN", { year: "numeric" });

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fill="#4b5563"
        fontSize={11}
      >
        <tspan x={0} dy={12} fontWeight={600}>
          {month}
        </tspan>
        <tspan x={0} dy={14} fontSize={10} fill="#9ca3af">
          {year}
        </tspan>
      </text>
    </g>
  );
};

interface TimelineTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

const TimelineTooltip = ({ active, payload, label }: TimelineTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const itemData = payload[0]?.payload;
  const isYearly = itemData?.isYearly;

  const invested = payload.find((p) => p.dataKey === "total_invested")?.value ?? 0;
  const current = payload.find((p) => p.dataKey === "total_current")?.value ?? 0;
  const absReturn = current - invested;
  const absReturnPct = invested > 0 ? ((absReturn / invested) * 100).toFixed(2) : "0.00";
  const returnColor = absReturn >= 0 ? "var(--text-green)" : "var(--text-red)";

  const titleText = isYearly
    ? `${itemData.label} (Year-End: ${itemData.subLabel})`
    : label
    ? formatMonth(label)
    : "";

  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow-lg"
      style={{ padding: "12px 16px", minWidth: 200 }}
    >
      <p className="font-semibold text-sm mb-2 text-gray-700 border-b border-gray-200 pb-1">
        {titleText}
      </p>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Invested</span>
          <span className="font-semibold">{formattedAmount(invested)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Current</span>
          <span className="font-semibold">{formattedAmount(current)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-gray-100 pt-1 mt-1">
          <span className="text-gray-500">Return</span>
          <span className="font-semibold" style={{ color: returnColor }}>
            {formattedAmount(absReturn)} ({absReturnPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};

const FinancialTimeline = () => {
  const {
    isMobile,
    loader,
    userId,
    toast,
  } = useRootContext();
  const loading = loader?.show ?? false;

  const { snapshotData, hasNoFinanceData, captureSnapshot } = useFinContext();
  const [isCapturing, setIsCapturing] = useState(false);

  // Default to current year
  const currentYearStr = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);

  // Role / Access Guardrail: only authorized users can trigger manual snapshots
  const isAuthorized = AUTHORIZED_SNAPSHOT_USER_IDS.includes(String(userId));

  // Extract available years from snapshots
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        snapshotData.map((s) =>
          new Date(s.snapshot_date).getFullYear().toString()
        )
      )
    ).sort((a, b) => Number(b) - Number(a));

    return years;
  }, [snapshotData]);

  // Enhancement 1: Last updated date
  const latestSnapshot = useMemo(() => {
    if (!snapshotData.length) return null;
    return snapshotData[snapshotData.length - 1];
  }, [snapshotData]);

  const lastUpdatedDisplay = useMemo(() => {
    if (!latestSnapshot) return "";
    const snapshotMonth = formatMonth(latestSnapshot.snapshot_date);
    if (latestSnapshot.created_at) {
      const createdDate = new Date(latestSnapshot.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `${createdDate} (${snapshotMonth})`;
    }
    return snapshotMonth;
  }, [latestSnapshot]);

  // Enhancement 2: Year-by-Year data for "All" filter
  const yearByYearData = useMemo(() => {
    const yearMap = new Map<string, typeof snapshotData[0]>();
    snapshotData.forEach((s) => {
      const yr = new Date(s.snapshot_date).getFullYear().toString();
      // Since snapshotData is sorted chronologically, latest seen per year is year-end closing
      yearMap.set(yr, s);
    });

    return Array.from(yearMap.entries()).map(([year, s]) => ({
      ...s,
      snapshot_date: year,
      total_invested: parseFloat(s.total_invested.toString()),
      total_current: parseFloat(s.total_current.toString()),
      label: year,
      subLabel: formatMonth(s.snapshot_date),
      isYearly: true,
    }));
  }, [snapshotData]);

  // Monthly data for individual year selection
  const monthlyChartData = useMemo(
    () =>
      snapshotData
        .filter((item) => {
          const year = new Date(item.snapshot_date).getFullYear().toString();
          return year === selectedYear;
        })
        .map((s) => ({
          ...s,
          total_invested: parseFloat(s.total_invested.toString()),
          total_current: parseFloat(s.total_current.toString()),
          label: formatMonth(s.snapshot_date),
          isYearly: false,
        })),
    [snapshotData, selectedYear]
  );

  const isAllYearMode = selectedYear.toLowerCase() === "all";
  const displayChartData = isAllYearMode ? yearByYearData : monthlyChartData;

  const handleManualCapture = async () => {
    if (!isAuthorized) {
      toast?.error?.("You are not authorized to capture snapshots");
      return;
    }

    setIsCapturing(true);
    try {
      const res = await captureSnapshot();
      if (res.success) {
        toast?.success?.(res.message);
      } else {
        toast?.error?.(res.message);
      }
    } catch {
      toast?.error?.("Failed to capture snapshot");
    } finally {
      setIsCapturing(false);
    }
  };

  // Don't render if loading or user has no finance data at all
  if (loading || hasNoFinanceData) {
    return null;
  }

  // Entirely empty state (no snapshots at all)
  if (snapshotData.length === 0) {
    return (
      <DashboardCard
        title="Financial Timeline"
        headerRight={
          lastUpdatedDisplay ? (
            <span className="text-xs font-normal opacity-90">
              Last updated: {lastUpdatedDisplay}
            </span>
          ) : undefined
        }
        flex={1}
        fullWidth
      >
        <div className={`w-full flex flex-col items-center justify-center gap-4 ${isMobile ? "p-4" : "p-6"}`}>
          <p className="text-sm text-gray-500 text-center max-w-md">
            No snapshots captured yet. Snapshots track your overall portfolio growth over time.
          </p>
          {isAuthorized && (
            <button
              onClick={handleManualCapture}
              disabled={isCapturing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-[var(--primary-btn)] text-[var(--background)] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              <RiCameraLensLine size={16} />
              <span>{isCapturing ? "Capturing..." : "Capture Snapshot Now"}</span>
            </button>
          )}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Financial Timeline"
      headerRight={
        lastUpdatedDisplay ? (
          <span className="text-xs font-normal opacity-90" data-testid="header-last-updated">
            Last updated: {lastUpdatedDisplay}
          </span>
        ) : undefined
      }
      flex={1}
      fullWidth
    >
      <div className={`w-full ${isMobile ? "px-2 py-4" : "p-6"}`}>
        {/* Controls Bar: Yearly Filter, Last Updated Notice & Trigger Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-3 border-b border-gray-100">
          {/* Yearly Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Period:</span>
            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-md text-xs">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedYear === yr
                      ? "bg-white text-gray-900 shadow-xs font-semibold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  aria-pressed={selectedYear === yr}
                >
                  {yr}
                </button>
              ))}
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  isAllYearMode
                    ? "bg-white text-gray-900 shadow-xs font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                aria-pressed={isAllYearMode}
              >
                All (Annual)
              </button>
            </div>
            <span className="text-xs text-gray-400">
              ({displayChartData.length} {isAllYearMode ? "years" : displayChartData.length === 1 ? "snapshot" : "snapshots"})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Enhancement 1: Last updated badge */}
            {lastUpdatedDisplay && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>
                  Last updated: <strong className="text-gray-700">{lastUpdatedDisplay}</strong>
                </span>
              </div>
            )}

            {/* Role/Access Guardrail: Trigger visible ONLY to authorized user IDs */}
            {isAuthorized && (
              <button
                onClick={handleManualCapture}
                disabled={isCapturing}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded bg-[var(--primary-btn)] text-[var(--background)] hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-xs"
                title="Capture or update current month snapshot"
                aria-label="Take a Snapshot"
              >
                <RiCameraLensLine size={13} />
                <span>{isCapturing ? "Capturing..." : "Take a Snapshot"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Chart or Single-Point Notice */}
        {displayChartData.length < 2 ? (
          <div className="flex flex-col items-center justify-center p-8 gap-2 bg-gray-50 rounded-lg text-center">
            <p className="text-sm font-medium text-gray-700">
              {displayChartData.length === 1
                ? isAllYearMode
                  ? "Only 1 year of snapshot data recorded."
                  : `1 snapshot recorded for ${selectedYear} (${displayChartData[0].label}).`
                : `No snapshots recorded for ${selectedYear}.`}
            </p>
            <p className="text-xs text-gray-500 max-w-md">
              A minimum of 2 data points are required to plot trend lines.
              Switch to another year or select <strong>&quot;All (Annual)&quot;</strong> to view multi-period trends.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 260 : 360}>
            <AreaChart
              data={displayChartData}
              margin={{
                top: 10,
                right: isMobile ? 10 : 30,
                left: isMobile ? 0 : 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="gradientInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b3a3a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b3a3a" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradientCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f8d410" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f8d410" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              {/* Enhancement 3: Responsive multi-line tick (Month on top, Year on bottom) */}
              <XAxis
                dataKey="snapshot_date"
                tick={<CustomXAxisTick isYearly={isAllYearMode} />}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
                height={48}
              />

              <YAxis
                tickFormatter={(val: number) =>
                  val >= 100000
                    ? `₹${(val / 100000).toFixed(1)}L`
                    : formattedAmount(val)
                }
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 55 : 70}
              />

              <Tooltip content={<TimelineTooltip />} />

              <Area
                type="monotone"
                dataKey="total_invested"
                name="Invested"
                stroke="#3b3a3a"
                strokeWidth={2}
                fill="url(#gradientInvested)"
                dot={{ r: 3, fill: "#3b3a3a", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#3b3a3a", strokeWidth: 2, stroke: "#fff" }}
              />

              <Area
                type="monotone"
                dataKey="total_current"
                name="Current"
                stroke="#f8d410"
                strokeWidth={2.5}
                fill="url(#gradientCurrent)"
                dot={{ r: 3, fill: "#f8d410", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#f8d410", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        {displayChartData.length >= 2 && (
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#3b3a3a" }}
              />
              <span>Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#f8d410" }}
              />
              <span>Current</span>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default FinancialTimeline;
