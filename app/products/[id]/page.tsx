import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct, findExistingReview } from "@/utils/actions";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import FavoriteToggleButton from "@/components/products/FavoriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";
import ShareButton from "@/components/single-product/ShareButton";
import SubmitReview from "@/components/reviews/SubmitReview";
import ProductReviews from "@/components/reviews/ProductReviews";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchSingleProduct(params.id);
  const { name, image, company, description, price } = product;
  const dollarsAmount = formatCurrency(price);

  // Una sola fonte di verità per la descrizione, riusata in tag/OG/twitter.
  const metaDescription = `${description.slice(0, 120)} — ${dollarsAmount} by ${company}.`;

  return {
    title: name, // → "Linen Sofa 3-Seater | Home Store"
    description: metaDescription,
    openGraph: {
      title: name,
      description: metaDescription,
      url: `/products/${params.id}`,
      type: "website", // "product" non è supportato dal tipo OpenGraph di Next
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: metaDescription,
      images: [image],
    },
    alternates: {
      canonical: `/products/${params.id}`,
    },
  };
}

async function SingleProductPage({ params }: { params: { id: string } }) {
  const product = await fetchSingleProduct(params.id);
  const { name, image, company, description, price } = product;
  const dollarsAmount = formatCurrency(price);
  const { userId } = auth();
  const reviewDoesNotExist =
    userId && !(await findExistingReview(userId, product.id));

  return (
    <section>
      <BreadCrumbs name={product.name} />
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        {/* IMAGE FIRST COL */}
        <div className="relative h-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
            priority
            className="w-full rounded-md object-cover"
          />
        </div>
        {/* PRODUCT INFO SECOND COL */}
        <div>
          <div className="flex gap-x-8 items-center">
            <h1 className="capitalize text-3xl font-bold">{name}</h1>
            <div className="flex items-center gap-x-2">
              <FavoriteToggleButton productId={params.id} />
              <ShareButton name={product.name} productId={params.id} />
            </div>
          </div>
          <ProductRating productId={params.id} />
          <h4 className="text-xl mt-2">{company}</h4>
          <p className="mt-3 text-md bg-muted inline-block p-2 rounded-md">
            {dollarsAmount}
          </p>
          <p className="mt-6 leading-8 text-muted-foreground">{description}</p>
          <AddToCart productId={params.id} />
        </div>
      </div>
      <ProductReviews productId={params.id} />
      {reviewDoesNotExist && <SubmitReview productId={params.id} />}
    </section>
  );
}
export default SingleProductPage;
