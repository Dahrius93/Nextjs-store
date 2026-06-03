import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Metadata } from "next";
import SectionTitle from "@/components/global/SectionTitle";
import { fetchUserOrders } from "@/utils/actions";
import { formatCurrency, formatDate } from "@/utils/format";

export const metadata: Metadata = {
  title: "Your Orders",
  robots: { index: false, follow: false },
};

async function OrdersPage() {
  const orders = await fetchUserOrders();

  return (
    <>
      <SectionTitle text="Your Orders" />
      <div>
        <Table>
          <TableCaption>Total orders : {orders.length}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Products</TableHead>
              <TableHead>Order Total</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const { id, products, orderTotal, tax, shipping, createdAt } =
                order;

              return (
                <TableRow key={order.id}>
                  <TableCell>{products}</TableCell>
                  <TableCell>{formatCurrency(orderTotal)}</TableCell>
                  <TableCell>{formatCurrency(tax)}</TableCell>
                  <TableCell>{formatCurrency(shipping)}</TableCell>
                  <TableCell>{formatDate(createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default OrdersPage;
