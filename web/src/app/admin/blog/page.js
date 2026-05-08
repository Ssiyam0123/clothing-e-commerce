"use client";

import { useState } from "react";
import Link from "next/link";
import { useBlogs } from "@/hooks/useBlogs";
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
  FileText
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
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

export default function AdminBlogDashboard() {
  const { blogs, isLoading, deleteBlog } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");

  // 🕵️ Tactical Filter Logic
  const filteredBlogs = blogs?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    <div className="space-y-10 pb-20 px-4 sm:px-6">
      {/* 🚀 System Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-card/30 p-8 rounded-[2.5rem] border border-border/10 backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-rose-600/30 text-rose-600 bg-rose-600/5 px-3 py-1">Vanguard Core</Badge>
             <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-40">// ARCHIVE_MANAGEMENT_v1.0</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter dark:text-white italic leading-none">
            Journal <span className="text-rose-600">Archives</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
            <TrendingUp size={12} className="text-rose-600" /> System Status: Operational • Total Logs: {blogs?.length || 0}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-600 transition-colors"
              size={16}
            />
            <Input
              type="text"
              placeholder="SEARCH PROTOCOLS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50 border-border/10 pl-14 pr-6 h-16 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest w-full sm:w-80 focus-visible:ring-rose-600/20 focus:border-rose-600 transition-all shadow-inner"
            />
          </div>
          <Button
            asChild
            className="bg-foreground text-background hover:bg-rose-600 hover:text-white h-16 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group"
          >
            <Link href="/admin/blog/create">
              <Plus size={18} className="mr-3 transition-transform group-hover:rotate-90" /> Initialize Sequence
            </Link>
          </Button>
        </div>
      </header>

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
      <Card className="rounded-[2.5rem] border-border/10 bg-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-border/5">
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
        </CardHeader>
        <CardContent className="p-0">
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
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/10 hover:border-indigo-500/50 hover:text-indigo-500 bg-background/50">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye size={16} />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/10 hover:border-foreground/50 hover:bg-foreground hover:text-background bg-background/50">
                          <Link href={`/admin/blog/${post._id}`}>
                            <Edit3 size={16} />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDelete(post._id)}
                          className="h-10 w-10 rounded-xl border-border/10 hover:border-rose-600/50 hover:bg-rose-600 hover:text-white bg-background/50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="group-hover:hidden">
                         <MoreHorizontal className="ml-auto text-muted-foreground/30" size={20} />
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
        </CardContent>
      </Card>
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
