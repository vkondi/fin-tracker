import { useMemo, useState } from "react";
import { useRootContext } from "@/context/RootContext";
import { useFinContext } from "@/context/FinContext";
import { constructCategoryWiseData, formattedAmount } from "@/utils/utility";
import DistributionChartTable, { DistributionTab } from "../DistributionChartTable/DistributionChartTable";

const CategoryDistribution = () => {
  const [activeTab, setActiveTab] = useState<DistributionTab>("invested");
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
        .sort((a, b) => b.percent - a.percent),
    [categoryWiseData, activeTab, total]
  );

  return (
    <DistributionChartTable
      title="Category Allocation"
      isMobile={isMobile}
      chartData={chartData}
      total={total}
      tabLabels={["Invested Amount", "Current Amount"]}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tableColumns={[
        {
          header: "",
          render: (rec) => (
            <div style={{ backgroundColor: rec.fill }} className="w-5 h-5 rounded-sm" />
          ),
        },
        {
          header: "Category",
          render: (rec) => <span className="font-normal truncate">{rec.name}</span>,
        },
        {
          header: "Amount",
          render: (rec) => rec.valueFormatted,
        },
        {
          header: "Percent",
          render: (rec) => <span className="font-normal">{rec.percentFormatted}</span>,
        },
      ]}
      loading={loading}
      hideIfNoData={hasNoFinanceData}
    />
  );
};

export default CategoryDistribution;
