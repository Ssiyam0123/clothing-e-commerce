import BlogFormPageClient from "./components/BlogFormPageClient";

export const metadata = {
  title: "Initialize Narrative | Admin Panel",
  description: "Create a new narrative sequence in the journal archives.",
};

export default function Page(props) {
  return <BlogFormPageClient {...props} />;
}
