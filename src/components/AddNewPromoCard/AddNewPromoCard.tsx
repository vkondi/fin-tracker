import { useRootContext } from "@/context/RootContext";
import DashboardCard from "../DashboardCard/DashboardCard";
import { FC } from "react";
import { ImCheckmark } from "react-icons/im";
import { IoPieChartSharp } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";

const data = [
  {
    text: "Stay on Top of Your Finances",
    icon: <ImCheckmark color="green" size={30} />,
  },
  {
    text: "See Real-Time Insights",
    icon: <IoPieChartSharp color="#45ade7" size={30} />,
  },
  {
    text: "Takes Just 10 Seconds!",
    icon: <AiFillThunderbolt color="orange" size={30} />,
  },
];

const AddNewPromoCard: FC = () => {
  const { showFinanceForm, loading, hasNoFinanceData } = useRootContext();

  const handleAddNew = () => {
    showFinanceForm("add");
  };

   // Scenarios to hide component
   if (loading || hasNoFinanceData) {
    return null;
  }

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
          className="border-1 border-gray-500 bg-[var(--primary-btn)] text-[var(--background)] flex flex-row items-center p-3 gap-2 rounded-md w-full justify-center"
        >
          <IoMdAdd size={30} />
          <span>Log Now, Grow Smarter</span>
        </div>
      </div>
    </DashboardCard>
  );
};

export default AddNewPromoCard;
