"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Upload, Save, Trash2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { categories, createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(isEdit);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit && categories) {
      const category = categories.find((c) => c._id === id);
      if (category) {
        setValue("name", category.name);
        setValue("slug", category.slug);
        setValue("description", category.description || "");
        if (category.image) setImagePreview(getImageUrl(category.image));
        setLoading(false);
      } else if (categories) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isEdit, id, categories, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    if (data.imageFile && data.imageFile[0]) {
      formData.append("image", data.imageFile[0]);
    }

    try {
      if (isEdit) {
        await updateCategory.mutateAsync({ id, data: formData });
        swalToast("Category Updated", "success");
      } else {
        await createCategory.mutateAsync(formData);
        swalToast("Category Created", "success");
      }
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error processing request.";
      swalError("Action Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-10 space-y-10">
        <Skeleton className="h-32 w-full rounded-[2.5rem]" />
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <Card className="p-8 rounded-[2.5rem] border-border bg-card shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">
              {isEdit ? "Configuration" : "Initialize Category"}
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">
              Taxonomy Configuration Protocol
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground rounded-full h-12 px-6"
          >
            <ChevronLeft className="mr-2" size={16} /> Cancel & Return
          </Button>
        </div>
      </Card>

      {/* Main Form Card */}
      <Card className="rounded-[3rem] border-border bg-card shadow-2xl overflow-hidden">
        <CardContent className="p-10 md:p-14">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Category Name *
                </Label>
                <Input
                  {...register("name", { required: true })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Outerwear"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  URL Extension (Slug) *
                </Label>
                <Input
                  {...register("slug", { required: true, pattern: /^[a-z0-9-]+$/ })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. outerwear"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                Narrative Description
              </Label>
              <Textarea
                {...register("description")}
                rows={5}
                className="bg-muted/30 border-border rounded-3xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                placeholder="Describe the aesthetic and functional scope of this department..."
              />
            </div>

            <div className="space-y-6">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                Cover Visual Asset
              </Label>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="relative group">
                  <div className="h-64 border-2 border-dashed border-border bg-muted/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all group-hover:border-primary/50 group-hover:bg-muted/30 cursor-pointer overflow-hidden">
                    <Input
                      type="file"
                      accept="image/*"
                      {...register("imageFile")}
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-background/80 p-4 rounded-2xl shadow-xl transition-transform group-hover:scale-110">
                      <Upload className="text-muted-foreground" size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Select Archive</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="h-64 rounded-[2.5rem] bg-muted/20 border border-border overflow-hidden flex items-center justify-center relative shadow-inner">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                      alt="Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <ImageIcon size={48} />
                      <p className="text-[8px] font-black uppercase tracking-widest">No Asset Loaded</p>
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
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={16} />
                    {isEdit ? "Sync Architecture" : "Initialize Category"}
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/categories")}
                className="flex-1 h-14 rounded-full border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground font-black uppercase tracking-[0.2em] text-[10px] transition-all"
              >
                Discard Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
