"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${pathname ?? "/"}`);
    }
  }, [status, router, pathname]);

  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Return null during the redirect to avoid flash of content
  return null;
}
