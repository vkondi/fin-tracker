import { useMemo, useState } from "react";
import { useRootContext } from "@/context/RootContext";
import { useFinContext } from "@/context/FinContext";
import { formattedAmount } from "@/utils/utility";
import DistributionChartTable, { DistributionTab } from "../DistributionChartTable/DistributionChartTable";

const OwnerDistribution = () => {
  const [activeTab, setActiveTab] = useState<DistributionTab>("invested");
  const {
    isMobile,
    loader: { show: loading },
  } = useRootContext();
  const {
    financeSummaryData: { totalCurrent, totalInvested },
    memberWiseData,
    hasNoFinanceData,
  } = useFinContext();

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

  return (
    <DistributionChartTable
      title="Member Allocation"
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
          header: "Name",
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

export default OwnerDistribution;
