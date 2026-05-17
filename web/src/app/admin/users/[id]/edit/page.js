import UserEditPageClient from "./components/UserEditPageClient";

export const metadata = {
  title: "Modify User Identity | Admin Panel",
  description: "Configure name, verification, and role clearances for user identity.",
};

export default function Page(props) {
  return <UserEditPageClient {...props} />;
}
