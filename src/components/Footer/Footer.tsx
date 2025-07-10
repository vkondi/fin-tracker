import { FC } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-[2200px] mx-auto px-4 text-center">
        <p className="text-sm">
          Copyright (c) {currentYear} Vishwajeet Kondi
        </p>
        <p className="text-xs text-gray-400 mt-1">
          This project is licensed under the MIT License.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 