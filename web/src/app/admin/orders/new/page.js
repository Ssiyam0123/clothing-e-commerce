import CreateAdminOrderClient from "./components/CreateAdminOrderClient";

export const metadata = {
  title: "Create Order | Vanguard Admin",
  description: "Create a new admin order manually",
};

export default function Page(props) {
  return <CreateAdminOrderClient {...props} />;
}
