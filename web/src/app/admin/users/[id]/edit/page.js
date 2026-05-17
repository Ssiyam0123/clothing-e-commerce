import UserEditPage from "@/modules/admin/users/pages/UserEditPage";

export const metadata = {
  title: "Modify User Identity | Admin Panel",
  description: "Configure name, verification, and role clearances for user identity.",
};

export default function UserModifyPage() {
  return <UserEditPage />;
}
