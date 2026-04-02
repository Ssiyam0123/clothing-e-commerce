'use client';

import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import Loader from '@/components/common/Loader';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StatusBadge from '@/components/admin/StatusBadge';
import { useAppStore } from '@/store/appStore';

// Professional Palette: Subdued but distinct
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data, isLoading, error } = useAdminDashboard();
  const { theme } = useAppStore(); // Get current theme

  // Tooltip styles based on theme
  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#27272a' : '#e4e4e7'}`,
    borderRadius: '12px',
    padding: '8px 12px',
    color: theme === 'dark' ? '#fff' : '#000',
  };
  const tooltipLabelStyle = { fontSize: '10px', fontWeight: 'bold' };
  const tooltipItemStyle = { fontSize: '12px', fontWeight: 'bold' };

  if (isLoading) return <div className="p-20 flex justify-center"><Loader /></div>;
  if (error) return (
    <div className="p-20 text-center">
      <p className="text-rose-500 font-bold uppercase tracking-widest text-xs">Telemetry Link Failed</p>
      <p className="text-zinc-500 text-sm mt-2">Check system synchronization and try again.</p>
    </div>
  );

  const { revenue, inventory, categories, customers, recentOrders } = data;

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            Vanguard <span className="text-zinc-400 dark:text-zinc-600 font-light">OS</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.4em]">
              Real-time Business Intelligence Active
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm hidden md:block">
          <p className="text-[9px] font-black text-zinc-400 uppercase mb-1 tracking-widest text-right">Today's Revenue</p>
          <p className="text-2xl font-black text-emerald-500 tracking-tighter">
            + ৳ {revenue.today.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 2. KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI label="Gross Revenue" value={`৳ ${revenue.total.toLocaleString()}`} sub={`AOV:$${revenue.avgOrder.toFixed(2)}`} icon="💰" trend="+12.5%" />
        <KPI label="Total Customers" value={customers.total} sub={`+${customers.newThisMonth} month-to-date`} icon="👥" />
        <KPI label="Inventory Health" value={inventory.totalProducts} sub={`${inventory.outOfStock} SKUs out of stock`} icon="👕" />
        <KPI label="Active Shipments" value={recentOrders.length} sub="Pending carrier pickup" icon="🚀" />
      </div>

      {/* 3. Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Revenue Trajectory (Annual)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue.trend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'} />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#71717a'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#71717a'}} />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">Market Segmentation</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} stroke="none">
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {categories.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  {cat.name}
                </span>
                <span className="text-zinc-900 dark:text-zinc-200">{cat.count} Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity Table */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Operational Logs</h3>
            <Link href="/admin/orders" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest transition-colors">Order Registry →</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-black text-xs text-zinc-400 group-hover:text-indigo-500 transition-colors">
                    {order.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100">{order.user?.name || 'Guest Identity'}</p>
                    <p className="text-[9px] font-bold text-zinc-400 tracking-tighter uppercase">ID: {order._id.slice(-8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 mb-1">৳{order.totalPrice.toFixed(2)}</p>
                  <StatusBadge value={order.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Watchlist */}
        <div className="bg-zinc-900 dark:bg-black rounded-[2.5rem] p-8 text-white shadow-xl ring-1 ring-white/5">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8">Critical Stock Alerts</h3>
          <div className="space-y-6">
            {inventory.criticalItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-tight truncate">{item.name}</p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm ${item.status === 'OUT' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {item.status === 'OUT' ? 'Deficit' : 'Low Threshold'}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className={`text-2xl font-black leading-none ${item.status === 'OUT' ? 'text-rose-500' : 'text-zinc-100'}`}>
                    {item.stock}
                  </p>
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Units Remaining</p>
                </div>
              </div>
            ))}
            <Link href="/admin/products" className="block w-full text-center py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all shadow-lg shadow-white/5">
              Sync Inventory Vault
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const KPI = ({ label, value, sub, icon, trend }) => (
  <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
    {/* Decorative Watermark */}
    <div className="absolute -right-2 -top-2 text-6xl opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
      {icon}
    </div>
    
    <div className="relative z-10">
      <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{value}</p>
        {trend && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">{trend}</span>}
      </div>
      <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">{sub}</p>
    </div>
  </div>
);