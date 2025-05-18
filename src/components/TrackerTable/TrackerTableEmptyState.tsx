import { useRootContext } from "@/context/RootContext";

import { FaPlus } from "react-icons/fa";
import { MdOutlineInsertChartOutlined } from "react-icons/md";

const TrackerTableEmptyState = () => {
  const { showFinanceForm, isMobile } = useRootContext();
  const message = `Ready to rule your finances?\nLet’s track your first entry!`;

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  return (
    <div
      className={`p-4 bg-white ${
        isMobile ? "" : "w-full"
      } items-center justify-center flex h-[80vh]`}
    >
      <div className="p-14 rounded-lg shadow-md bg-[var(--header-background)] items-center flex flex-col justify-around w-fit">
        <MdOutlineInsertChartOutlined size={100} />

        <p className="text-lg/relaxed whitespace-pre-line text-center font-light">
          {message}
        </p>

        <button
          onClick={handleAddNew}
          className="bg-[var(--primary-btn)] text-white px-4 py-2 rounded hover:bg-[var(--primary-btn-hover)] flex items-center gap-2 mt-10"
        >
          <FaPlus /> Add New
        </button>
      </div>
    </div>
  );
};

export default TrackerTableEmptyState;
