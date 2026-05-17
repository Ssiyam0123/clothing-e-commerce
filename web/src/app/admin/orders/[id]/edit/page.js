import EditOrderPageClient from "./components/EditOrderPageClient";

export const metadata = {
  title: "Edit Order | Vanguard Admin",
  description: "Edit order details",
};

export default function Page(props) {
  return <EditOrderPageClient {...props} />;
}
