"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useSizes } from "@/hooks/useSizes";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronLeft, Camera, X } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { products, createProduct, updateProduct } = useAdminProducts();
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();
  const { sizes } = useSizes();

  const [loading, setLoading] = useState(isEdit);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const watchedCategory = watch("category");

  // Filter sizes based on selected category
  useEffect(() => {
    if (watchedCategory && sizes) {
      const filtered = sizes.filter(
        (size) =>
          size.category?._id === watchedCategory ||
          size.category === watchedCategory,
      );
      setFilteredSizes(filtered);
      setSelectedCategory(watchedCategory);
    } else {
      setFilteredSizes([]);
    }
  }, [watchedCategory, sizes]);

  // Load existing product data for edit mode
  useEffect(() => {
    if (isEdit && products && products.length > 0) {
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

        setExistingImages(product.images || []);
        setImagePreviews(product.images?.map((img) => getImageUrl(img)) || []);
        setSelectedFiles([]); 

        const sizesObj = {};
        product.sizes?.forEach((item) => {
          const sizeId = item.size._id || item.size;
          sizesObj[sizeId] = item.stock;
        });
        setValue("sizes", sizesObj);
        setSelectedCategory(product.category._id);
        setLoading(false);
      } else if (products) setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isEdit, id, products, setValue]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + selectedFiles.length + files.length;
    if (totalImages > 5) {
      return swalError(
        "Limit Exceeded",
        "Maximum 5 images allowed per product.",
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
        swalToast("Product updated successfully", "success");
      } else {
        await createProduct(formData);
        swalToast("Product created successfully", "success");
      }
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err) {
      console.error("Product submission error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Error processing request.";
      swalError("Sync Failed", msg);
    }
  };

  if (loading)
    return (
      <div className="p-20 flex justify-center bg-background min-h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase mb-2 italic leading-none">
            {isEdit ? "Configuration" : "Initialize"} <span className="text-muted-foreground/30">Vault</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Inventory Lifecycle Management
          </p>
        </div>
        <Link
          href="/admin/products"
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Discard & Return
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Core Identity */}
        <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
          <CardHeader className="px-4 pb-8">
            <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
              01. Core Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Product Title *
                </Label>
                <Input
                  type="text"
                  {...register("name", { required: true })}
                  className="h-14 bg-muted/50 border-border rounded-2xl px-5 outline-none font-bold text-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  URL Slug *
                </Label>
                <Input
                  type="text"
                  {...register("slug", {
                    required: true,
                    pattern: /^[a-z0-9-]+$/,
                  })}
                  className="h-14 bg-muted/50 border-border rounded-2xl px-5 outline-none font-bold text-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Description
                </Label>
                <Textarea
                  rows={4}
                  {...register("description")}
                  className="bg-muted/50 border-border rounded-2xl px-5 py-4 outline-none font-medium text-foreground focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Classification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
            <CardHeader className="px-4 pb-8">
              <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                02. Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Base Price (৳) *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="h-20 bg-muted/50 border-border rounded-2xl px-8 font-black text-3xl text-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Discount (%)
                </Label>
                <Input
                  type="number"
                  {...register("discount", { valueAsNumber: true })}
                  className="h-20 bg-muted/50 border-border rounded-2xl px-8 font-black text-3xl text-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
            <CardHeader className="px-4 pb-8">
              <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                03. Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Department *
                </Label>
                <Select
                  value={watch("category")}
                  onValueChange={(val) => setValue("category", val)}
                >
                  <SelectTrigger className="h-14 bg-muted/50 border-border rounded-2xl px-5 font-bold text-foreground">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-2xl p-2">
                    {categories?.map((c) => (
                      <SelectItem key={c._id} value={c._id} className="rounded-xl py-2 font-black text-[9px] uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Sub-Department
                </Label>
                <Select
                  value={watch("subcategory")}
                  onValueChange={(val) => setValue("subcategory", val)}
                >
                  <SelectTrigger className="h-14 bg-muted/50 border-border rounded-2xl px-5 font-bold text-foreground">
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-2xl p-2">
                    {subcategories
                      ?.filter((s) => (s.category?._id || s.category) === selectedCategory)
                      .map((s) => (
                        <SelectItem key={s._id} value={s._id} className="rounded-xl py-2 font-black text-[9px] uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media & Inventory */}
        <Card className="rounded-[2.5rem] border-border bg-card p-4 md:p-8 shadow-sm">
          <CardHeader className="px-4 pb-8">
            <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
              04. Media & Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            {/* Image Upload */}
            <div className="mb-12">
              <Label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                Product Media ({imagePreviews.length}/5)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {imagePreviews.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border group shadow-sm bg-muted/30"
                  >
                    <img
                      src={img}
                      alt="Preview"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeLocalImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/30 transition-all group">
                    <Camera size={24} className="mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[8px] font-black uppercase text-muted-foreground group-hover:text-primary tracking-widest text-center px-2">
                      Add Media
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Stock Allocation */}
            <div className="mb-8">
              <Label className="block text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                Stock Allocation
              </Label>
              {!selectedCategory ? (
                <div className="bg-muted/30 p-10 rounded-3xl border border-dashed border-border text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Awaiting category selection...
                </div>
              ) : filteredSizes.length === 0 ? (
                <div className="bg-amber-500/5 p-10 rounded-3xl border border-dashed border-amber-500/20 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  No size templates available for this department
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {filteredSizes.map((size) => (
                    <div
                      key={size._id}
                      className="bg-muted/30 border border-border rounded-2xl p-4 transition-all hover:bg-muted/50 flex flex-col gap-3"
                    >
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">
                        {size.name}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        defaultValue={0}
                        {...register(`sizes.${size._id}`, {
                          valueAsNumber: true,
                        })}
                        className="h-10 bg-card border-border rounded-xl text-center font-black text-foreground focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-12 space-y-3">
              <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Artifact Tags (comma separated)
              </Label>
              <Input
                type="text"
                {...register("tags")}
                placeholder="limited, organic, winter-2024"
                className="h-14 bg-muted/50 border-border rounded-2xl px-5 font-medium text-foreground focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <Checkbox
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(val) => setValue("isActive", val)}
                    className="w-6 h-6 rounded-lg border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => setValue("isActive", !watch("isActive"))}>
                    <label
                      htmlFor="isActive"
                      className="text-[10px] font-black uppercase tracking-widest text-foreground cursor-pointer"
                    >
                      Active Status
                    </label>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                      Visible to all live deployment nodes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group cursor-pointer">
                  <Checkbox
                    id="isFeatured"
                    checked={watch("isFeatured")}
                    onCheckedChange={(val) => setValue("isFeatured", val)}
                    className="w-6 h-6 rounded-lg border-border data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => setValue("isFeatured", !watch("isFeatured"))}>
                    <label
                      htmlFor="isFeatured"
                      className="text-[10px] font-black uppercase tracking-widest text-foreground cursor-pointer"
                    >
                      Featured Artifact
                    </label>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                      Highlight in premium spotlight sections.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full md:w-auto h-16 bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-16 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl active:scale-95"
              >
                {isEdit ? "Sync Artifact Data" : "Launch Production Protocol"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
