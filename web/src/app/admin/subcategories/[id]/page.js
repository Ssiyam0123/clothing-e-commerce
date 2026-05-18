"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSubcategories } from "@/app/admin/subcategories/lib/useSubcategories";
import { useAdminCategories } from "@/app/admin/categories/lib/useAdminCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Save, Trash2, Layers, Upload, Image as ImageIcon } from "lucide-react";
import { swalToast, swalError } from "@/utils/swal";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";

export default function SubcategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get("category");

  const isEdit = id !== "new";

  const { subcategories, createSubcategory, updateSubcategory } = useSubcategories();
  const { categories, isLoading: categoriesLoading } = useAdminCategories();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: presetCategory || "",
      name: "",
      slug: "",
      description: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const selectedCategory = watch("category");

  useEffect(() => {
    if (isEdit && subcategories?.length > 0) {
      const sub = subcategories.find((s) => s._id === id);
      if (sub) {
        reset({
          name: sub.name,
          slug: sub.slug,
          category: sub.category?._id || sub.category,
          description: sub.description || ""
        });
        if (sub.image) setImagePreview(getImageUrl(sub.image));
        setLoading(false);
      }
    } else if (!isEdit) {
      // For new subcategories, just wait for categories to load if needed
      if (!categoriesLoading) {
        setLoading(false);
      }
    }
  }, [isEdit, id, subcategories, categoriesLoading, reset]);

  // Sync presetCategory if it changes or categories load
  useEffect(() => {
    if (!isEdit && presetCategory && !selectedCategory) {
      setValue("category", presetCategory);
    }
  }, [isEdit, presetCategory, selectedCategory, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("slug", data.slug.trim());
    formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (isEdit) {
        await updateSubcategory({ id, data: formData });
        swalToast("Subcategory updated", "success");
      } else {
        await createSubcategory(formData);
        swalToast("Subcategory created", "success");
      }
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err) {
      swalError("Sync Failed", err.response?.data?.message || "Error processing request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-10 space-y-10">
        <Skeleton className="h-32 w-full rounded-[2.5rem]" />
        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <Card className="p-8 rounded-[2.5rem] border-border bg-card shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">
              {isEdit ? "Edit Subcategory" : "Create Subcategory"}
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">
              Set up your subcategory details
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/categories")}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground rounded-full h-12 px-6"
          >
            <ChevronLeft className="mr-2" size={16} /> Cancel
          </Button>
        </div>
      </Card>

      {/* Main Form Card */}
      <Card className="rounded-[3rem] border-border bg-card shadow-2xl overflow-hidden">
        <CardContent className="p-10 md:p-14">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="md:col-span-1 space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Main Category *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => setValue("category", val)}
                >
                  <SelectTrigger className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-2xl">
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id} className="rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:block"></div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Subcategory Name *
                </Label>
                <Input
                  {...register("name", { required: true })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Graphic Tees"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Subcategory URL (Slug) *
                </Label>
                <Input
                  {...register("slug", { required: true, pattern: /^[a-z0-9-]+$/ })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="graphic-tees"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                Description
              </Label>
              <Textarea
                {...register("description")}
                rows={4}
                className="bg-muted/30 border-border rounded-3xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                placeholder="Enter subcategory description..."
              />
            </div>

            <div className="space-y-6 pt-10 border-t border-border/5">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Subcategory Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <label className="relative h-64 rounded-3xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden">
                  <Upload size={32} className="mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">Add Image</span>
                  <input
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleImageChange}
                  />
                </label>

                <div className="h-64 rounded-3xl bg-muted/20 border border-border/5 overflow-hidden flex items-center justify-center relative group">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-10">
                      <ImageIcon size={48} strokeWidth={1} />
                      <p className="text-[8px] font-black uppercase tracking-widest italic text-center">No image selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-border mt-10">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] h-14 bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={16} />
                    {isEdit ? "Update Subcategory" : "Create Subcategory"}
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/categories")}
                className="flex-1 h-14 rounded-full border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground font-black uppercase tracking-[0.2em] text-[10px] transition-all"
              >
                Discard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
