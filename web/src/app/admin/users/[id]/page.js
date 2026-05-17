import UserDetailPage from "@/modules/admin/users/pages/UserDetailPage";

export const metadata = {
  title: "User Profile Audit | Admin Panel",
  description: "View transaction log, member timeline, and metrics audit for user.",
};

export default function UserAuditPage() {
  return <UserDetailPage />;
}
