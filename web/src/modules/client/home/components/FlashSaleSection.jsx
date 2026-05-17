import FlashSaleTeaser from "@/modules/client/home/components/FlashSaleTeaser";
import ViewMoreButton from "./ViewMoreButton";
import { getSectionData } from "@/modules/client/home/lib/homeApi";

export default async function FlashSaleSection({ lang, t, section }) {
  const config = section.config;
  const flashSaleData = await getSectionData('/flash-sales/active', ['flash-sales']);
  
  if (!flashSaleData) return null;

  let allSales = [];
  if (Array.isArray(flashSaleData)) {
    allSales = flashSaleData;
  } else if (flashSaleData.flashSale) {
    allSales = [flashSaleData.flashSale];
  }

  let activeSale = config?.saleId 
    ? allSales.find(s => String(s._id) === String(config.saleId))
    : allSales.find(s => s.isActive);
  
  if (!activeSale) return null;
  
  const products = (activeSale.products || flashSaleData.products || []).filter(p => {
    if (!config?.subcategoryId) return true;
    const subId = p.subcategory?._id || p.subcategory;
    return String(subId) === String(config.subcategoryId);
  });

  return (
    <section className="px-6 sm:px-8 lg:px-12 max-w-screen-2xl mx-auto py-6 md:py-10 w-full">
      <FlashSaleTeaser activeSale={activeSale} flashSaleProducts={{ products }} lang={lang} ui={t} />
      <ViewMoreButton 
        href={`/flash-sale/${activeSale.slug}`} 
        label={`${t.seeMore || "Explore"} ${activeSale.name}`} 
      />
    </section>
  );
}
