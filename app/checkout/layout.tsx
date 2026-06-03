import type { Metadata } from "next";

// La pagina checkout è un Client Component ("use client"), quindi NON può
// esportare `metadata`. Lo facciamo qui nel layout, che resta un Server
// Component e avvolge la pagina.
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
