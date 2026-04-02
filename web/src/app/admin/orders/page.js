'use client';

import { useState, useCallback, Suspense, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useFilters } from '@/hooks/useFilters'; 
import DataTable from '@/components/admin/DataTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import FilterBar from '@/components/common/FilterBar';
import Pagination from '@/components/common/Pagination';
import Loader from '@/components/common/Loader';
import Link from 'next/link';

function AdminOrdersContent() {
  // ১. ফিল্টার স্টেট (Backend এর status, search, page সব হ্যান্ডেল করবে)
  const { search, setSearch, sort, setSort, page, setPage, queryParams } = useFilters({ 
    initialLimit: 10,
    initialSort: '-createdAt' 
  });
  
  // স্ট্যাটাস ফিল্টারের জন্য আলাদা স্টেট (Backend supports: Pending, Processing, Shipped, Delivered, Cancelled)
  const [status, setStatus] = useState('all');

  // ২. ফাইনাল কুয়েরি প্যারামস (Status সহ)
  const finalQueryParams = useMemo(() => ({
    ...queryParams,
    status: status !== 'all' ? status : undefined
  }), [queryParams, status]);

  // ৩. ডাটা ফেচিং
  const { allOrdersData, allOrdersLoading, isAllFetching } = useOrders(finalQueryParams);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    setPage(1); 
  }, [setSearch, setPage]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1); // ফিল্টার চেঞ্জ করলে ১ নম্বর পেজে ব্যাক করবে
  };

  const columns = [
    { 
      label: 'Order ID', 
      render: (item) => (
        <Link href={`/admin/orders/${item._id}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:scale-105 transition-all inline-block">
          #{item?._id?.slice(-8)}
        </Link>
      ) 
    },
    { 
      label: 'Customer', 
      render: (item) => (
        <div>
          <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-tight">{item?.user?.name || 'Guest'}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold tracking-widest mt-1">{item?.shippingAddress?.phone}</p>
        </div>
      ) 
    },
    { 
      label: 'Date', 
      render: (item) => <span className="text-[11px] font-bold text-zinc-500 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
    },
    { 
      label: 'Total', 
      render: (item) => <span className="text-base font-black text-zinc-900 dark:text-white tracking-tighter">৳{item?.totalPrice?.toLocaleString()}</span> 
    },
    {
      label: 'Status',
      render: (item) => {
        const colors = {
          'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          'Pending': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          'Cancelled': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
          'Shipped': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          'Processing': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
        };
        return (
          <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${colors[item.orderStatus] || 'bg-zinc-100'}`}>
            {item.orderStatus}
          </span>
        );
      }
    },
    {
      label: 'Action',
      render: (item) => (
        <Link href={`/admin/orders/${item._id}`} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all inline-block">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto px-4">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Orders Archive</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Logistics & Dispatch Management</p>
        </div>
        <div className="bg-zinc-50 dark:bg-[#111] px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Total Orders</span>
          <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
            {allOrdersData?.total || 0}
          </span>
        </div>
      </div>

      {/* 2. Status Tabs Filter */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar">
        {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              status === s 
              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black' 
              : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 3. Search & Sort Bar */}
      <FilterBar 
        search={search} 
        onSearchSubmit={handleSearch} 
        onSearchChange={handleSearch}
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          {label: 'Newest First', value: '-createdAt'}, 
          {label: 'Oldest First', value: 'createdAt'},
          {label: 'Price: High', value: '-totalPrice'},
          {label: 'Price: Low', value: 'totalPrice'}
        ]}
        searchPlaceholder="Order ID, Customer Name or Phone..." 
      />

      {/* 4. Table & Pagination Section */}
      <div className="relative">
        {allOrdersLoading ? (
          <TableSkeleton rowCount={10} colCount={6} />
        ) : (
          <div className={`transition-opacity duration-300 ${isAllFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <DataTable columns={columns} data={allOrdersData?.orders || []} />
            
            {/* Reusable Pagination */}
            {allOrdersData?.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination 
                  page={allOrdersData?.page} 
                  totalPages={allOrdersData?.pages} 
                  onPageChange={setPage} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrders() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}