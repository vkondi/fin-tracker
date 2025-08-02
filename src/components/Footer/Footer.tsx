import { FC } from "react";
import { useRootContext } from "@/context/RootContext";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const { isMobile } = useRootContext();
  const footerContent1 = `Copyright © ${currentYear} Vishwajeet Kondi.`
  const footerContent2 = "All rights reserved.";

  return (
    <footer className="bg-[var(--primary-btn)] shadow-md py-6 mt-auto" role="contentinfo">
      <div className="max-w-[2200px] mx-auto px-4 text-center">
        {isMobile ? (
          <>
            <p className="text-sm text-[var(--background)]">
              {footerContent1}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {footerContent2}
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--background)]">
            {footerContent1} {footerContent2}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer; 