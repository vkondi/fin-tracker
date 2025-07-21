import { useRootContext } from "@/context/RootContext";
import DashboardCard from "../DashboardCard/DashboardCard";
import { FC } from "react";
import { ImCheckmark } from "react-icons/im";
import { IoPieChartSharp } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";

const data = [
  {
    text: "Stay on Top of Your Finances",
    icon: <ImCheckmark color="green" size={30} aria-label="Checkmark icon" />,
  },
  {
    text: "See Real-Time Insights",
    icon: <IoPieChartSharp color="#45ade7" size={30} aria-label="Pie chart icon" />,
  },
  {
    text: "Takes Just 10 Seconds!",
    icon: <AiFillThunderbolt color="orange" size={30} aria-label="Thunderbolt icon" />,
  },
];

const AddNewPromoCard: FC = () => {
  const { showFinanceForm } = useRootContext();

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  return (
    <DashboardCard flex={1}>
      <div className="flex flex-col items-center justify-center p-5 gap-5 bg-gradient-to-r from-yellow-100 to-yellow-200">
        {/* Bullet points */}
        <div className="flex flex-col flex-1 gap-2 w-full">
          {data.map((rec) => {
            return (
              <div
                key={rec.text}
                className="flex flex-row gap-3 text-l items-center p-3 font-semibold"
              >
                {rec.icon} {rec.text}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div
          onClick={handleAddNew}
          className="border-1 border-gray-500 bg-[var(--primary-btn)] text-[var(--background)] flex flex-row items-center p-3 gap-2 rounded-md w-full justify-center cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Log Now, Grow Smarter"
          onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleAddNew(); }}
        >
          <FaPlus size={30} aria-label="Add icon" />
          <span>Log Now, Grow Smarter</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default AddNewPromoCard;
