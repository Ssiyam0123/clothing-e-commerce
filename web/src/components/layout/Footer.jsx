'use client';

import Link from 'next/link';

const DICTIONARY = {
  en: { footer: 'Established 2026. Crafted for trendsetters.' },
  bn: { footer: 'প্রতিষ্ঠিত ২০২৬। সচেতনদের জন্য তৈরি।' }
};

import { useSettings } from '@/hooks/useSettings';
import { Globe, Camera, Send, MessageCircle, Video, Music, User, Hash, Share2 } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';

const SOCIAL_ICONS = {
  facebook: Globe,
  instagram: Camera,
  twitter: Send,
  x: Send,
  whatsapp: MessageCircle,
  youtube: Video,
  tiktok: Music,
  linkedin: User,
  pinterest: Hash,
  threads: Hash,
  telegram: Send
};

export default function Footer({ lang }) {
  const { settings } = useSettings();
  const branding = settings?.branding || {};
  const siteName = branding.siteName || 'VANGUARD';
  const footerLogo = branding.footerLogo;
  const socialLinks = settings?.socialLinks?.filter(l => l.isActive) || [];
  const contact = settings?.contact || {};
  
  const ui = DICTIONARY[lang] || DICTIONARY['en'];

  return (
    <footer className="py-24 border-t transition-colors duration-700 bg-zinc-50 dark:bg-[#050505] border-zinc-200 dark:border-zinc-900 text-zinc-500 dark:text-zinc-600">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        {footerLogo ? (
          <img src={getImageUrl(footerLogo)} alt={siteName} className="h-12 w-auto object-contain opacity-20 hover:opacity-50 transition-opacity mb-8" />
        ) : (
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter opacity-20 mb-8">{siteName}</h2>
        )}
        <p className={`max-w-md mx-auto leading-relaxed ${lang === 'en' ? 'text-[10px] font-black uppercase tracking-[0.5em]' : 'text-sm font-semibold'}`}>
          {ui.footer}
        </p>
        
        {contact.phone && (
          <p className="mt-4 text-[9px] font-black uppercase tracking-widest opacity-40">
            {contact.phone} | {contact.email}
          </p>
        )}
        
        {contact.address && (
          <p className="mt-2 text-[8px] font-bold uppercase tracking-widest opacity-30">
            {contact.address}
          </p>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6 text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
           {socialLinks.length > 0 ? (
             socialLinks.map((link, idx) => {
               const Icon = SOCIAL_ICONS[link.platform.toLowerCase()] || Share2;
               return (
                 <Link 
                   key={idx} 
                   href={link.url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="hover:text-rose-600 dark:hover:text-rose-500 transition-all flex items-center gap-2 group"
                 >
                   <Icon size={12} className="group-hover:scale-125 transition-transform" /> 
                   <span>{link.platform}</span>
                 </Link>
               );
             })
           ) : (
             <div className="flex gap-10">
               <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
             </div>
           )}
        </div>
        
        <p className="mt-10 text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
          © {new Date().getFullYear()} {siteName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
