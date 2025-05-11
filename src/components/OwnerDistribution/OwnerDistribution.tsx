import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "../DashboardCard/DashboardCard";
import { useRootContext } from "@/context/RootContext";
import { shuffleArrayInPlace } from "@/utils/utility";

import { CHART_COLORS } from "@/utils/constants";
import CustomLabel from "./CustomLabel";
import CustomTooltip from "./CustomTooltip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { useMemo, useState } from "react";

const colors = shuffleArrayInPlace(CHART_COLORS);

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

const OwnerDistribution = () => {
  const [activeTab, setActiveTab] = useState<"invested" | "current">(
    "invested"
  );
  const { financeData, isMobile } = useRootContext();

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

  const data = Object.entries(owners).map(([key, value], index) => {
    return {
      name: key,
      value: value,
      fill: colors[index],
    } as ChartData;
  });

  const onInvestedTabClick = () => setActiveTab("invested");

  const onCurrentTabClick = () => setActiveTab("current");

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

        <ResponsiveContainer width="100%" height={250}>
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
              label={({ name, value, percent, x, y, midAngle, fill }) => (
                <CustomLabel
                  name={name}
                  value={value}
                  percent={percent}
                  x={x}
                  y={y}
                  midAngle={midAngle}
                  fill={fill}
                />
              )}
              labelLine={false}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default OwnerDistribution;
