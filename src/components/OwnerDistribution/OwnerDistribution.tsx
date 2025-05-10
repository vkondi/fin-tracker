import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DashboardCard from "../DashboardCard/DashboardCard";
import { useRootContext } from "@/context/RootContext";
import { formattedAmount } from "@/utils/utility";

/**
 * Shuffles the array in-place (modifies the original).
 * @param {Array} array - The array to shuffle.
 * @return {Array} - The same array (shuffled).
 */
function shuffleArrayInPlace(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap in-place
  }
  return array;
}

const colors = shuffleArrayInPlace([
  "#57B4BA",
  "#015551",
  "#222222",
  "#328E6E",
  "#60B5FF",
  "#BF9264",
  "#FFA955",
  "#CF0F47",
  "#8E1616",
  "#222831",
  "#D50B8B",
  "#DDA853",
  "#E78B48",
  "#604652",
  "#4F1C51",
]);

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

const OwnerDistribution = () => {
  const { financeData } = useRootContext();

  const owners = financeData.reduce((prev, curr, index) => {
    if (!prev[curr.owner]) {
      prev[curr.owner] = 0;
    }

    prev[curr.owner] += parseFloat(curr.investedAmount.toString());

    return prev;
  }, {} as Record<string, number>);

  const data = Object.entries(owners).map(([key, value], index) => {
    return {
      name: key,
      value: value,
      fill: colors[index],
    } as ChartData;
  });

  return (
    <DashboardCard title="Owner Distribution" flex={1}>
      <div className="flex flex-row items-center bg-amber-100 justify-center w-full h-full">
        <ResponsiveContainer width={300} height={250}>
          <PieChart>
            <Tooltip />
            <Pie
            style={{ fontSize: "0.8rem" }}
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              fill="#82ca9d"
              // label
              label={({ name, value, percent }) =>
                `${name} ${formattedAmount(value)}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};

export default OwnerDistribution;
