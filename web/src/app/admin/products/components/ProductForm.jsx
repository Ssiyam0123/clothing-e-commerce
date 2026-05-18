"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AdminPageHeader, { AdminBackLink } from "@/app/admin/_components/AdminPageHeader";
import { 
  Camera, 
  X, 
  Package, 
  Layers, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Settings,
  Globe,
  Plus,
  Trash2,
  HelpCircle
} from "lucide-react";

export default function ProductForm({
  register,
  handleSubmit,
  onSubmit,
  setValue,
  watch,
  control,
  isEdit,
  categories,
  filteredSubcategories,
  filteredSizes,
  imagePreviews,
  handleFileChange,
  removeLocalImage,
  isSubmitting,
  router,
}) {
  const watchedCategory = watch("category");
  const [faqsList, setFaqsList] = useState([]);

  useEffect(() => {
    const currentFaqs = watch("faqs") || [];
    setFaqsList(currentFaqs);
  }, [watch("faqs")]);

  const handleAddFaq = () => {
    const updated = [...faqsList, { question: "", answer: "" }];
    setFaqsList(updated);
    setValue("faqs", updated);
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqsList];
    updated[index][field] = value;
    setFaqsList(updated);
    setValue("faqs", updated);
  };

  const handleRemoveFaq = (index) => {
    const updated = faqsList.filter((_, i) => i !== index);
    setFaqsList(updated);
    setValue("faqs", updated);
  };

  return (
    <div className="admin-page-container max-w-6xl">
      <AdminBackLink href="/admin/products" label="Back to products" />
      <AdminPageHeader
        title={isEdit ? "Edit product" : "New product"}
        description="Manage product details and inventory"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Basic Information */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
              <Package size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 md:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Product Name *</Label>
              <Input 
                {...register("name", { required: true })}
                placeholder="e.g. Minimalist Vanguard Oversized Tee"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
              <input type="hidden" {...register("slug")} />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Description</Label>
              <Textarea 
                rows={4}
                {...register("description")}
                className="bg-muted/30 border-border/10 rounded-3xl px-6 py-5 font-medium focus:ring-2 focus:ring-indigo-600/20 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-border/5">
             <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select 
                      value={field.value || ""} 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("subcategory", "");
                      }}
                    >
                      <SelectTrigger className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl p-2">
                        {categories?.map((c) => (
                          <SelectItem key={c._id} value={c._id} className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
             </div>
             <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Subcategory</Label>
                <Controller
                  name="subcategory"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest">
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border rounded-2xl p-2">
                        {filteredSubcategories.map((s) => (
                          <SelectItem key={s._id} value={s._id} className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
             </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
              <Zap size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Pricing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Price (৳)</Label>
              <Input 
                type="number"
                {...register("price", { required: true, valueAsNumber: true })}
                className="h-24 bg-muted/30 border-border/10 rounded-3xl px-8 font-black text-4xl tracking-tighter"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Discount (%)</Label>
              <Input 
                type="number"
                {...register("discount", { valueAsNumber: true })}
                className="h-24 bg-emerald-600/5 border-emerald-600/10 rounded-3xl px-8 font-black text-4xl tracking-tighter text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
              <Camera size={20} className="text-amber-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Product Images</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {imagePreviews.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-border/10 group bg-muted/20 shadow-xl">
                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <button
                  type="button"
                  onClick={() => removeLocalImage(idx)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:scale-110 active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <label className="relative aspect-[3/4] rounded-3xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center cursor-pointer hover:border-amber-600/40 hover:bg-amber-600/5 transition-all group overflow-hidden">
                <Camera size={32} className="mb-3 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-amber-600">Add Image</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
              </label>
            )}
          </div>
        </div>

        {/* Sizes Stock */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
              <Layers size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Stock by Size</h3>
          </div>

          {!watchedCategory ? (
            <div className="bg-muted/20 p-20 rounded-[2.5rem] border border-dashed border-border/10 text-center flex flex-col items-center gap-4">
               <Package size={48} className="opacity-10" strokeWidth={1} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Please select a category first...</p>
            </div>
          ) : filteredSizes.length === 0 ? (
            <div className="bg-rose-500/5 p-20 rounded-[2.5rem] border border-dashed border-rose-500/10 text-center flex flex-col items-center gap-4">
               <ShieldAlert size={48} className="text-rose-500/20" strokeWidth={1} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500/50">No sizes found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
              {filteredSizes.map((size) => (
                <div key={size._id} className="bg-muted/20 border border-border/5 rounded-3xl p-6 transition-all hover:bg-muted/40 hover:border-indigo-600/20">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center mb-4">{size.name}</p>
                   <Input 
                      type="number"
                      min={0}
                      defaultValue={0}
                      {...register(`sizes.${size._id}`, { valueAsNumber: true })}
                      className="h-12 bg-background border-border/10 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-indigo-600/20"
                   />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO & Specifications */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
              <Globe size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">SEO & Specifications (AEO)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">SKU</Label>
              <Input 
                {...register("sku")}
                placeholder="e.g. VNG-TEE-BLK-L"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">GTIN / Barcode (EAN, UPC)</Label>
              <Input 
                {...register("gtin")}
                placeholder="e.g. 0123456789012"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Brand</Label>
              <Input 
                {...register("brand")}
                placeholder="e.g. Vanguard"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Material</Label>
              <Input 
                {...register("material")}
                placeholder="e.g. 100% Cotton"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Color</Label>
              <Input 
                {...register("color")}
                placeholder="e.g. Obsidian Black"
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Gender / Target Group</Label>
              <Controller
                name="gender"
                control={control}
                defaultValue="Unisex"
                render={({ field }) => (
                  <Select value={field.value || "Unisex"} onValueChange={field.onChange}>
                    <SelectTrigger className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-black uppercase tracking-widest">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-2xl p-2">
                      {['Men', 'Women', 'Unisex', 'Kids'].map((g) => (
                        <SelectItem key={g} value={g} className="rounded-xl py-3 font-black text-[10px] uppercase tracking-widest">
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border/5 space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">Technical Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Fit Type</Label>
                <Input 
                  {...register("specifications.fit")}
                  placeholder="e.g. Oversized"
                  className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Sleeve</Label>
                <Input 
                  {...register("specifications.sleeve")}
                  placeholder="e.g. Drop Shoulder"
                  className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Pattern</Label>
                <Input 
                  {...register("specifications.pattern")}
                  placeholder="e.g. Solid Color"
                  className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Collar</Label>
                <Input 
                  {...register("specifications.collar")}
                  placeholder="e.g. Crewneck"
                  className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/5 space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">Product FAQ Page Schema (AEO)</h4>
              <Button
                type="button"
                onClick={handleAddFaq}
                className="h-12 px-6 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-indigo-700 shadow-xl transition-all"
              >
                <Plus size={14} className="mr-2" /> Add FAQ Item
              </Button>
            </div>

            {faqsList.length === 0 ? (
              <div className="bg-muted/10 p-10 rounded-3xl border border-dashed border-border/10 text-center flex flex-col items-center gap-3">
                 <HelpCircle size={32} className="opacity-10" strokeWidth={1.5} />
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">No FAQs added yet. AI search engines will fallback to general FAQs.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {faqsList.map((faq, idx) => (
                  <div key={idx} className="bg-muted/10 border border-border/5 rounded-3xl p-6 md:p-8 space-y-6 relative group shadow-md hover:border-indigo-600/10 transition-all">
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-600/10 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Question {idx + 1}</Label>
                        <Input 
                          value={faq.question || ""}
                          onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                          placeholder="e.g. Is this fabric pre-shrunk?"
                          className="h-14 bg-background border-border/10 rounded-xl px-5 font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1">Answer {idx + 1}</Label>
                        <Textarea 
                          rows={2}
                          value={faq.answer || ""}
                          onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                          placeholder="e.g. Yes, all our shirts are pre-shrunk to ensure perfect fit even after multiple washes."
                          className="bg-background border-border/10 rounded-xl px-5 py-3 font-medium resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO / AEO Engine */}
        <div className="admin-table-form p-8 md:p-14 space-y-12 bg-card border border-border/80 dark:border-border/10 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
              <Globe size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">SEO / AEO Engine</h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-80">Optimize search engine snippet and AI-search engines visibility</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 md:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Meta Title</Label>
              <Input 
                {...register("seo.metaTitle")}
                placeholder="e.g. Minimalist Vanguard Oversized Tee | Premium Streetwear"
                className="h-16 bg-muted/30 dark:bg-muted/10 border border-border/60 dark:border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Meta Description</Label>
              <Textarea 
                rows={3}
                {...register("seo.metaDescription")}
                placeholder="e.g. Discover the Minimalist Vanguard Oversized Tee, designed with heavyweight premium cotton and a relaxed drop shoulder fit."
                className="bg-muted/30 dark:bg-muted/10 border border-border/60 dark:border-border/10 rounded-3xl px-6 py-5 font-medium focus:ring-2 focus:ring-indigo-600/20 resize-none"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">SEO Keywords (comma separated)</Label>
              <Input 
                {...register("seo.keywords")}
                placeholder="e.g. oversized tee, luxury streetwear, minimalist clothing, premium cotton shirt"
                className="h-16 bg-muted/30 dark:bg-muted/10 border border-border/60 dark:border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="admin-table-form p-8 md:p-14 space-y-12 bg-card border border-border/80 dark:border-border/10 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10">
              <Settings size={20} className="text-foreground" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Visibility & Settings</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Tags</Label>
               <Input 
                  {...register("tags")}
                  placeholder="limited, organic, industrial"
                  className="h-16 bg-muted/30 dark:bg-muted/10 border border-border/60 dark:border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
               />
            </div>
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6 items-center justify-end">
               {/* Active Toggle */}
               <div className="flex items-center gap-4 bg-muted/40 dark:bg-muted/20 p-6 rounded-3xl border border-border/60 dark:border-border/10 flex-1 w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-300">
                 <Checkbox 
                   id="isActive" 
                   checked={watch("isActive")} 
                   onCheckedChange={(val) => setValue("isActive", val)}
                   className="w-8 h-8 rounded-xl border border-slate-300 dark:border-border/40 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Active</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-80">Visible to customers</p>
                 </div>
               </div>

               {/* Featured Toggle */}
               <div className="flex items-center gap-4 bg-muted/40 dark:bg-muted/20 p-6 rounded-3xl border border-border/60 dark:border-border/10 flex-1 w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-300">
                 <Checkbox 
                   id="isFeatured" 
                   checked={watch("isFeatured")} 
                   onCheckedChange={(val) => setValue("isFeatured", val)}
                   className="w-8 h-8 rounded-xl border border-slate-300 dark:border-border/40 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Featured</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-80">Show on homepage</p>
                 </div>
               </div>

               {/* Show Ratings Toggle */}
               <div className="flex items-center gap-4 bg-muted/40 dark:bg-muted/20 p-6 rounded-3xl border border-border/60 dark:border-border/10 flex-1 w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-300">
                 <Checkbox 
                   id="showReviews" 
                   checked={watch("showReviews")} 
                   onCheckedChange={(val) => setValue("showReviews", val)}
                   className="w-8 h-8 rounded-xl border border-slate-300 dark:border-border/40 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Show Ratings</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-80">Show customer reviews</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border/60 dark:border-border/10">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-24 bg-foreground text-background hover:bg-indigo-600 hover:text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl transition-all active:scale-95 group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  {isEdit ? "Update Product" : "Create Product"}
                  <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
