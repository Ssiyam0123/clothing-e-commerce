import UserListPageClient from "./components/UserListPageClient";

export const metadata = {
  title: "User Directory | Admin Panel",
  description: "Manage clothing e-commerce members, credentials, and roles.",
};

export default function Page(props) {
  return <UserListPageClient {...props} />;
}
