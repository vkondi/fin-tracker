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
      className={`items-center flex flex-col bg-white rounded-md w-full overflow-hidden shadow-md flex-${flex} min-h-[200px]`}
    >
      <div className="font-semibold text-l bg-[var(--primary-btn)] w-full p-2 text-[var(--background)]">
        {title}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default DashboardCard;
