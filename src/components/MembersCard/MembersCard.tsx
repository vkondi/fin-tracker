import { useRootContext } from "@/context/RootContext";
import DashboardCard from "../DashboardCard/DashboardCard";
import { FC } from "react";

const MembersCard: FC = () => {
    const {financeData} = useRootContext();

    console.log(financeData)

  return <DashboardCard flex={1}></DashboardCard>;
};

export default MembersCard;
