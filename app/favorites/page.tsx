import type { Metadata } from "next";
import { fetchUserFavorites } from "@/utils/actions";
import SectionTitle from "@/components/global/SectionTitle";
import ProductsGrid from "@/components/products/ProductsGrid";

export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false, follow: false },
};

async function FavoritesPage() {
  const favorites = await fetchUserFavorites();
  if (favorites.length === 0)
    return <SectionTitle text="You have no favorites yet." />;
  return (
    <div>
      <SectionTitle text="Favorites" />
      <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
    </div>
  );
}

export default FavoritesPage;

// favorite.product è il risultato della left join effettuata
// da fetchUserFavorites il quale unisce la tabella product
// sulla tabella favorite
