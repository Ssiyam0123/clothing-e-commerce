import UserDetailPageClient from "./components/UserDetailPageClient";

export const metadata = {
  title: "User Profile Audit | Admin Panel",
  description: "View transaction log, member timeline, and metrics audit for user.",
};

export default function Page(props) {
  return <UserDetailPageClient {...props} />;
}
