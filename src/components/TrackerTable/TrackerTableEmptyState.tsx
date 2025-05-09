import { useRootContext } from "@/context/RootContext";
import { useSession } from "next-auth/react";

const TrackerTableEmptyState = () => {
  const { data: session } = useSession();

  const { showFinanceForm } = useRootContext();
  const name = session?.user?.name || "";
  const message = name
    ? `Hey ${name}, arm yourself with data.\nConquer your finances.\nStart tracking!`
    : `Hey, arm yourself with data.\nConquer your finances.\nStart tracking!`;

  const handleAddNew = () => {
    showFinanceForm("add");
  };

  return (
    <div className="p-14 border-2 border-gray-300 rounded-lg shadow-md bg-white items-center flex flex-col justify-around">
      <p className="text-lg/relaxed whitespace-pre-line text-center font-light">
        {message}
      </p>
      <button
        onClick={handleAddNew}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-10"
      >
        Add New
      </button>
    </div>
  );
};

export default TrackerTableEmptyState;
