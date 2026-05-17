import BlogListPageClient from "./components/BlogListPageClient";

export const metadata = {
  title: "Blog Archives | Admin Panel",
  description: "Manage clothing e-commerce journal sequences and narratives.",
};

export default function Page(props) {
  return <BlogListPageClient {...props} />;
}
