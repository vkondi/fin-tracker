import { formattedAmount } from "@/utils/utility";

const CustomLabel = ({
  name,
  value,
  x,
  y,
  percent,
  midAngle,
  fill,
}: {
  name: string;
  value: number;
  x: number;
  y: number;
  percent: number;
  midAngle: number;
  fill: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = 10; // Distance from the pie chart
  const offsetX = Math.cos(-midAngle * RADIAN) * radius;
  const offsetY = Math.sin(-midAngle * RADIAN) * radius;

  const lineHeight = 16; // Adjust line height as needed
  const formatterPercent = (percent * 100).toFixed(2) + "%";
  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: "400", fontSize: "10px" }}
    >
      <tspan x={x + offsetX} dy={-lineHeight / 2}>
        {name}
        <tspan style={{ fontWeight: "bold" }}> ({formatterPercent})</tspan>
      </tspan>
      <tspan x={x + offsetX} dy={lineHeight} style={{ fontWeight: "bold" }}>
        {formattedAmount(value)}
      </tspan>
    </text>
  );
};

export default CustomLabel;
