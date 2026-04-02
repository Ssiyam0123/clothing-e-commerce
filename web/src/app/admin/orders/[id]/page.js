'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { swalConfirm, swalToast, swalError } from '@/utils/swal';
import Loader from '@/components/common/Loader';
import { getImageUrl } from '@/utils/imageUtils';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // orderId পাস করা হয়েছে যাতে নির্দিষ্ট অর্ডারের ডেটা আসে
  const { orderDetails: order, orderDetailsLoading, updateStatus, syncToPathao } = useOrders({}, id);
  const [syncing, setSyncing] = useState(false);

  // অর্ডারের স্ট্যাটাস আপডেট করার হ্যান্ডলার
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

  // Pathao Courier এ সিঙ্ক করার হ্যান্ডলার
  const handlePathaoSync = async () => {
    const confirmed = await swalConfirm('Sync to Pathao?', 'This will create a live consignment in Pathao Courier system.');
    if (confirmed) {
      try {
        setSyncing(true);
        await syncToPathao(order._id);
        swalToast('Order successfully synced with Pathao!');
      } catch (err) {
        swalError('Sync Failed', err.response?.data?.message || 'Check if Pathao IDs are missing in address.');
      } finally {
        setSyncing(false);
      }
    }
  };

  if (orderDetailsLoading) return <div className="p-20"><Loader /></div>;
  if (!order) return <div className="p-20 text-center uppercase font-black text-zinc-400">Order not found</div>;

  const statusColors = {
    'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Cancelled': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    'Pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Processing': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    'Shipped': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <Link href="/admin/orders" className="text-[9px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase tracking-[0.3em] mb-2 block transition-colors">← Back to Archives</Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Order #{order._id.slice(-8)}</h1>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.orderStatus] || 'bg-zinc-100'}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {/* Status Switcher */}
          <select 
            value={order.orderStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          {/* Pathao Sync Button */}
          {order.pathaoConsignmentId ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-6 py-3 rounded-full flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest">Synced: {order.pathaoConsignmentId}</span>
            </div>
          ) : (
            <button 
              onClick={handlePathaoSync}
              disabled={syncing || order.orderStatus === 'Cancelled' || order.orderStatus === 'Delivered'}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-xl"
            >
              {syncing ? 'Connecting...' : '🚀 Sync to Pathao'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- LEFT: Manifest & Financials --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Manifest Items */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-10 shadow-sm">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Manifest Items</h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {order.orderItems.map((item, i) => (
                <div key={i} className="py-6 flex items-center gap-6 group">
                  <div className="h-24 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <img src={getImageUrl(item.image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-lg">{item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Unit Price: ৳{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-400 uppercase">Qty</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white">{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ledger */}
            <div className="mt-10 pt-10 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
                <span>Subtotal</span>
                <span className="text-zinc-900 dark:text-zinc-100">৳{order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
                <span>Shipping Fee</span>
                <span className="text-zinc-900 dark:text-zinc-100">৳{order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-zinc-50 dark:border-zinc-900">
                 <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Settlement</p>
                    <p className="font-bold text-zinc-900 dark:text-white uppercase">{order.paymentMethod}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Processed</p>
                    <p className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">৳{order.totalPrice.toFixed(2)}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Customer & Logistics --- */}
        <div className="space-y-8">
          {/* Customer Profile */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">Customer Profile</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-400 border border-zinc-200 dark:border-zinc-800 text-xl">
                {order.user?.avatar ? (
                  <img src={getImageUrl(order.user.avatar)} className="w-full h-full rounded-full object-cover grayscale" />
                ) : order.user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">{order.user?.name || 'Guest'}</p>
                <p className="text-[10px] font-bold text-zinc-500 break-all">{order.user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-6 pt-6 border-t border-zinc-50 dark:border-zinc-900">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Phone Contact</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{order.shippingAddress.phone}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Shipping Destination</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-relaxed uppercase">
                  {order.shippingAddress.street},<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Metadata */}
          <div className="bg-zinc-50 dark:bg-[#0d0d0d] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-inner">
             <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">Payment Metadata</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-zinc-500 uppercase">Status</span>
                   <span className={`text-[10px] font-black uppercase ${order.paymentResult?.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {order.paymentResult?.status || 'Pending'}
                   </span>
                </div>
                {order.paymentResult?.transactionId && (
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Transaction ID</p>
                    <p className="font-mono text-[10px] font-bold text-zinc-900 dark:text-white break-all">{order.paymentResult.transactionId}</p>
                  </div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}