// src/app/flash-sale/page.js
import FlashSaleClient from './FlashSaleClient';

export const metadata = {
  title: 'Exclusive Flash Drops | Vanguard',
  description: 'Limited time premium offers and exclusive drops.',
};

export default function FlashSalePage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505]">
      <FlashSaleClient />
    </main>
  );
}