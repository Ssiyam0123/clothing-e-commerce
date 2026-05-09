import HeroSection from "./HeroSection";

export default function HeroSectionServer({ campaign, lang, ui, showHeader = true }) {
  const slides = campaign?.slides?.sort((a, b) => a.order - b.order) || [];

  return <HeroSection slides={slides} ui={ui} lang={lang} showHeader={showHeader} />;
}
