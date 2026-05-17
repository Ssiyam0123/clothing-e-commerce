"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useAdminProducts } from "../lib/useAdminProducts";
import { useAdminCategories } from "@/modules/admin/hooks/useAdminCategories";
import { useSubcategories } from "@/modules/client/common/lib/useSubcategories";
import { useSizes } from "@/modules/client/common/lib/useSizes";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
import ProductForm from "../components/ProductForm";

export default function ProductAddPage() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id && id !== "new";

  const { products, createProduct, updateProduct } = useAdminProducts();
  const { categories } = useAdminCategories();
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
    <ProductForm 
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      setValue={setValue}
      watch={watch}
      control={control}
      errors={errors}
      isEdit={isEdit}
      categories={categories}
      filteredSubcategories={filteredSubcategories}
      filteredSizes={filteredSizes}
      imagePreviews={imagePreviews}
      handleFileChange={handleFileChange}
      removeLocalImage={removeLocalImage}
      isSubmitting={isSubmitting}
      router={router}
    />
  );
}
