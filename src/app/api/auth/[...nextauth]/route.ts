// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// // Configure NextAuth
// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID || "",
//       clientSecret: process.env.GOOGLE_SECRET || "",
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
// });

// // Export the handler as GET and POST
// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
