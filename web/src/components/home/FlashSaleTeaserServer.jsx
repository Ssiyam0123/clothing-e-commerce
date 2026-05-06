import FlashSaleTeaser from './FlashSaleTeaser';

export default function FlashSaleTeaserServer({ activeSale, products, lang, ui }) {
  return (
    <FlashSaleTeaser 
      activeSale={activeSale} 
      flashSaleProducts={products}
      ui={ui} 
      lang={lang} 
    />
  );
}
