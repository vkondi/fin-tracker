import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--primary-btn) shadow-md py-4 mt-auto" role="contentinfo">
      <div className="max-w-2200 mx-auto px-4 text-center">
        <p className="text-sm text-background">
          © {currentYear} Vishwajeet Kondi
        </p>
      </div>
    </footer>
  );
};

export default Footer;