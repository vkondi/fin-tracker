import { type FC, ReactNode } from "react";
import clsx from "clsx";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string; // Allow passing additional classes from the parent
}

const ContentWrapper: FC<ContentWrapperProps> = ({ children, className }) => {
  return (
    <div className="w-full bg-gray-100">
      <div className={clsx("max-w-[2200px] mx-auto", className)}>
        {children}
      </div>
    </div>
  );
};

export default ContentWrapper;