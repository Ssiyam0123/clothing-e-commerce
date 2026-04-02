'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminBannerCampaigns } from '@/hooks/useAdminBannerCampaigns';
import { getImageUrl } from '@/utils/imageUtils';
// 1. Swal Utilities Import
import { swalConfirm, swalToast, swalError } from '@/utils/swal';

export default function AdminBannerCampaigns() {
  const { campaigns, isLoading, deleteCampaign, toggleActive } = useAdminBannerCampaigns();

  const handleToggleActive = async (id) => {
    try {
      await toggleActive(id);
      swalToast('Status Synchronized', 'success');
    } catch (err) {
      swalError('Sync Failed', 'Could not update campaign status.');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await swalConfirm(
      'Obliterate Campaign?', 
      'This will permanently delete the campaign and all its visual slides.'
    );

    if (isConfirmed) {
      try {
        await deleteCampaign(id);
        swalToast('Campaign Purged', 'success');
      } catch (err) {
        swalError('Action Failed', 'Error removing campaign from databanks.');
      }
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Hero Campaigns</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Manage Homepage Carousel</p>
        </div>
        <Link 
          href="/admin/banner-campaigns/new" 
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          + Initialize Campaign
        </Link>
      </div>

      {/* Grid Area: Skeleton vs Real Data */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 h-[350px] animate-pulse"></div>
          ))}
        </div>
      ) : (!campaigns || campaigns.length === 0) ? (
        <div className="col-span-full text-center py-24 bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-inner">
           <span className="text-7xl block mb-6 grayscale opacity-20">🎴</span>
           <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter mb-2">No Campaigns Found</h2>
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Create a deck to power the homepage hero</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 flex flex-col group p-8">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-2">{campaign.name}</h2>
                  <p className="text-xs font-medium text-zinc-500 line-clamp-2">{campaign.description || 'No description provided'}</p>
                </div>
                <button
                  onClick={() => handleToggleActive(campaign._id)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                    campaign.isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-md'
                      : 'bg-transparent text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                  }`}
                >
                  {campaign.isActive ? '● ACTIVE' : '○ INACTIVE'}
                </button>
              </div>

              {/* Slides Preview Gallery */}
              <div className="bg-zinc-50 dark:bg-[#111] border border-zinc-100 dark:border-zinc-800/50 rounded-[1.5rem] p-4 mb-8">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 px-2">Deck Setup ({campaign.slides.length} Slides)</p>
                <div className="flex -space-x-4 overflow-hidden px-2 pb-2">
                  {campaign.slides.slice(0, 4).map((slide, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-[#0a0a0a] shadow-sm shrink-0 relative group/img">
                      {slide.image ? (
                        <img src={getImageUrl(slide.image)} alt="slide" className="w-full h-full object-cover grayscale-[20%] group-hover/img:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs grayscale">🖼️</div>
                      )}
                    </div>
                  ))}
                  {campaign.slides.length > 4 && (
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 border-2 border-white dark:border-[#0a0a0a] z-10 shadow-sm">
                      +{campaign.slides.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto flex gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Link 
                  href={`/admin/banner-campaigns/${campaign._id}`} 
                  className="flex-1 text-center bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
                >
                  Configure Deck
                </Link>
                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 p-3.5 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}