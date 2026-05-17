import OrdersPageClient from "./components/OrdersPageClient";

export const metadata = {
  title: "Admin Orders | Vanguard",
  description: "Manage orders",
};

export default function Page(props) {
  return <OrdersPageClient {...props} />;
}
