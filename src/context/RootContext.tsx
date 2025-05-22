"use client";

import {
  FinanceFormDataType,
  FinanceFormMode,
  FinancePopupContextStateType,
  LoaderProps,
  Platform,
} from "@/components/component.types";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMediaQuery } from "react-responsive";
import { toast, ToastContainer } from "react-toastify";

type ToastType = typeof toast;

type RootContextType = {
  showFinanceForm: (mode: FinanceFormMode, data?: FinanceFormDataType) => void;
  hideFinanceForm: () => void;
  financePopupState: FinancePopupContextStateType;

  name?: string;
  userId?: string;
  email?: string;

  isUserRegistered?: boolean;

  isMobile: boolean;

  loader: LoaderProps;
  setLoader: Dispatch<SetStateAction<LoaderProps>>;
  toast: ToastType;

  platforms?: Platform[];
};

const RootContext = createContext<RootContextType | undefined>(undefined);

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [loader, setLoader] = useState<LoaderProps>({
    show: false,
  });

  const [name, setName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [platforms, setPlatforms] = useState<Platform[] | undefined>([]);

  const { data: session } = useSession();
  const email = session?.user?.email;

  const isUserRegistered = !!email && !!name;

  const [financePopupState, setFinancePopupState] =
    useState<FinancePopupContextStateType>({ isVisible: false });

  const showFinanceForm = (
    mode: FinanceFormMode,
    data?: FinanceFormDataType
  ) => {
    setFinancePopupState({ isVisible: true, mode, data });
  };

  const hideFinanceForm = () => {
    setFinancePopupState({ isVisible: false });
  };

  const registerUser = useCallback(async () => {
    console.log("[RootContext] >> [registerUser]");

    setLoader({ show: true });
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name: session?.user?.name }),
      });
      const data = await response.json();

      if (data) {
        setName(data?.data?.name ?? "");
        setUserId(data?.data?.id ?? "");
      }
    } catch (error) {
      console.error("[RootContext][registerUser] >> Exception:", error);
    } finally {
      setLoader({ show: false });
    }
  }, [email, session?.user?.name]);

  const getConfigurations = useCallback(async (cache = true) => {
    setLoader({ show: true });
    try {
      const response = await fetch(`/api/finance/config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...(cache
          ? { cache: "force-cache", next: { revalidate: 3600 } } // 1hr cache
          : {}),
      });
      const jsonResponse = await response.json();

      setPlatforms(jsonResponse?.data?.platforms ?? []);
    } catch (error) {
      console.error("[RootContext][getConfigurations] >> Exception:", error);
    } finally {
      setLoader({ show: false });
    }
  }, []);

  // Fetch data only when registered user is logged in
  useEffect(() => {
    if (isUserRegistered) {
      getConfigurations();
    }
  }, [isUserRegistered, getConfigurations]);

  // Register user once email is available from session
  useEffect(() => {
    if (email && !name) {
      registerUser();
    }
  }, [email, name, registerUser]);

  return (
    <RootContext.Provider
      value={{
        // popup
        showFinanceForm,
        hideFinanceForm,
        financePopupState,

        // User details
        name,
        userId,
        email: email ?? undefined,
        isUserRegistered,

        // Device/component
        isMobile,
        loader,
        setLoader,
        toast,

        // Configs
        platforms,
      }}
    >
      {children}
      <ToastContainer />
    </RootContext.Provider>
  );
};

export const useRootContext = () => {
  const context = useContext(RootContext);
  if (!context)
    throw new Error("useRootContext must be used within a RootProvider");

  return context;
};
