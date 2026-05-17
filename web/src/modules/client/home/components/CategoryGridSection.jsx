import CategoryGrid from "@/modules/client/home/components/CategoryGrid";
import { getSectionData } from "@/modules/client/home/lib/homeApi";

export default async function CategoryGridSection({ section }) {
  const categories = await getSectionData('/categories', ['categories']);
  if (!categories) return null;

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <CategoryGrid categories={categories} />
    </section>
  );
}
