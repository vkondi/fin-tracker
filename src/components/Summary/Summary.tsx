import { useRootContext } from "@/context/RootContext";
import { formattedAmount } from "@/utils/utility";
import { useMemo } from "react";
import DashboardCard from "../DashboardCard/DashboardCard";

const Summary = () => {
  const {
    isMobile,
    loading,
    financeSummaryData: {
      totalInvested,
      totalCurrent,
      totalAbsReturn,
      totalAbsReturnPercentage,
      totalOwners,
      totalPlatforms,
    },
    hasNoFinanceData,
  } = useRootContext();

  const summary = useMemo(
    () => [
      {
        label: "Total Amount Invested",
        key: "totalInvested",
        value: formattedAmount(totalInvested),
      },
      {
        label: "Total Current Amount",
        key: "totalCurrent",
        value: formattedAmount(totalCurrent),
      },
      {
        label: "Total Absolute Return",
        key: "totalAbsReturn",
        value: formattedAmount(totalAbsReturn),
      },
      {
        label: "Total Abs Ret. Percentage",
        key: "totalAbsReturnPercentage",
        value: `${totalAbsReturnPercentage}%`,
      },
      {
        label: "Total Owner(s)",
        key: "totalOwners",
        value: totalOwners,
      },
      {
        label: "Total Platform(s)",
        key: "totalPlatforms",
        value: totalPlatforms,
      },
    ],
    [
      totalInvested,
      totalCurrent,
      totalAbsReturn,
      totalAbsReturnPercentage,
      totalOwners,
      totalPlatforms,
    ]
  );

  const returnsState =
    totalAbsReturn > 0
      ? "positive"
      : totalAbsReturn < 0
      ? "negative"
      : "neutral";
  const returnsStateCls =
    returnsState === "positive"
      ? "text-[var(--text-green)]"
      : returnsState === "negative"
      ? "text-[var(--text-red)]"
      : "";

  // Scenarios to hide component
  if (loading || hasNoFinanceData) {
    return null;
  }

  return (
    <DashboardCard isMobile={isMobile} title="Finance Summary" flex={1}>
      <div className="flex flex-row flex-wrap justify-center">
        {summary.map((item, index) => {
          const key = item.key;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1 py-2 min-w-[150px]"
            >
              <div
                className={`text-l font-semibold ${
                  ["totalAbsReturn", "totalAbsReturnPercentage"].includes(key)
                    ? returnsStateCls
                    : ""
                }`}
              >
                {item.value}
              </div>
              <div className="text-[10px] text-center">{item.label}</div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default Summary;
