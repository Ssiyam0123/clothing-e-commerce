import UserListPage from "@/modules/admin/users/pages/UserListPage";

export const metadata = {
  title: "User Directory | Admin Panel",
  description: "Manage clothing e-commerce members, credentials, and roles.",
};

export default function Users() {
  return <UserListPage />;
}
