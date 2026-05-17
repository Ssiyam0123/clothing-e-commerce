"use client";

import { useState } from "react";
import Link from "next/link";
import { useBlogs } from "@/modules/client/common/lib/useBlogs";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  BookOpen,
  Clock,
  BarChart3,
  LayoutGrid,
  List,
  ArrowRight,
  TrendingUp,
  FileText,
  Zap,
  EyeOff
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import { swalConfirm, swalToast } from "@/utils/swal";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { useFilters } from "@/modules/client/common/lib/useFilters";
import Pagination from "@/components/common/Pagination";

export default function AdminBlogDashboard() {
  const { search, setSearch, page, setPage, queryParams } = useFilters({ initialLimit: 30 });
  const { blogs, total, pages, isLoading, deleteBlog, toggleStatus, toggleFeatured } = useBlogs(queryParams, true);

  const filteredBlogs = blogs;

  const handleDelete = async (id) => {
    const confirmed = await swalConfirm(
      "Purge Narrative?",
      "This sequence will be permanently removed from the foundry archives.",
    );
    if (confirmed) {
      deleteBlog.mutate(id);
    }
  };

  if (isLoading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="admin-page-container">
      {/* 🚀 System Header */}
      <div className="admin-section-header">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[8px] md:text-[9px] uppercase tracking-widest border-rose-600/30 text-rose-600 bg-rose-600/5 px-3 py-1">Vanguard Core</Badge>
          </div>
          <h1 className="admin-title">
            Journal <span className="text-rose-600">Archives</span>
          </h1>
          <p className="admin-subtitle">
            Operational • Total Logs: {total}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-auto">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-600 transition-colors"
              size={16}
            />
            <Input
              type="text"
              placeholder="SEARCH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background/50 border-border/10 pl-12 pr-6 h-12 md:h-16 rounded-xl md:rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-full md:w-64 lg:w-80 focus-visible:ring-rose-600/20 focus:border-rose-600 transition-all shadow-inner"
            />
          </div>
          <Button
            asChild
            className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
          >
            <Link href="/admin/blog/create">
              <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Initialize Sequence
            </Link>
          </Button>
        </div>
      </div>

      {/* 📊 Intelligence Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<BookOpen size={20} />}
          label="Published Sequences"
          value={blogs?.filter((b) => b.status === "PUBLISHED").length}
          color="text-emerald-500"
          bg="bg-emerald-500/5"
        />
        <StatsCard
          icon={<Clock size={20} />}
          label="Draft Protocols"
          value={blogs?.filter((b) => b.status === "DRAFT").length}
          color="text-amber-500"
          bg="bg-amber-500/5"
        />
        <StatsCard
          icon={<BarChart3 size={20} />}
          label="Neural Reach (Views)"
          value={blogs?.reduce((acc, b) => acc + (b.viewCount || 0), 0)}
          color="text-indigo-500"
          bg="bg-indigo-500/5"
        />
        <StatsCard
          icon={<Filter size={20} />}
          label="Domain Clusters"
          value={new Set(blogs?.map((b) => b.category)).size}
          color="text-rose-500"
          bg="bg-rose-500/5"
        />
      </div>

      {/* 📁 Central Data Foundry */}
      <div className="admin-table-form">
        <div className="p-8 border-b border-border/10 bg-background/20">
           <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                 <FileText size={16} className="text-rose-600" /> Narrative Ledger
              </CardTitle>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest border-border/10">
                    <List size={14} className="mr-2" /> List
                 </Button>
                 <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest opacity-40">
                    <LayoutGrid size={14} className="mr-2" /> Grid
                 </Button>
              </div>
           </div>
        </div>
        <div className="admin-table-container border-none rounded-none">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/5">
                <TableHead className="w-[450px] pl-10 h-16 text-[10px] font-black uppercase tracking-widest">Sequence Identity</TableHead>
                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest">Classification</TableHead>
                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-center">Intelligence</TableHead>
                <TableHead className="h-16 pr-10 text-[10px] font-black uppercase tracking-widest text-right">Ops</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs?.length > 0 ? (
                filteredBlogs.map((post) => (
                  <TableRow key={post._id} className="group border-border/5 hover:bg-accent/5 transition-colors duration-500">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700">
                          <img
                            src={getImageUrl(post.featuredImage)}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black uppercase tracking-tight text-foreground leading-tight group-hover:text-rose-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            ID: {post._id.slice(-12).toUpperCase()} • {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-border/10 bg-background/50">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border-none shadow-sm ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-black">{post.viewCount || 0}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Views</span>
                       </div>
                    </TableCell>
                    <TableCell className="pr-10 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* ⚡ Toggle Featured */}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => toggleFeatured(post._id, post.isFeatured)}
                          className={cn(
                            "h-9 w-9 rounded-xl border-border/10 transition-all active:scale-95",
                            post.isFeatured 
                              ? "bg-rose-600/10 border-rose-600/30 text-rose-600 hover:bg-rose-600 hover:text-white" 
                              : "bg-background/50 hover:border-rose-600/50 hover:text-rose-600"
                          )}
                          title={post.isFeatured ? "Demote from Featured" : "Promote to Featured"}
                        >
                          <Zap size={14} fill={post.isFeatured ? "currentColor" : "none"} />
                        </Button>

                        {/* 👁️ Toggle Status */}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => toggleStatus(post._id, post.status)}
                          className={cn(
                            "h-9 w-9 rounded-xl border-border/10 transition-all active:scale-95",
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                              : "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white"
                          )}
                          title={post.status === "PUBLISHED" ? "Hide (Draft)" : "Show (Publish)"}
                        >
                          {post.status === "PUBLISHED" ? <Eye size={14} /> : <EyeOff size={14} />}
                        </Button>

                        <Separator orientation="vertical" className="h-6 mx-1 opacity-20" />

                        <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50 transition-all active:scale-95">
                          <Link href={`/admin/blog/${post._id}`}>
                            <Edit3 size={14} />
                          </Link>
                        </Button>

                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDelete(post._id)}
                          className="h-9 w-9 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50 transition-all active:scale-95"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                     <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                        <FileText size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero Narrative Sequences Detected</p>
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-border/10 bg-background/5">
           <Pagination 
             page={page} 
             totalPages={pages} 
             onPageChange={setPage} 
             className="py-0 sm:py-0 justify-between flex-row-reverse" 
           />
        </div>
      </div>
    </div>
  );
}

// 📊 Intelligence Card Sub-component
function StatsCard({ icon, label, value, color, bg }) {
  return (
    <Card className={`rounded-[2.5rem] border-border/5 bg-card/40 backdrop-blur-xl shadow-xl hover:shadow-rose-600/5 transition-all duration-500 overflow-hidden relative`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${bg} blur-3xl rounded-full`} />
      <CardHeader className="p-8">
        <div className="flex items-center gap-6">
          <div className={`p-5 rounded-2xl ${bg} ${color} shadow-sm`}>
            {icon}
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </p>
            <h4 className="text-3xl font-black tracking-tighter dark:text-white leading-none">
              {value}
            </h4>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
