import BannerSlider from "@/app/_components/BannerSlider";
import { getSectionData } from "@/app/_lib/homeApi";

export default async function PromoBannerSection({ lang, t, section }) {
  const config = section.config;
  const campaignId = config?.campaignId;
  const endpoint = campaignId ? `/banner-campaigns/${campaignId}/public` : '/banner-campaigns/active';
  const campaign = await getSectionData(endpoint, ['campaigns']);

  // 🧪 Extract Manual Slides if they exist
  const manualSlides = (section.images || [])
    .filter(img => {
      if (typeof img === 'string') return img && img.trim() !== "";
      if (typeof img === 'object' && img !== null) return img.image && img.image.trim() !== "";
      return false;
    })
    .map(img => {
      const isObject = typeof img === 'object' && img !== null;
      return { 
        image: isObject ? img.image : img, 
        title: "", 
        subtitle: "", 
        link: (isObject && img.link) ? img.link : (section.actionLink || "#")
      };
    });

  if (manualSlides.length === 0 && !section.imageUrl && !campaign) return null;

  const bannerSlides = manualSlides.length > 0
    ? manualSlides
    : (campaign?.slides?.length > 0 
        ? campaign.slides.map(s => ({ ...s, title: "", subtitle: "" }))
        : (section.imageUrl 
            ? [{ image: section.imageUrl, title: "", subtitle: "", link: section.actionLink || "#" }]
            : [])
      );

  if (bannerSlides.length === 0) return null;

  return (
    <BannerSlider 
      slides={bannerSlides} 
      lang={lang} 
      buttonText={section.buttonText || t.heroBtn || "Shop Now"} 
      showHeader={config?.showHeader !== false} 
    />
  );
}
