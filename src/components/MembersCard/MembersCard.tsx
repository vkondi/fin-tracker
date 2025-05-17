import { useRootContext } from "@/context/RootContext";
import DashboardCard from "../DashboardCard/DashboardCard";
import { FC } from "react";
import { formattedAmount } from "@/utils/utility";

const MembersCard: FC = () => {
  const { hasNoFinanceData, loading, isMobile, memberWiseData } =
    useRootContext();

  const sortedMemberWiseData = memberWiseData.sort(
    (a, b) => b.totalCurrentAmount - a.totalCurrentAmount
  );

  // Scenarios to hide component
  if (loading || hasNoFinanceData) {
    return null;
  }

  return (
    <DashboardCard flex={1}>
      <div
        className={`p-2 ${
          isMobile ? "" : "max-h-[300px]  overflow-y-scroll"
        } bg-[var(--primary-btn)]`}
      >
        {sortedMemberWiseData.map((memberData, index) => {
          const totalAbsReturn = memberData?.totalAbsReturn;
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

          return (
            <div
              className="bg-gray-100 rounded-md flex flex-col mb-1 px-2 py-1 last:mb-0"
              key={index}
            >
              {/* Top row */}
              <div className="flex flex-row items-center justify-between p-1">
                {/* Left */}
                <div className="text-sm text-[var(--primary-btn)] font-semibold">
                  {memberData.owner}
                </div>

                {/* Right */}
                <div className="text-l font-bold">
                  {formattedAmount(memberData.totalCurrentAmount)}
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex flex-row items-center justify-between p-1 text-xs">
                {/* Left */}
                <div className="flex flex-col gap-1 items-start">
                  <div className="text-[10px]">Invested Amount</div>
                  <div className="font-semibold">
                    {formattedAmount(memberData.totalInvestedAmount)}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-1 items-end">
                  <div className="text-[10px]">Absolute Returns</div>
                  <div className="flex flex-row gap-1 font-semibold">
                    <span className={`${returnsStateCls}`}>
                      {formattedAmount(memberData.totalAbsReturn)}
                    </span>
                    <span className={`${returnsStateCls}`}>
                      ({`${memberData.totalAbsReturnPercentage}%`})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
};

export default MembersCard;
