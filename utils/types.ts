import { Prisma } from "@prisma/client";

export type actionFunction = (
  prevState: any,
  formData: FormData,
) => Promise<{ message: string }>;

export type CartItem = {
  productId: string;
  image: string;
  title: string;
  price: string;
  amount: number;
  company: string;
};

export type CartState = {
  cartItems: CartItem[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
};

// tipo prisma che include il Product nel CartItem
// senza include CartItem avrebbe solamente ID e quantità
// così invece ho anche nome, prezzo, immagine etc..
export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;
