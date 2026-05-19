"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import { ArrowLeft, Globe, ImageIcon, Loader2, Plus, Save, Zap } from "lucide-react";
import { swalError } from "@/utils/swal";
import { getImageUrl } from "@/utils/imageUtils";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function BlogForm({ blog = null, onSubmit, isSubmitting, mode = "create" }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [imagePreview, setImagePreview] = useState(
    isEdit && blog ? getImageUrl(blog.featuredImage) : null
  );
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    category: blog?.category || "LIFESTYLE",
    status: blog?.status || "PUBLISHED",
    isFeatured: blog?.isFeatured || false,
    seo: {
      metaTitle: blog?.seo?.metaTitle || "",
      metaDescription: blog?.seo?.metaDescription || "",
      keywords: blog?.seo?.keywords?.join(", ") || "",
    },
  });

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isEdit && !imageFile && !imagePreview) {
      return swalError("Visual Missing", "Please select a featured image.");
    }
    if (!formData.title.trim()) {
      return swalError("Missing Title", "Please provide a title.");
    }
    if (!formData.content.trim()) {
      return swalError("Empty Content", "Please write some content before publishing.");
    }

    const seoData = {
      metaTitle: formData.seo.metaTitle,
      metaDescription: formData.seo.metaDescription,
      keywords: formData.seo.keywords ? formData.seo.keywords.split(",").map(k => k.trim()).filter(Boolean) : []
    };

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("status", formData.status);
    data.append("isFeatured", formData.isFeatured);
    data.append("seo", JSON.stringify(seoData));
    if (imageFile) data.append("image", imageFile);

    onSubmit(data);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl h-12 w-12"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Blog Studio</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">{isEdit ? "Edit Post" : "Create Post"}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="font-black">
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            {isEdit ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card/50 rounded-2xl p-6 border border-border/10 shadow">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Write a compelling title..."
              className="text-2xl sm:text-3xl font-extrabold border-none bg-transparent p-0"
            />
          </div>

          <div className="bg-card/50 rounded-2xl p-0 border border-border/10 shadow overflow-hidden">
            <div className="p-6 border-b border-border/5 bg-background/5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Content</Label>
            </div>
            <div className="p-6 min-h-[520px] bg-background/30 quill-modern-container">
              <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-2xl border-border/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Featured Image</Label>
                <div className="text-[11px] text-muted-foreground">Recommended 1200x800px</div>
              </div>
              <div className="text-[12px] font-bold text-muted-foreground">{imagePreview ? 'Preview' : 'Empty'}</div>
            </div>

            <div className="relative mb-4">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-accent/10 border border-border/10 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 opacity-60">
                    <ImageIcon size={48} className="mx-auto mb-2" />
                    <div className="text-sm font-black uppercase tracking-wide text-muted-foreground">Drop or select image</div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">Change</Button>
              <Button variant="ghost" onClick={() => { setImageFile(null); setImagePreview(null); }} className="flex-1">Remove</Button>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-border/10 shadow-sm">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => setFormData({ ...formData, category: val })}
            >
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {['LIFESTYLE','COLLECTION','FABRIC','CULTURE','NEWS'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Status</Label>
              <RadioGroup value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })} className="grid grid-cols-2 gap-2">
                <Label className={`p-3 rounded-lg text-center ${formData.status === 'PUBLISHED' ? 'bg-foreground text-background' : 'bg-background/50'}`}>Live</Label>
                <Label className={`p-3 rounded-lg text-center ${formData.status === 'DRAFT' ? 'bg-foreground text-background' : 'bg-background/50'}`}>Draft</Label>
              </RadioGroup>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Promote</Label>
                <div className="text-[11px] text-muted-foreground">Feature this post on homepage</div>
              </div>
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-5 w-10 rounded-full" />
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-border/10 shadow-sm bg-zinc-950 text-white">
            <Label className="text-xs font-black uppercase tracking-widest mb-2 text-zinc-400">SEO Suite</Label>
            <Input
              placeholder="Meta title (Ideal: 50-60 chars)"
              value={formData.seo.metaTitle}
              onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
              className="mb-3 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
            <Textarea
              placeholder="Meta description (Ideal: 150-160 chars)"
              rows={3}
              value={formData.seo.metaDescription}
              onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
              className="mb-3 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
            <Input
              placeholder="Keywords (comma separated, e.g. denim, fashion)"
              value={formData.seo.keywords}
              onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
          </Card>
        </aside>
      </form>
    </div>
  );
}
