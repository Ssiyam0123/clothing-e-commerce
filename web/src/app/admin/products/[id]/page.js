"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useSizes } from "@/hooks/useSizes";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
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
import { 
  ChevronLeft, 
  Camera, 
  X, 
  Package, 
  Layers, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Settings 
} from "lucide-react";

export default function ProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { products, createProduct, updateProduct } = useAdminProducts();
  const { categories, isLoading: categoriesLoading } = useAdminCategories();
  const { subcategories } = useSubcategories();
  const { sizes } = useSizes();

  const [loading, setLoading] = useState(isEdit);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();
  
  const watchedCategory = watch("category");
  const watchedName = watch("name");

  // Auto-generate URL slug
  useEffect(() => {
    if (watchedName && !isEdit) {
      const generatedSlug = watchedName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
        .replace(/^-+|-+$/g, ""); // Trim dashes
      setValue("slug", generatedSlug);
    }
  }, [watchedName, setValue, isEdit]);

  const filteredSizes = useMemo(() => {
    if (!watchedCategory || !sizes) return [];
    return sizes.filter(
      (size) =>
        size.category?._id === watchedCategory ||
        size.category === watchedCategory,
    );
  }, [watchedCategory, sizes]);

  const filteredSubcategories = useMemo(() => {
    if (!watchedCategory || !subcategories) return [];
    return subcategories.filter(
      (s) => (s.category?._id || s.category) === watchedCategory
    );
  }, [watchedCategory, subcategories]);

  useEffect(() => {
    if (isEdit && products && products.length > 0 && loading) {
      setLoading(false);
      const product = products.find((p) => p._id === id);
      if (product) {
        setValue("name", product.name);
        setValue("slug", product.slug);
        setValue("description", product.description || "");
        setValue("price", product.price);
        setValue("discount", product.discount || 0);
        setValue("category", product.category._id);
        setValue("subcategory", product.subcategory?._id || "");
        setValue("tags", product.tags?.join(", ") || "");
        setValue("isActive", product.isActive);
        setValue("isFeatured", product.isFeatured || false);
        setValue("showReviews", product.showReviews !== false);

        setExistingImages(product.images || []);
        setImagePreviews(product.images?.map((img) => getImageUrl(img)) || []);
        setSelectedFiles([]); 

        const sizesObj = {};
        product.sizes?.forEach((item) => {
          const sizeId = item.size._id || item.size;
          sizesObj[sizeId] = item.stock;
        });
        setValue("sizes", sizesObj);
      } else if (products) setLoading(false);
    } else if (!isEdit) {
      setLoading(false);
    }
  }, [isEdit, id, products, setValue, loading]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + selectedFiles.length + files.length;
    if (totalImages > 5) {
      return swalError(
        "Too Many Images",
        "You can only upload up to 5 images.",
      );
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeLocalImage = (index) => {
    const isExisting = index < existingImages.length;
    if (isExisting) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
    } else {
      const newFiles = [...selectedFiles];
      const fileIndex = index - existingImages.length;
      newFiles.splice(fileIndex, 1);
      setSelectedFiles(newFiles);
    }
    const newPreviews = [...imagePreviews];
    if (newPreviews[index].startsWith("blob:"))
      URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append("slug", data.slug.trim());
    if (data.description) formData.append("description", data.description);
    formData.append("price", Number(data.price));
    if (data.discount) formData.append("discount", Number(data.discount));
    formData.append("category", data.category);
    if (data.subcategory) formData.append("subcategory", data.subcategory);

    if (data.tags) {
      const tagsArray = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      formData.append("tags", JSON.stringify(tagsArray));
    }

    formData.append(
      "isActive",
      data.isActive === true || data.isActive === "on",
    );
    formData.append(
      "isFeatured",
      data.isFeatured === true || data.isFeatured === "on",
    );
    formData.append(
      "showReviews",
      data.showReviews === true || data.showReviews === "on",
    );

    if (data.sizes && typeof data.sizes === "object") {
      const sizesArray = [];
      for (const [sizeId, stock] of Object.entries(data.sizes)) {
        if (
          stock !== undefined &&
          stock !== "" &&
          filteredSizes.some((s) => s._id === sizeId)
        ) {
          sizesArray.push({ size: sizeId, stock: parseInt(stock) || 0 });
        }
      }
      if (sizesArray.length > 0) {
        formData.append("sizes", JSON.stringify(sizesArray));
      }
    }

    if (isEdit && existingImages.length > 0) {
      formData.append("images", JSON.stringify(existingImages));
    }

    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (isEdit) {
        await updateProduct({ id, data: formData });
        swalToast("Product updated", "success");
      } else {
        await createProduct(formData);
        swalToast("Product created", "success");
      }
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err) {
      swalError("Error", err.response?.data?.message || "Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="admin-page-container flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );

  return (
    <div className="admin-page-container max-w-6xl">
      {/* 🔙 Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Back to Products</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            {isEdit ? "Edit" : "Create"} <span className="text-muted-foreground/30">Product</span>
          </h1>
          <p className="admin-subtitle">Manage your product details and inventory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* Core Identity & Classification */}
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
              {/* Hidden Slug for Form Integrity */}
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
                        setValue("subcategory", ""); // Reset subcategory
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

        {/* Financial Metrics */}
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

        {/* Media Hub */}
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

        {/* Stock Levels */}
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

        {/* Deployment Protocol */}
        <div className="admin-table-form p-8 md:p-14 space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-foreground/10 flex items-center justify-center border border-foreground/20">
              <Settings size={20} className="text-foreground" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Visibility & Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Tags</Label>
               <Input 
                  {...register("tags")}
                  placeholder="limited, organic, industrial"
                  className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
               />
            </div>
            <div className="flex flex-col sm:flex-row gap-8 items-center justify-end">
               <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-3xl border border-border/5 flex-1 w-full sm:w-auto">
                 <Checkbox 
                   id="isActive" 
                   checked={watch("isActive")} 
                   onCheckedChange={(val) => setValue("isActive", val)}
                   className="w-8 h-8 rounded-xl border-border/20 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Active</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Visible to customers</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-3xl border border-border/5 flex-1 w-full sm:w-auto">
                 <Checkbox 
                   id="isFeatured" 
                   checked={watch("isFeatured")} 
                   onCheckedChange={(val) => setValue("isFeatured", val)}
                   className="w-8 h-8 rounded-xl border-border/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Featured</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Show on homepage</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-3xl border border-border/5 flex-1 w-full sm:w-auto">
                 <Checkbox 
                   id="showReviews" 
                   checked={watch("showReviews")} 
                   onCheckedChange={(val) => setValue("showReviews", val)}
                   className="w-8 h-8 rounded-xl border-border/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                 />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Show Ratings</p>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Show customer reviews</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border/5">
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
