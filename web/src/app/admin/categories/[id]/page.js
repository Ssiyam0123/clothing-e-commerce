"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAdminCategories, useAdminCategory } from "@/app/admin/categories/lib/useAdminCategories";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminPageHeader, { AdminBackLink } from "@/app/admin/_components/AdminPageHeader";
import { Upload, Save, Trash2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";

export default function CategoryFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { createCategory, updateCategory } = useAdminCategories();
  const { category, isLoading: isCategoryLoading } = useAdminCategory(id);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit && category) {
      setValue("name", category.name);
      setValue("slug", category.slug);
      setValue("description", category.description || "");
      if (category.image) setImagePreview(getImageUrl(category.image));
    }
  }, [isEdit, category, setValue]);

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
    if (data.description) formData.append("description", data.description);
    
    // Explicitly append the selected file
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (isEdit) {
        await updateCategory({ id, data: formData });
        swalToast("Category updated", "success");
      } else {
        await createCategory(formData);
        swalToast("Category created", "success");
      }
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err) {
      swalError("Action Failed", err.response?.data?.message || "Sync error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isCategoryLoading)
    return (
      <div className="admin-page-container flex items-center justify-center min-h-[40vh]">
        <Loader />
      </div>
    );

  return (
    <div className="admin-page-container max-w-4xl">
      <AdminBackLink href="/admin/categories" label="Back to categories" />
      <AdminPageHeader
        title={isEdit ? "Edit category" : "New category"}
        description="Set up category details and appearance"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Category Name *</Label>
              <Input 
                {...register("name", { required: true })}
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. OUTERWEAR"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Category URL (Slug) *</Label>
              <Input 
                {...register("slug", { required: true, pattern: /^[a-z0-9-]+$/ })}
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-primary/20 transition-all text-primary"
                placeholder="e.g. outerwear"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Description</Label>
              <Textarea 
                {...register("description")}
                rows={4}
                className="bg-muted/30 border-border/10 rounded-3xl px-6 py-5 font-medium focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Enter category description..."
              />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-border/5">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Category Image</Label>
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
                    <p className="text-[8px] font-black uppercase tracking-widest italic">No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-24 bg-foreground text-background hover:bg-primary hover:text-white rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl transition-all active:scale-95 group"
        >
          {isSubmitting ? "Saving..." : (isEdit ? "Update Category" : "Create Category")}
          <ArrowRight size={20} className="ml-4 group-hover:translate-x-2 transition-transform" />
        </Button>
      </form>
    </div>
  );
}



