"use client";
import { Card } from "@/components/ui/card";
import { FirstColumn, SecondColumn, FourthColumn } from "./CartItemColumns";
import ThirdColumn from "./ThirdColumn"; // client component
import { CartItemWithProduct } from "@/utils/types";

// CartItemsWithProduct è un tipo prisma definito su types.ts
// aggiunge il prodotto associato al CartItem il quale da solo
// avrebbe ID e quantità. invece così aggiungiamo nome, prezzo etc.
function CartItemsList({ cartItems }: { cartItems: CartItemWithProduct[] }) {
  return (
    <div>
      {cartItems.map((cartItem) => {
        const { id, amount } = cartItem;
        const { id: productId, image, name, company, price } = cartItem.product;
        return (
          <Card
            key={id}
            className="flex flex-col gap-y-4 md:flex-row flex-wrap p-6 mb-8 gap-x-4"
          >
            <FirstColumn image={image} name={name} />
            <SecondColumn name={name} company={company} productId={productId} />
            <ThirdColumn id={id} quantity={amount} />
            <FourthColumn price={price} />
          </Card>
        );
      })}
    </div>
  );
}
export default CartItemsList;
