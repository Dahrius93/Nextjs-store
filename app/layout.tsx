import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/global/Container";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Next Storefront",
//   description: "A nifty store built with Next.js",
// };

export const metadata: Metadata = {
  metadataBase: new URL("https://nextjs-store-roan-eight.vercel.app/"),
  title: {
    default: "Home Store — Modern Home Furniture & Decor",
    template: "%s | Home Store",
  },
  description:
    "Shop premium home furniture, lighting, rugs and decor. " +
    "Free shipping on orders over $99. 30-day free returns.",
  // Default social card: ogni pagina che non sovrascrive openGraph/twitter
  // eredita questa anteprima quando il link viene condiviso.
  openGraph: {
    type: "website",
    siteName: "Home Store",
    locale: "en_US",
    url: "/",
    title: "Home Store — Modern Home Furniture & Decor",
    description:
      "Shop premium home furniture, lighting, rugs and decor. Free shipping over $99.",
    images: [{ url: "/images/hero1.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Store — Modern Home Furniture & Decor",
    description:
      "Shop premium home furniture, lighting, rugs and decor. Free shipping over $99.",
    images: ["/images/hero1.jpg"],
  },
  keywords: [
    "home furniture",
    "home decor",
    "interior design",
    "sofas",
    "lighting",
    "rugs",
    "online furniture store",
  ],
  authors: [
    {
      name: "Home Store Team",
      url: "https://nextjs-store-roan-eight.vercel.app/",
    },
  ],
  creator: "Home Store Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  // Colore della UI del browser (barra mobile): chiaro in light mode, scuro in dark.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            <Navbar />
            <Container className="py-20">{children}</Container>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
