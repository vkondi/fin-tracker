import { formattedAmount } from "@/utils/utility";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

interface CustomTooltipProps  {
  total: number;
  active?: boolean;
  payload: Payload<number, string>[];
}

const CustomTooltip = ({ total, active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    const percent = ((value / total) * 100).toFixed(2);

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>{`${name} (${percent}%)`}</p>
        <p>{`${formattedAmount(value)}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
