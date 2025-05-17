import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "../DashboardCard/DashboardCard";
import { useRootContext } from "@/context/RootContext";
import { formattedAmount } from "@/utils/utility";

import CustomTooltip from "./CustomTooltip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { useMemo, useState } from "react";

const OwnerDistribution = () => {
  const [activeTab, setActiveTab] = useState<"invested" | "current">(
    "invested"
  );
  const {
    isMobile,
    loading,
    hasNoFinanceData,
    memberWiseData,
    financeSummaryData: { totalCurrent, totalInvested },
  } = useRootContext();
  const total = useMemo(
    () => (activeTab === "invested" ? totalInvested : totalCurrent),
    [activeTab, totalCurrent, totalInvested]
  );

  const chartData = useMemo(
    () =>
      memberWiseData.map((rec) => {
        const value =
          activeTab === "invested"
            ? rec?.totalInvestedAmount
            : rec?.totalCurrentAmount;
        const percent = Math.round((value / total) * 100 * 100) / 100;
        const percentFormatted = `${percent}%`;

        return {
          name: rec?.owner,
          value,
          fill: rec?.fill,
          valueFormatted: formattedAmount(value),
          percent,
          percentFormatted,
        };
      }),
    [memberWiseData, activeTab, total]
  );

  const onInvestedTabClick = () => setActiveTab("invested");

  const onCurrentTabClick = () => setActiveTab("current");

  // Scenarios to hide component
  if (loading || hasNoFinanceData) {
    return null;
  }

  return (
    <DashboardCard title="Owner Distribution" flex={1}>
      <div className="flex flex-col items-center justify-center pb-2">
        {/* Tab Buttons */}
        <div className="my-2 flex rounded-md overflow-hidden">
          <button
            className={`px-4 py-2 text-xs ${
              activeTab === "invested"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={onInvestedTabClick}
          >
            Invested Amount
          </button>
          <button
            className={`px-4 py-2 text-xs ${
              activeTab === "current"
                ? "bg-[var(--primary-btn)] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
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

          <div className="flex-1 flex items-center justify-center">
            <table className="border-1 border-gray-300 text-xs font-semibold ">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-2 py-1"></th>
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Amount</th>
                  <th className="px-2 py-1">Percent</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((rec, index) => {
                  return (
                    <tr className="border-b-1 border-gray-300" key={index}>
                      <td className="px-2 py-1">
                        <div
                          style={{
                            backgroundColor: rec.fill,
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            width: "20px",
                            height: "20px",
                            borderRadius: "3px",
                          }}
                        ></div>
                      </td>
                      <td className="px-2 py-2 font-normal">{rec.name}</td>
                      <td className="px-2 py-1">{rec.valueFormatted}</td>
                      <td className="px-2 py-1 font-normal">
                        {rec.percentFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default OwnerDistribution;
