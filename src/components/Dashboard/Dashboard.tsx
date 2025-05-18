import WelcomeMessage from "./WelcomeMessage/WelcomeMessage";
import Summary from "./Summary/Summary";
import { useRootContext } from "@/context/RootContext";
import OwnerDistribution from "./OwnerDistribution/OwnerDistribution";
import MembersCard from "./MembersCard/MembersCard";
import AddNewPromoCard from "./AddNewPromoCard/AddNewPromoCard";
import CategoryDistribution from "./CategoryDistribution/CategoryDistribution";

const Dashboard = () => {
  const { isMobile } = useRootContext();

  const gridRowCls = `flex ${
    isMobile ? "flex-col" : "flex-row"
  } gap-6 w-full items-center`;

  return (
    <div
      className={`flex min-h-screen flex-col items-center bg-gray-200 min-w-[360px] ${
        isMobile ? "px-2" : "p-16"
      }`}
    >
      {/* Welcome message component */}
      <WelcomeMessage />

      <div className="flex flex-col items-center w-full gap-6">
        {/* Top Row */}
        <div className={gridRowCls}>
          {/* Summary component */}
          <AddNewPromoCard />
          <Summary />
          <MembersCard />
        </div>

        {/* Second Row */}
        <div className={gridRowCls}>
          <OwnerDistribution />

          <CategoryDistribution />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
