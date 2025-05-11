import type { FC, PropsWithChildren } from "react";

type Props = {
  isMobile?: boolean;
  title: string;
  flex?: number;
};

const DashboardCard: FC<PropsWithChildren<Props>> = ({
  title,
  flex = 1,
  children,
}) => {
  return (
    <div
      className={`flex flex-col flex-${flex} items-center bg-white shadow-md min-h-[200px] w-full overflow-hidden rounded-lg`}
    >
      <div className="font-semibold text-l bg-[var(--primary-btn)] w-full p-2 text-[var(--background)]">
        {title}
      </div>
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
