import { useRootContext } from "@/context/RootContext";
import type { FC, PropsWithChildren } from "react";

type Props = {
  title?: string;
  flex?: number;
};

const DashboardCard: FC<PropsWithChildren<Props>> = ({
  title,
  flex = 1,
  children,
}) => {
  const { isMobile } = useRootContext();

  return (
    <div
      className={`flex flex-col flex-${flex} items-center bg-white shadow-md min-h-[200px] w-full overflow-hidden rounded-lg ${
        isMobile ? "" : "max-w-[50%]"
      }`}
    >
      {/* Title */}
      {title && (
        <div className="font-semibold text-l bg-[var(--primary-btn)] w-full p-2 text-[var(--background)]">
          {title}
        </div>
      )}

      {/* Content Body */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
