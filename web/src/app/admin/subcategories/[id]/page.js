"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useCategories } from "@/hooks/useCategories";
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
import { ChevronLeft, Save, Trash2, Layers } from "lucide-react";
import { swalToast, swalError } from "@/utils/swal";

export default function SubcategoryForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get("category");

  const isEdit = id !== "new";

  const { subcategories, createSubcategory, updateSubcategory } = useSubcategories();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedCategory = watch("category");

  useEffect(() => {
    const initialize = async () => {
      if (isEdit && subcategories) {
        const sub = subcategories.find((s) => s._id === id);
        if (sub) {
          setValue("name", sub.name);
          setValue("slug", sub.slug);
          setValue("category", sub.category?._id || sub.category);
          setValue("description", sub.description || "");
          setLoading(false);
        } else if (subcategories) {
          setLoading(false);
        }
      } else {
        if (presetCategory && categories && categories.length > 0) {
          setValue("category", presetCategory);
        }
        setLoading(false);
      }
    };

    initialize();
  }, [isEdit, id, subcategories, categories, presetCategory, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateSubcategory.mutateAsync({ id, data });
        swalToast("Architecture Synchronized", "success");
      } else {
        await createSubcategory.mutateAsync(data);
        swalToast("Sub-category Initialized", "success");
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
              {isEdit ? "Refine Sub-Category" : "New Sub-Category"}
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">
              Architecture Configuration Protocol
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/categories")}
            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground rounded-full h-12 px-6"
          >
            <ChevronLeft className="mr-2" size={16} /> Abort & Return
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
                  Parent Department *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => setValue("category", val)}
                >
                  <SelectTrigger className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Assign to Department" />
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
                  Sub-category Name *
                </Label>
                <Input
                  {...register("name", { required: true })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. Graphic Tees"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  URL Extension (Slug) *
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
                Internal Narrative
              </Label>
              <Textarea
                {...register("description")}
                rows={5}
                className="bg-muted/30 border-border rounded-3xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                placeholder="Describe the aesthetic scope of this sub-category..."
              />
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
                    Processing Protocol...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={16} />
                    {isEdit ? "Update Architecture" : "Initialize Protocol"}
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
