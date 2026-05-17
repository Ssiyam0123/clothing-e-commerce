import ProfileOrdersPage from "@/modules/client/profile/pages/ProfileOrdersPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileOrdersPage />
    </Suspense>
  );
}
