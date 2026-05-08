"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogs } from "@/hooks/useBlogs";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  ShieldCheck,
  ArrowLeft,
  Globe,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Zap
} from "lucide-react";
import { swalError, swalToast } from "@/utils/swal";

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

export default function CreateBlog() {
  const router = useRouter();
  const { createBlog } = useBlogs();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "LIFESTYLE",
    status: "PUBLISHED",
    seo: { metaTitle: "", metaDescription: "" },
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

    if (!imageFile) {
      return swalError("Visual Missing", "Please select a featured image.");
    }
    if (!formData.title.trim()) {
      return swalError("Missing Title", "The narrative needs a title.");
    }
    if (!formData.content.trim()) {
      return swalError(
        "Empty Content",
        "Please write something before publishing.",
      );
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("status", formData.status);
    data.append("seo", JSON.stringify(formData.seo));
    data.append("image", imageFile);

    try {
      await createBlog.mutateAsync(data);
      swalToast("Narrative deployed successfully!", "success");
      router.push("/admin/blog");
    } catch (err) {
      const message =
        err.response?.data?.message || "Deployment failed. Check your inputs.";
      swalError("Publication Failed", message);
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
            className="rounded-2xl h-14 w-14 hover:scale-110 transition-all border-border/20 bg-background/50"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Badge className="text-[9px] font-black uppercase tracking-widest bg-rose-600/10 text-rose-600 border-none px-3 py-1">Admin Node</Badge>
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ INITIALIZE_SEQUENCE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">
              New <span className="text-rose-600">Narrative</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
           <Button
            variant="ghost"
            onClick={() => router.push("/admin/blog")}
            className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] hover:bg-rose-600/10 hover:text-rose-600"
           >
            Abort
           </Button>
           <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-2xl h-14 px-12 bg-foreground text-background hover:bg-rose-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-foreground/10 group/btn"
           >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-3" size={16} />
            ) : (
              <Zap className="mr-3 transition-transform group-hover/btn:scale-125" size={16} />
            )}
            Authorize Sequence
           </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* 📝 Main Editor Workspace */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[3rem] border-border/10 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
            <CardHeader className="p-8 sm:p-12 pb-6">
              <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-6 block">Sequence Identifier</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="ENTER TITULAR SEQUENCE..."
                className="border-none bg-transparent text-4xl sm:text-6xl font-black uppercase tracking-tighter p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/10 italic leading-none transition-all"
              />
            </CardHeader>
            <CardContent className="p-0 border-t border-border/5">
              <div className="min-h-[650px] bg-background/30 quill-modern-container">
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ⚙️ Tactical Side Panels */}
        <div className="lg:col-span-4 space-y-8">
          {/* Visual Asset Panel */}
          <Card className="rounded-[3rem] border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <ImageIcon size={14} className="text-rose-600" /> Visual Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="relative group aspect-[16/10] rounded-[2rem] overflow-hidden bg-accent/20 border-2 border-dashed border-border/30 hover:border-rose-600/50 transition-all cursor-pointer shadow-inner">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-40">
                    <ImageIcon size={40} className="text-muted-foreground mb-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inject Visual Artifact</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                   <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Plus size={24} className="text-white mx-auto mb-2" />
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">Set Identity</p>
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-accent/10 rounded-2xl border border-border/5">
                 <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Protocol Ratio</p>
                    <p className="text-[10px] font-black uppercase tracking-widest">16:10 Wide</p>
                 </div>
                 <Separator orientation="vertical" className="h-6" />
                 <div className="space-y-0.5 text-right">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Max Load</p>
                    <p className="text-[10px] font-black uppercase tracking-widest">8 MB</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Classification Panel */}
          <Card className="rounded-[3rem] border-border/10 bg-card/40 backdrop-blur-2xl shadow-xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-3">
                 <Save size={14} className="text-rose-600" /> Sequence Meta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Classification</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="h-16 rounded-2xl bg-background/50 border-border/10 font-black uppercase tracking-widest text-[10px] px-6 focus:ring-rose-600/20">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/10 bg-card/90 backdrop-blur-xl">
                    {["LIFESTYLE", "COLLECTION", "FABRIC", "CULTURE", "NEWS"].map((c) => (
                      <SelectItem key={c} value={c} className="font-black uppercase tracking-widest text-[10px] py-4 focus:bg-rose-600 focus:text-white transition-colors">{c}</SelectItem>
                    ))}
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
