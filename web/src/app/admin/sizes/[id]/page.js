"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSizes } from "@/hooks/useSizes";
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
import { ChevronLeft, Save, Maximize2 } from "lucide-react";
import { swalToast, swalError } from "@/utils/swal";

export default function SizeForm() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get("category");

  const isEdit = id !== "new";

  const { sizes, createSize, updateSize } = useSizes();
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
      if (isEdit && sizes) {
        const size = sizes.find((s) => s._id === id);
        if (size) {
          setValue("name", size.name);
          setValue("description", size.description || "");
          setValue("category", size.category?._id || size.category);
          setLoading(false);
        } else if (sizes) {
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
  }, [isEdit, id, sizes, categories, presetCategory, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateSize.mutateAsync({ id, ...data });
        swalToast("Size Template Updated", "success");
      } else {
        await createSize.mutateAsync(data);
        swalToast("Size Template Initialized", "success");
      }
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err) {
      swalError("Protocol Error", err.response?.data?.message || "Error syncing size data.");
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
              {isEdit ? "Refine Size" : "New Size Template"}
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">
              Taxonomy Configuration Protocol
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
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Department Mapping *
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

              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                  Size Tag *
                </Label>
                <Input
                  {...register("name", { required: true })}
                  className="h-14 bg-muted/30 border-border rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="e.g. XL, 32, or 42"
                />
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-2 ml-1">
                  Use standard alphanumeric notation.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-1">
                Internal Specification (Optional)
              </Label>
              <Textarea
                {...register("description")}
                rows={5}
                className="bg-muted/30 border-border rounded-3xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                placeholder="e.g. Extra large fit for oversized silhouettes..."
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
                    Syncing Architecture...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save size={16} />
                    {isEdit ? "Sync Template" : "Initialize Template"}
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
