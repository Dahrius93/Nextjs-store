import { PaginationDemo } from "@/components/products/PaginaionDemo";
import ProductsContainer from "@/components/products/ProductsContainer";
import { Metadata } from "next";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { search?: string };
}): Metadata {
  const search = searchParams.search;
  return {
    title: search ? `Search: ${search}` : "All Products",
    description:
      "Browse our full catalog of home furniture, lighting, rugs and decor.",
    alternates: { canonical: "/products" },
  };
}

async function ProductsPage({
  searchParams,
}: {
  searchParams: { layout?: string; search?: string };
}) {
  const layout = searchParams.layout || "grid";
  const search = searchParams.search || "";
  return (
    <>
      <ProductsContainer layout={layout} search={search} />
      <div className="mt-24">
        <PaginationDemo />
      </div>
    </>
  );
}
export default ProductsPage;
