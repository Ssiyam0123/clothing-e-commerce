import OrderDetailsPageClient from "./components/OrderDetailsPageClient";

export const metadata = {
  title: "Order Details | Vanguard Admin",
  description: "View and manage order details",
};

export default function Page(props) {
  return <OrderDetailsPageClient {...props} />;
}
