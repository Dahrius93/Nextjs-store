"use server";

import db from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { imageSchema, productSchema, validateWithZodSchema } from "./schemas";
import { deleteImage, uploadImage } from "./supabase";

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = ({ search = "" }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect("/products");
  }
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });
    // console.log(validatedFile);
    const fullPath = await uploadImage(validatedFile.image);

    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/admin/products");
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath("/admin/products");
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData,
) => {
  await getAdminUser();
  try {
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(productSchema, rawData);

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData,
) => {
  await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const oldImageUrl = formData.get("url") as string;

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);
    await deleteImage(oldImageUrl);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product Image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// Controlla se un prodotto è nei preferiti dell'utente corrente
// Ritorna l'id del favorito se esiste, altrimenti null
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  // Recupera l'utente autenticato da Clerk
  const user = await getAuthUser();

  // Cerca nella tabella Favorite un record che corrisponda
  // a QUESTO utente + QUESTO prodotto
  const favorite = await db.favorite.findFirst({
    where: {
      productId, // il prodotto da verificare
      clerkId: user.id, // l'utente corrente
    },
    select: {
      id: true, // prende solo campo id, non tutto il record (più efficiente)
    },
  });

  // Se il favorito esiste ritorna il suo id (servirà per cancellarlo)
  // Se non esiste ritorna null (il prodotto non è nei preferiti)
  return favorite?.id || null;
};

// Aggiunge o rimuove un prodotto dai preferiti
//
// Questa action NON riceve formData — tutti i dati arrivano da prevState.
// Significa che viene usata con bind(), come il deleteProductAction
//
// const toggleFavorite = toggleFavoriteAction.bind(null, {
//   productId: "prod_1",
//   favoriteId: "fav_abc123",  // oppure null se non è nei preferiti
//   pathname: "/products",
// });
//
// bind() "cabla" quei valori come primo argomento (prevState),
// così quando il form viene sottomesso React li passa automaticamente
// alla action senza bisogno di hidden input.
export const toggleFavoriteAction = async (prevState: {
  productId: string; // il prodotto da aggiungere/rimuovere
  favoriteId: string | null; // l'id del favorito (null = non è nei preferiti)
  pathname: string; // la pagina corrente, per aggiornare la cache
}) => {
  // Verifica che l'utente sia autenticato
  const user = await getAuthUser();

  // Estrae i dati da prevState (che arrivano da bind)
  const { productId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      // Se favoriteId esiste → il prodotto È già nei preferiti → RIMUOVI
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      // Se favoriteId è null → il prodotto NON è nei preferiti → AGGIUNGI
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }

    revalidatePath(pathname);

    return { message: favoriteId ? "Removed from Faves" : "Added to Faves" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true, // left join della tabella product su favorites (favorite tab principale)
    },
  });
  return favorites;
};
