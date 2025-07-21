import { FC } from "react";
import { useRootContext } from "@/context/RootContext";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const { isMobile } = useRootContext();

  return (
    <footer className="bg-[var(--primary-btn)] shadow-md py-6 mt-auto" role="contentinfo">
      <div className="max-w-[2200px] mx-auto px-4 text-center">
        {isMobile ? (
          <>
            <p className="text-sm text-[var(--background)]">
              Copyright (c) {currentYear} Vishwajeet Kondi
            </p>
            <p className="text-xs text-gray-300 mt-1">
              This project is licensed under the MIT License.
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--background)]">
            Copyright (c) {currentYear} Vishwajeet Kondi • This project is licensed under the MIT License.
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer; 