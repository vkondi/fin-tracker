import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "../DashboardCard/DashboardCard";
import { useRootContext } from "@/context/RootContext";
import { formattedAmount, shuffleArrayInPlace } from "@/utils/utility";

import { CHART_COLORS } from "@/utils/constants";
import CustomTooltip from "./CustomTooltip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { useMemo, useState } from "react";

const colors = shuffleArrayInPlace(CHART_COLORS);

type ChartData = {
  percent: number;
  percentFormatted: string;
  valueFormatted: string;
  name: string;
  value: number;
  fill: string;
};

const OwnerDistribution = () => {
  const [activeTab, setActiveTab] = useState<"invested" | "current">(
    "invested"
  );
  const { financeData, isMobile, loading } = useRootContext();

  const { owners, total } = useMemo(
    () =>
      financeData.reduce(
        (prev, curr) => {
          const amount =
            activeTab === "invested"
              ? parseFloat(curr.investedAmount.toString())
              : parseFloat(curr.currentAmount.toString());

          if (!prev.owners[curr.owner]) {
            prev.owners[curr.owner] = 0;
          }

          prev.owners[curr.owner] += amount;
          prev.total += amount;

          return prev;
        },
        { owners: {} as Record<string, number>, total: 0 } // Initialize owners as an empty object
      ),
    [activeTab, financeData]
  );

  const data = Object.entries(owners)
    .map(([key, value], index) => {
      const percent = ((value / total) * 100).toFixed(2);
      const percentFormatted = `${percent}%`;

      return {
        name: key,
        value: value,
        fill: colors[index],
        valueFormatted: formattedAmount(value),
        percent,
        percentFormatted,
      } as unknown as ChartData;
    })
    .sort((sortRec1, sortRec2) => sortRec2?.percent - sortRec1?.percent);

  const onInvestedTabClick = () => setActiveTab("invested");

  const onCurrentTabClick = () => setActiveTab("current");

  // Scenarios to hide component
  if (loading || (Array.isArray(financeData) && !financeData.length)) {
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
                data={data}
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
                {data.map((rec, index) => {
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
                      <td className="px-2 py-2">{rec.name}</td>
                      <td className="px-2 py-1">{rec.valueFormatted}</td>
                      <td className="px-2 py-1">{rec.percent}</td>
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
