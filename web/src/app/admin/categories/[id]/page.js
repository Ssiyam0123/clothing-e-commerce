"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";

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
      console.error("Category submission error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Error processing request.";
      swalError("Action Failed", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? "Configuration" : "Initialize Category"}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Taxonomy Configuration Protocol
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← Cancel & Return
        </button>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Category Name *
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all"
              placeholder="e.g. Outerwear"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              URL Slug *
            </label>
            <input
              type="text"
              {...register("slug", { required: true, pattern: /^[a-z0-9-]+$/ })}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all"
              placeholder="e.g. outerwear"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
            Narrative Description
          </label>
          <textarea
            {...register("description")}
            rows="4"
            className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-3xl px-6 py-5 outline-none font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
            placeholder="SEO Meta Description..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Cover Visual Asset
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-full sm:w-1/2 border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#111] rounded-[2rem] p-10 text-center hover:border-zinc-900 dark:hover:border-white transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                {...register("imageFile")}
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl block mb-3 grayscale opacity-50">
                🖼️
              </span>
              <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                Select Image
              </span>
            </div>

            {imagePreview && (
              <div className="w-full sm:w-1/2 relative h-48 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            {isSubmitting
              ? "Processing..."
              : isEdit
                ? "Sync Architecture"
                : "Initialize Category"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="flex-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
