import { Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import CustomTooltip from "../../Chart/CustomTooltip/CustomTooltip";
import DashboardCard from "../DashboardCard/DashboardCard";
import React, { ReactNode } from "react";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

export type DistributionTab = "invested" | "current";

export interface DistributionChartTableColumn<T> {
  header: string;
  render: (rec: T) => ReactNode;
  className?: string;
  thClassName?: string;
}

export interface DistributionChartTableProps<T = Record<string, unknown>> {
  title: string;
  isMobile: boolean;
  chartData: T[];
  total: number;
  tabLabels: [string, string];
  activeTab: DistributionTab;
  setActiveTab: (tab: DistributionTab) => void;
  tableColumns: Array<DistributionChartTableColumn<T>>;
  loading?: boolean;
  hideIfNoData?: boolean;
}

const DistributionChartTable = <T extends Record<string, unknown>>({
  title,
  isMobile,
  chartData,
  total,
  tabLabels,
  activeTab,
  setActiveTab,
  tableColumns,
  loading = false,
  hideIfNoData = false,
}: DistributionChartTableProps<T>) => {
  if (loading || (hideIfNoData && chartData.length === 0)) {
    return null;
  }

  return (
    <DashboardCard title={title} flex={1}>
      <div className="flex flex-col items-center justify-center pb-2 px-2">
        {/* Tab Buttons */}
        <div className="my-4 flex rounded-md overflow-hidden">
          <button
            aria-label={tabLabels[0]}
            className={`px-4 py-2 text-xs ${
              activeTab === "invested"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
            onClick={() => setActiveTab("invested")}
          >
            {tabLabels[0]}
          </button>
          <button
            aria-label={tabLabels[1]}
            className={`px-4 py-2 text-xs ${
              activeTab === "current"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
            onClick={() => setActiveTab("current")}
          >
            {tabLabels[1]}
          </button>
        </div>

        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full overflow-scroll`}>
          <div
            style={{
              flex: isMobile ? undefined : 1,
              minWidth: isMobile ? undefined : 180,
              width: "100%",
              height: 180,
              display: "flex",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }: TooltipProps<number, string>) => (
                    <CustomTooltip
                      total={total}
                      active={active}
                      payload={Array.isArray(payload) ? (payload as Payload<number, string>[]) : []}
                    />
                  )}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 35 : 50}
                  outerRadius={isMobile ? 60 : 80}
                  labelLine={false}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-2 flex items-center justify-center">
            <table className="w-full border border-gray-300 text-xs font-semibold">
              <caption className="sr-only">{title} data table</caption>
              <thead>
                <tr role="row">
                  {tableColumns.map((col, idx) => (
                    <th key={idx} scope="col" className={`p-2 text-left min-w-0 break-all whitespace-pre-line ${col.thClassName || ""}`}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((rec, index) => (
                  <tr className="border-b border-gray-300" key={index}>
                    {tableColumns.map((col, idx) => (
                      <td key={idx} className={`p-2 min-w-0 break-all whitespace-pre-line ${col.className || ""}`}>{col.render(rec as T)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default DistributionChartTable; 