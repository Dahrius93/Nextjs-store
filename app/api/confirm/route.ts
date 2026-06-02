import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from "next/navigation";

import { type NextRequest } from "next/server";
import db from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id") as string;

  // evito session_id = null dato che è as string
  if (!session_id) return Response.json(null, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (session.status === "complete") {
      // se pagamento effettuato controllo se isPaid su db è ancora false
      // e se si lo imposto a true e cancello il carrello
      // se operazione già eseguita evito di cancellare un carrello che non esiste
      // e quindi ricevere errore 500 da server
      const order = await db.order.findUnique({ where: { id: orderId } });
      if (!order?.isPaid) {
        await db.order.update({
          where: {
            id: orderId,
          },
          data: {
            isPaid: true,
          },
        });
        await db.cart.delete({
          where: {
            id: cartId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
  redirect("/orders");
};
