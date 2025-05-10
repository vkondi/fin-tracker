import { useRootContext } from "@/context/RootContext";
import { formattedAmount } from "@/utils/utility";
import { useMemo } from "react";

const Summary = () => {
  const { isMobile, financeData } = useRootContext();

  const { totalInvested, totalCurrent, totalOwners, totalPlatforms } = useMemo(
    () =>
      financeData.reduce(
        (prev, curr) => {
          if (!prev.owners.includes(curr.owner)) {
            prev.owners.push(curr.owner);
          }
          if (!prev.platforms.includes(curr.platform)) {
            prev.platforms.push(curr.platform);
          }

          return {
            totalInvested:
              prev.totalInvested + parseFloat(curr.investedAmount.toString()),
            totalCurrent:
              prev.totalCurrent + parseFloat(curr.currentAmount.toString()),
            totalOwners: prev.owners.length,
            totalPlatforms: prev.platforms.length,
            owners: prev.owners,
            platforms: prev.platforms,
          };
        },
        {
          totalInvested: 0,
          totalCurrent: 0,
          totalOwners: 0,
          totalPlatforms: 0,
          owners: [] as string[],
          platforms: [] as string[],
        }
      ),
    [financeData]
  );

  const totalAbsReturn = totalCurrent - totalInvested;
  const totalAbsReturnPercentage = (
    (totalAbsReturn / totalInvested) *
    100
  ).toFixed(2);

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
    [totalInvested, totalCurrent, totalAbsReturn, totalAbsReturnPercentage, totalOwners, totalPlatforms]
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

  return (
    <div
      className={`items-center flex flex-col gap-6 bg-white rounded-md ${
        isMobile ? "w-[360px]" : "w-full"
      } my-5 mx-auto overflow-hidden shadow-md`}
    >
      <div className="font-thin text-xl bg-[var(--primary-btn)] w-full text-center p-2 text-[var(--background)]">
        Finance Summary
      </div>

      <div className={`grid grid-cols-2 ${isMobile ? "w-full" : "w-fit"}`}>
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
    </div>
  );
};

export default Summary;
