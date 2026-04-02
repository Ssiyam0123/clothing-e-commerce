'use client';

import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import DataTable from '@/components/admin/DataTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import { getImageUrl } from '@/utils/imageUtils';
// 1. Swal Utilities Import
import { swalConfirm, swalToast, swalError } from '@/utils/swal';

export default function Users() {
  const { users, isLoading, deleteUser } = useUsers();

  // --- 2. ডিলিট লজিক উইথ Swal ---
  const handleDelete = async (id, role) => {
    // এডমিন প্রোটেকশন চেক (Optional but Senior Fix)
    if (role === 'admin') {
      return swalError('Action Revoked', 'Admin accounts cannot be terminated from this portal.');
    }

    const isConfirmed = await swalConfirm(
      'Terminate User?', 
      'This user will lose all access to the syndicate vault immediately.'
    );

    if (isConfirmed) {
      try {
        await deleteUser.mutateAsync(id);
        swalToast('Identity Purged', 'success');
      } catch (err) {
        swalError('Termination Failed', err.response?.data?.message || 'Protocol Error.');
      }
    }
  };

  const columns = [
    {
      label: 'User Identity',
      render: (item) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
            {item.avatar ? (
              <img
                src={getImageUrl(item.avatar)}
                alt={item.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 font-black text-lg uppercase">
                {item.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none mb-1 uppercase tracking-tight">{item.name}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Clearance Level',
      render: (item) => (
        <span className={`inline-flex items-center px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${
          item.role === 'admin' 
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-sm'
            : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
        }`}>
          {item.role === 'admin' ? '★ Vanguard Admin' : 'Syndicate Member'}
        </span>
      ),
    },
    { 
      label: 'Date Joined', 
      render: (item) => (
        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      ) 
    },
    {
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Link 
            href={`/admin/users/${item._id}`} 
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm" 
            title="Edit Identity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </Link>
          
          <button 
            onClick={() => handleDelete(item._id, item.role)} 
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-30" 
            title="Terminate User"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">User Directory</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Access & Role Management</p>
        </div>
        
        <div className="bg-zinc-50 dark:bg-[#111] px-6 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 shadow-inner">
          <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Total Records</span>
          {isLoading ? (
             <div className="w-8 h-6 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          ) : (
             <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">{users?.length || 0}</span>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="pt-4">
        {isLoading ? (
          <TableSkeleton rowCount={8} colCount={4} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DataTable columns={columns} data={users || []} />
          </div>
        )}
      </div>
      
    </div>
  );
}