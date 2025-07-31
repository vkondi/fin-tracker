import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FINTRAKR",
  description:
    "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
  openGraph: {
    title: "FINTRAKR",
    description:
      "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
    type: "website",
    url: "https://my-fintracker.vercel.app/",
    images: [
      {
        url: "https://my-fintracker.vercel.app/thumbnail.png",
        width: 1905,
        height: 902,
        alt: "FINTRAKR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FINTRAKR",
    description:
      "A multi-user investment portfolio tracker with real-time analytics and visual insights.",
    images: ["https://my-fintracker.vercel.app/thumbnail.png"],
  },
};
