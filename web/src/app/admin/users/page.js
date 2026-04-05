'use client';

import { useState, useMemo } from 'react'; // 🚀 Added useState
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import DataTable from '@/components/admin/DataTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import { getImageUrl } from '@/utils/imageUtils';
import { swalConfirm, swalToast, swalError } from '@/utils/swal';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // 🚀 Added Icons

export default function Users() {
  const { users, isLoading, deleteUser } = useUsers();
  
  // 🛰️ Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // তুই চাইলে এটাকে স্টেট দিয়ে কন্ট্রোল করতে পারিস

  // --- ডিলিট লজিক (Existing) ---
  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      return swalError('Action Revoked', 'Admin accounts cannot be terminated.');
    }
    const isConfirmed = await swalConfirm('Terminate User?', 'This identity will be purged.');
    if (isConfirmed) {
      try {
        await deleteUser.mutateAsync(id);
        swalToast('Identity Purged', 'success');
      } catch (err) {
        swalError('Termination Failed', 'Protocol Error.');
      }
    }
  };

  // 🏛️ Pagination Logic: Slice the data
  const paginatedUsers = useMemo(() => {
    if (!users) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage]);

  const totalPages = Math.ceil((users?.length || 0) / itemsPerPage);

  const columns = [
    {
      label: 'User Identity',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
            {item.avatar ? (
              <img src={getImageUrl(item.avatar)} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 font-black text-xs uppercase">
                {item.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 leading-none mb-1 uppercase tracking-tight">{item.name}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Clearance Level',
      render: (item) => (
        <span className={`inline-flex items-center px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-full border ${
          item.role === 'admin' 
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
        }`}>
          {item.role === 'admin' ? '★ Vanguard Admin' : 'Syndicate Member'}
        </span>
      ),
    },
    { 
      label: 'Joined', 
      render: (item) => (
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ) 
    },
    {
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Link href={`/admin/users/${item._id}`} className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-indigo-500 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </Link>
          <button onClick={() => handleDelete(item._id, item.role)} className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
      
      {/* Header (Premium Card Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-1">User Directory</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Foundry Personnel Management</p>
        </div>
        
        <div className="bg-zinc-50 dark:bg-zinc-900/50 px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 shadow-inner">
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Live Records</span>
          {isLoading ? (
             <div className="w-8 h-6 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          ) : (
             <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{users?.length || 0}</span>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="space-y-8">
        {isLoading ? (
          <TableSkeleton rowCount={8} colCount={4} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DataTable columns={columns} data={paginatedUsers} />
          </div>
        )}

        {/* 🚀 Pagination Component */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 px-2">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
              Sector {currentPage} <span className="mx-2">/</span> {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl disabled:opacity-20 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-transparent dark:border-white/5 shadow-sm"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {[...Array(totalPages)].map((_, i) => {
                   const pageNum = i + 1;
                   // Show logic: first, last, and current neighbours
                   if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                     return (
                       <button
                         key={pageNum}
                         onClick={() => setCurrentPage(pageNum)}
                         className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                           currentPage === pageNum 
                             ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 scale-110' 
                             : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                         }`}
                       >
                         {pageNum < 10 ? `0${pageNum}` : pageNum}
                       </button>
                     );
                   }
                   if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                     return <span key={pageNum} className="text-zinc-300 dark:text-zinc-800 text-[10px] px-1 font-black">••</span>;
                   }
                   return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl disabled:opacity-20 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all border border-transparent dark:border-white/5 shadow-sm"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}