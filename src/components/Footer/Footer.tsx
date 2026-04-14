import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  const footerContent1 = `Copyright © ${currentYear} Vishwajeet Kondi.`;
  const footerContent2 = "All rights reserved.";

  return (
    <footer className="bg-(--primary-btn) shadow-md py-6 mt-auto" role="contentinfo">
      <div className="max-w-2200 mx-auto px-4 text-center">
        {/* Mobile: two lines. Desktop: one line. Controlled via CSS to avoid hydration mismatch. */}
        <p className="text-sm text-background hidden sm:block">
          {footerContent1} {footerContent2}
        </p>
        <p className="text-sm text-background sm:hidden">
          {footerContent1}
        </p>
        <p className="text-xs text-gray-300 mt-1 sm:hidden">
          {footerContent2}
        </p>
      </div>
    </footer>
  );
};

export default Footer;