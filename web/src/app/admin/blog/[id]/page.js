"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBlogs } from "@/hooks/useBlogs";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Loader from "@/components/common/Loader";
import { ShieldCheck, ArrowLeft, RefreshCcw, ImageIcon, Globe, Save, Trash2, Plus, Zap } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/**
 * 🛠️ EditBlog (Container Component)
 * Handles data fetching and lifecycle management.
 */
export default function EditBlog() {
  const { id } = useParams();
  const { blog, blogLoading, updateBlog } = useBlogs({}, true, id, true);

  if (blogLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-center py-20 dark:text-white font-black uppercase tracking-widest text-xs">
        Narrative sequence not found in archives.
      </div>
    );
  }

  // Force remount when blog ID changes or data arrives to ensure state sync
  return <BlogEditForm key={blog._id} blog={blog} updateBlog={updateBlog} />;
}

/**
 * 🏗️ BlogEditForm (Presenter Component)
 * Manages local form state initialized directly from blog data.
 */
function BlogEditForm({ blog, updateBlog }) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(getImageUrl(blog.featuredImage));
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: blog.title || "",
    content: blog.content || "",
    category: blog.category || "LIFESTYLE",
    status: blog.status || "PUBLISHED",
    isFeatured: blog.isFeatured || false,
    seo: {
      metaTitle: blog.seo?.metaTitle || "",
      metaDescription: blog.seo?.metaDescription || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) return;
    
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("status", formData.status);
    data.append("isFeatured", formData.isFeatured);
    data.append("seo", JSON.stringify(formData.seo));
    
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await updateBlog.mutateAsync({ id: blog._id, formData: data });
      router.push("/admin/blog");
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 px-4 sm:px-6">
      {/* 🚀 Tactical Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/40 p-6 sm:p-10 rounded-[2.5rem] border border-border/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="w-14 h-14 rounded-2xl border-border/10 bg-background/50 hover:bg-foreground hover:text-background transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge className="bg-rose-600/10 text-rose-500 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                Admin Node
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">/ Archive_Edit</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-gradient leading-none">
              Edit Sequence
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hidden sm:flex text-[10px] font-black uppercase tracking-widest hover:bg-rose-600/5 hover:text-rose-500"
          >
            Abort Sync
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim()}
            className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-rose-600 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-rose-600/20"
          >
            {isSubmitting ? <RefreshCcw className="animate-spin mr-3" size={16} /> : <Save className="mr-3" size={16} />}
            Push to Archive
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 📝 Narrative Workspace */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="rounded-[3rem] border border-border/5 bg-card/30 backdrop-blur-3xl shadow-2xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-10">
              {/* Title Input */}
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Narrative Title Sequence</Label>
                <Input
                  placeholder="ENTER TITULAR SEQUENCE..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-accent/30 border-none rounded-2xl h-14 text-sm font-black uppercase tracking-widest focus-visible:ring-rose-600 px-6 placeholder:text-muted-foreground/30"
                  required
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-4 min-h-[500px]">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Core Narrative Content</Label>
                <div className="rounded-[2.5rem] overflow-hidden border border-border/10 bg-background/30 focus-within:border-rose-600/50 transition-all">
                   <RichTextEditor
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    placeholder="Initialize narrative data stream..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 🛠️ Tactical Modules */}
        <div className="lg:col-span-4 space-y-10">
          {/* Visual Asset Module */}
          <Card className="rounded-[3rem] border border-border/5 bg-card/30 backdrop-blur-3xl shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <ImageIcon size={16} className="text-rose-500" /> Image Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-accent/20 border border-border/10 group/img">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/20 space-y-4">
                     <Plus size={40} strokeWidth={1} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Null_Asset</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    accept="image/*"
                  />
                  <Button variant="secondary" className="rounded-full px-6 text-[10px] font-black uppercase tracking-widest pointer-events-none">
                    Swap Identity
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between px-2">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Protocol Ratio</p>
                   <p className="text-[11px] font-bold uppercase">16:10 Wide</p>
                 </div>
                 <div className="w-px h-8 bg-border/10" />
                 <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Max Load</p>
                   <p className="text-[11px] font-bold uppercase">8 MB</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification Module */}
          <Card className="rounded-[3rem] border border-border/5 bg-card/30 backdrop-blur-3xl shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                <ShieldCheck size={16} className="text-rose-500" /> Core Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Classification</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-border/10 bg-background/50 text-[11px] font-black uppercase tracking-widest px-6 focus:ring-rose-600">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/10 bg-background/95 backdrop-blur-xl">
                    <SelectItem value="LIFESTYLE" className="text-[11px] font-bold uppercase tracking-widest">Lifestyle</SelectItem>
                    <SelectItem value="COLLECTION" className="text-[11px] font-bold uppercase tracking-widest">Collection</SelectItem>
                    <SelectItem value="TACTICAL" className="text-[11px] font-bold uppercase tracking-widest">Tactical</SelectItem>
                    <SelectItem value="FABRIC" className="text-[11px] font-bold uppercase tracking-widest">Fabric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archive Status</Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="PUBLISHED" id="published" className="peer sr-only" />
                    <Label
                      htmlFor="published"
                      className="flex items-center justify-center h-16 rounded-2xl border border-border/10 bg-background/50 peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background peer-data-[state=checked]:border-foreground transition-all cursor-pointer font-black uppercase tracking-widest text-[10px] shadow-sm hover:border-rose-600/30"
                    >
                      Live
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="DRAFT" id="draft" className="peer sr-only" />
                    <Label
                      htmlFor="draft"
                      className="flex items-center justify-center h-16 rounded-2xl border border-border/10 bg-background/50 peer-data-[state=checked]:bg-zinc-800 peer-data-[state=checked]:text-white peer-data-[state=checked]:border-zinc-800 transition-all cursor-pointer font-black uppercase tracking-widest text-[10px] shadow-sm hover:border-zinc-500/30"
                    >
                      Draft
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-4 border-t border-border/5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-600/5 border border-rose-600/10">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Zap size={12} className="text-rose-600" /> Promoted Sequence
                    </Label>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Prioritize in journal grid</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-6 w-11 rounded-full appearance-none bg-zinc-800 checked:bg-rose-600 relative transition-all cursor-pointer before:content-[''] before:absolute before:top-1 before:left-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:left-6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Neural SEO Module */}
          <Card className="rounded-[3rem] border-none bg-zinc-950 text-white shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12 group-hover:rotate-0 group-hover:scale-125">
               <Globe size={120} />
            </div>
            <CardHeader className="p-8 pb-4 relative z-10">
              <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-rose-500 flex items-center gap-3">
                <Globe size={16} /> Neural SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6 relative z-10">
              <div className="space-y-3">
                 <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Search Identifier</Label>
                 <Input
                  placeholder="META TITLE..."
                  value={formData.seo.metaTitle}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                  className="bg-white/5 border-white/10 rounded-2xl h-14 text-[11px] uppercase font-black tracking-[0.1em] focus-visible:ring-rose-600 px-6 placeholder:text-zinc-800"
                 />
              </div>
              <div className="space-y-3">
                 <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Archive Summary</Label>
                 <Textarea
                  placeholder="META DESCRIPTION SEQUENCE..."
                  rows={5}
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                  className="bg-white/5 border-white/10 rounded-[1.5rem] text-[11px] font-medium tracking-wide focus-visible:ring-rose-600 resize-none leading-relaxed p-6 placeholder:text-zinc-800"
                 />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
