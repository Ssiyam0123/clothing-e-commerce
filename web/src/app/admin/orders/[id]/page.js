'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { swalConfirm, swalToast, swalError } from '@/utils/swal';
import Loader from '@/components/common/Loader';
import { getImageUrl } from '@/utils/imageUtils';
import { 
  Zap, Package, Truck, CheckCircle2, 
  XCircle, Clock, ShieldCheck, Mail, Phone, MapPin 
} from 'lucide-react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { orderDetails: order, orderDetailsLoading, updateStatus, syncToPathao } = useOrders({}, id);
  const [syncing, setSyncing] = useState(false);

  // 🕵️ Senior Logic: ইউজার রেজিস্টার্ড নাকি গেস্ট তা ডিটেক্ট করা
  const customerName = useMemo(() => order?.user?.name || order?.shippingAddress?.name || 'Unknown Guest', [order]);
  const customerEmail = useMemo(() => order?.user?.email || order?.shippingAddress?.email || 'N/A', [order]);
  const isRegistered = !!order?.user;

  const handleStatusUpdate = async (newStatus) => {
    const confirmed = await swalConfirm('Update Status?', `Mark this order as ${newStatus}?`);
    if (confirmed) {
      try {
        await updateStatus({ id: order._id, status: newStatus });
        swalToast(`Order updated to ${newStatus}`);
      } catch (err) {
        swalError('Update Failed', err.response?.data?.message);
      }
    }
  };

  const handlePathaoSync = async () => {
    const confirmed = await swalConfirm('Sync to Pathao?', 'This will create a live consignment in Pathao.');
    if (confirmed) {
      try {
        setSyncing(true);
        await syncToPathao(order._id);
        swalToast('Synced with Pathao!');
      } catch (err) {
        swalError('Sync Failed', err.response?.data?.message || 'Check Pathao IDs.');
      } finally {
        setSyncing(false);
      }
    }
  };

  if (orderDetailsLoading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!order) return <div className="p-20 text-center uppercase font-black text-zinc-400">Order not found</div>;

  const statusColors = {
    'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Cancelled': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    'Pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Processing': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    'Shipped': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-32 px-4 sm:px-10 pt-10">
      
      {/* 🧭 NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-2">
          <Link href="/admin/orders" className="text-[10px] font-black text-zinc-400 hover:text-rose-600 uppercase tracking-[0.3em] flex items-center gap-2 transition-all">
            <Package size={12} /> Order Archives
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">#{order._id.slice(-8)}</h1>
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[order.orderStatus]}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={order.orderStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={['Delivered', 'Cancelled'].includes(order.orderStatus)}
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:border-zinc-400 transition-all disabled:opacity-50"
          >
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          
          {order.pathaoConsignmentId ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-8 py-4 rounded-2xl flex items-center gap-3">
              <Truck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Pathao: {order.pathaoConsignmentId}</span>
            </div>
          ) : (
            <button 
              onClick={handlePathaoSync}
              disabled={syncing || ['Cancelled', 'Delivered'].includes(order.orderStatus)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 shadow-xl flex items-center gap-3"
            >
              {syncing ? <Loader size="small" /> : <><Zap size={16} fill="currentColor" /> Sync Pathao</>}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 📦 LEFT: Manifest (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-10 border-b dark:border-zinc-800 pb-4">01. Artifact Manifest</h3>
            
            <div className="space-y-6">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center gap-8 p-6 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-white/5 group">
                  <div className="h-32 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden shrink-0 border dark:border-white/5 shadow-inner">
                    <img src={getImageUrl(item.image || item.product?.images?.[0])} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.name} />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-xl italic">{item.name}</p>
                    <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Price per unit: ৳{item.price}</p>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Quantity</p>
                      <p className="text-3xl font-black text-zinc-900 dark:text-white">×{item.quantity}</p>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Subtotal</p>
                      <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">৳{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* FINANCIAL SUMMARY */}
            <div className="mt-12 pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between gap-10">
              <div className="space-y-4 flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-zinc-900 dark:text-white">৳{order.itemsPrice?.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Logistics Fee</span>
                  <span className="text-zinc-900 dark:text-white">৳{order.shippingPrice?.toFixed(0)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    <span>Voucher Discount</span>
                    <span>- ৳{order.discountAmount.toFixed(0)}</span>
                  </div>
                )}
              </div>
              <div className="md:text-right md:border-l dark:border-zinc-800 md:pl-12">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">Total Settlement</p>
                <p className="text-6xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none italic">
                  ৳{order.totalPrice.toFixed(0)}
                </p>
                <div className="flex items-center md:justify-end gap-2 mt-4 text-[10px] font-black uppercase text-zinc-400">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Secured by {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 RIGHT: Intelligence (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* CUSTOMER INTELLIGENCE */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-8">02. Identity Profile</h3>
            <div className="flex items-center gap-5 mb-10">
              <div className="h-20 w-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-400 border border-zinc-200 dark:border-zinc-800 text-3xl shadow-inner overflow-hidden">
                {order.user?.avatar ? (
                  <img src={getImageUrl(order.user.avatar)} className="w-full h-full object-cover grayscale" />
                ) : customerName.charAt(0)}
              </div>
              <div>
                <p className="font-black text-2xl text-zinc-900 dark:text-white uppercase tracking-tighter italic">{customerName}</p>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${isRegistered ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                  {isRegistered ? 'Verified Member' : 'Guest Identity'}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail size={16} className="text-zinc-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Neural Address</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white break-all">{customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={16} className="text-zinc-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Contact Link</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{order.shippingAddress.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-zinc-400 mt-1" />
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Deployment Base</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white leading-relaxed uppercase">
                    {order.shippingAddress.street},<br/>
                    {order.shippingAddress.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT METADATA */}
          <div className="bg-zinc-50 dark:bg-zinc-900/20 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-inner">
             <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-6">03. Financial Metadata</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b dark:border-zinc-800">
                   <span className="text-[10px] font-black text-zinc-500 uppercase">Clearance Status</span>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${order.paymentResult?.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className={`text-[10px] font-black uppercase ${order.paymentResult?.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                         {order.paymentResult?.status || 'In Transit'}
                      </span>
                   </div>
                </div>
                {order.paymentResult?.transactionId && (
                  <div className="pt-2">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-2">Sequence ID</p>
                    <p className="font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-400 break-all bg-white dark:bg-black p-4 rounded-2xl border dark:border-white/5">
                      {order.paymentResult.transactionId}
                    </p>
                  </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}