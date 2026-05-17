import BlogEditPageClient from "./components/BlogEditPageClient";

export const metadata = {
  title: "Reconfigure Narrative | Admin Panel",
  description: "Edit sequence and archive metadata for the narrative.",
};

export default function Page(props) {
  return <BlogEditPageClient {...props} />;
}
