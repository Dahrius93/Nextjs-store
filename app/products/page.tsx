import { PaginationDemo } from "@/components/products/PaginaionDemo";
import ProductsContainer from "@/components/products/ProductsContainer";

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
