"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {

    // console.log("process.env: ",process.env)

//   if (!process.env.GOOGLE_ID) {
//     throw new Error("Missing GOOGLE_ID environment variable");
//   }

  return (
    <GoogleOAuthProvider clientId="187710102686-09qiaca1bvgr2e5fvj8hakece88vva9e.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
