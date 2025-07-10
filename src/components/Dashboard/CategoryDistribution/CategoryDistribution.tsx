import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "../DashboardCard/DashboardCard";
import { useRootContext } from "@/context/RootContext";
import { constructCategoryWiseData, formattedAmount } from "@/utils/utility";

import CustomTooltip from "../../Chart/CustomTooltip/CustomTooltip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { useMemo, useState } from "react";
import { useFinContext } from "@/context/FinContext";

const CategoryDistribution = () => {
  const [activeTab, setActiveTab] = useState<"invested" | "current">(
    "invested"
  );
  const {
    isMobile,
    loader: { show: loading },
  } = useRootContext();
  const {
    hasNoFinanceData,
    financeData,
    financeSummaryData: { totalCurrent, totalInvested },
  } = useFinContext();
  const total = useMemo(
    () => (activeTab === "invested" ? totalInvested : totalCurrent),
    [activeTab, totalCurrent, totalInvested]
  );

  const categoryWiseData = useMemo(
    () => constructCategoryWiseData(financeData),
    [financeData]
  );

  const chartData = useMemo(
    () =>
      categoryWiseData
        .map((rec) => {
          const value =
            activeTab === "invested"
              ? rec?.totalInvestedAmount
              : rec?.totalCurrentAmount;
          const percent = Math.round((value / total) * 100 * 100) / 100;
          const percentFormatted = `${percent}%`;

          return {
            name: rec?.category,
            value,
            fill: rec?.fill,
            valueFormatted: formattedAmount(value),
            percent,
            percentFormatted,
          };
        })
        .sort((a, b) => b.percent - a.percent), // Sort by percentage descending
    [categoryWiseData, activeTab, total]
  );

  const onInvestedTabClick = () => setActiveTab("invested");

  const onCurrentTabClick = () => setActiveTab("current");

  // Scenarios to hide component
  if (loading || hasNoFinanceData) {
    return null;
  }

  return (
    <DashboardCard title="Category Allocation" flex={1}>
      <div className="flex flex-col items-center justify-center pb-2 px-2">
        {/* Tab Buttons */}
        <div className="my-4 flex rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 text-xs ${
              activeTab === "invested"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
            onClick={onInvestedTabClick}
          >
            Invested Amount
          </button>
          <button
            className={`px-4 py-2 text-xs ${
              activeTab === "current"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
            onClick={onCurrentTabClick}
          >
            Current Amount
          </button>
        </div>

        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full`}>
          <ResponsiveContainer width="100%" height={180} style={{ flex: 1 }}>
            <PieChart>
              <Tooltip
                content={({ active, payload }) => (
                  <CustomTooltip
                    total={total}
                    active={active}
                    payload={(payload ?? []) as Payload<number, string>[]}
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
                // TODO: Kept the code for future ref
                // label={({ name, value, percent, x, y, midAngle, fill }) => (
                //   <CustomLabel
                //     name={name}
                //     value={value}
                //     percent={percent}
                //     x={x}
                //     y={y}
                //     midAngle={midAngle}
                //     fill={fill}
                //   />
                // )}
                labelLine={false}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-2 flex items-center justify-center">
            <table className="w-full border border-gray-300 text-xs font-semibold">
              {/* Header - Uses same grid layout as body rows */}
              <thead>
                <tr className="grid grid-cols-[36px_2fr_1fr_1fr] gap-2 bg-gray-200">
                  <th className="p-2"></th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Percent</th>
                </tr>
              </thead>

              {/* Body - Maintains identical column structure */}
              <tbody>
                {chartData.map((rec, index) => (
                  <tr
                    className="grid grid-cols-[36px_2fr_1fr_1fr] gap-2 border-b border-gray-300"
                    key={index}
                  >
                    <td className="p-2">
                      <div
                        style={{ backgroundColor: rec.fill }}
                        className="w-5 h-5 rounded-sm"
                      />
                    </td>
                    <td className="p-2 font-normal truncate">{rec.name}</td>
                    <td className="p-2">{rec.valueFormatted}</td>
                    <td className="p-2 font-normal">{rec.percentFormatted}</td>
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

export default CategoryDistribution;
