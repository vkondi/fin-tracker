import { useRootContext } from "@/context/RootContext";
import type { FC, PropsWithChildren } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  flex?: number;
  fullWidth?: boolean;
};

const DashboardCard: FC<PropsWithChildren<Props>> = ({
  title,
  subtitle,
  headerRight,
  flex = 1,
  fullWidth = false,
  children,
}) => {
  const { isMobile } = useRootContext();

  return (
    <div
      className={`flex flex-col flex-${flex} items-center bg-white shadow-md min-h-[200px] w-full overflow-hidden rounded-lg ${
        isMobile || fullWidth ? "" : "max-w-[50%]"
      }`}
    >
      {/* Title */}
      {title && (
        <div className="flex items-center justify-between font-semibold text-l bg-[var(--primary-btn)] w-full p-2 text-[var(--background)]">
          <div className="flex items-baseline gap-2">
            <span>{title}</span>
            {subtitle && (
              <span className="text-xs font-normal opacity-85">{subtitle}</span>
            )}
          </div>
          {headerRight && <div className="text-xs font-normal">{headerRight}</div>}
        </div>
      )}

      {/* Content Body */}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default DashboardCard;
