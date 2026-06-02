import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { type NextRequest } from "next/server";
import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  const { userId } = auth();
  // controllo utente loggato
  if (!userId) return Response.json(null, { status: 401 });

  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");
  const { orderId, cartId } = await req.json();

  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });
  const cart = await db.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // controllo order = carrello
  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  // controllo ownership ordine
  if (order.clerkId !== userId) {
    return Response.json(null, {
      status: 403,
      statusText: "Forbidden, user id does not match",
    });
  }
  // controllo ownership carrello
  if (cart.clerkId !== userId) {
    return Response.json(null, {
      status: 403,
      statusText: "Forbidden, user id does not match",
    });
  }

  const line_items = cart.cartItems.map((cartItem) => {
    return {
      quantity: cartItem.amount,
      price_data: {
        currency: "usd",
        product_data: {
          name: cartItem.product.name,
          images: [cartItem.product.image],
        },
        unit_amount: cartItem.product.price * 100, // price in cents - stripe cerca l'unità più piccola in questo caso centesimi
      },
    };
  });
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId, cartId },
      line_items: line_items,
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`, // in questo modo funziona sia localhost che in prodizione
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);

    // pagamento non riuscito
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};
