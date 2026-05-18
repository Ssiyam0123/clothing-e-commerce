"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAdminFlashSales, useAdminFlashSale } from "@/app/admin/flash-sales/lib/useAdminFlashSales";
import { useAdminProducts } from "@/app/admin/_hooks/useAdminProducts";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/common/Loader";
import { swalToast, swalError } from "@/utils/swal";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import FlashSaleDetailsForm from "../components/FlashSaleDetailsForm";
import FlashSaleProductSelect from "../components/FlashSaleProductSelect";

export default function FlashSaleFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { createFlashSale, updateFlashSale } = useAdminFlashSales();
  const { sale, isLoading: isSaleLoading } = useAdminFlashSale(id);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { products: searchResults, isFetching } = useAdminProducts({
    search: debouncedSearch,
    limit: 5,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      discount: 0,
      startImmediately: false,
      startDate: "",
      endDate: "",
      isActive: false,
    }
  });
  const watchStartImmediately = watch("startImmediately");

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isEdit && sale) {
      setValue("name", sale.name || "");
      setValue("description", sale.description || "");
      setValue("discount", sale.discount || 0);
      setValue("startDate", formatDateTime(sale.startDate));
      setValue("endDate", formatDateTime(sale.endDate));
      setValue("isActive", sale.isActive || false);
      setValue("startImmediately", sale.startImmediately || false);
      if (sale.products) setSelectedProducts(sale.products);
    }
  }, [isEdit, id, sale, setValue]);

  const toggleProductSelection = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);
    if (exists) {
      setSelectedProducts((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      return swalError(
        "No Products",
        "Please select at least one product.",
      );
    }

    let start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (data.startImmediately) {
      start = new Date();
    }

    if (start >= end) {
      return swalError("Invalid Dates", "End date must be after start date.");
    }

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      discount: Number(data.discount),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isActive: data.isActive === "on" || data.isActive === true,
      startImmediately: data.startImmediately === true,
      products: selectedProducts.map((p) => p._id),
    };

    try {
      setIsSaving(true);
      if (isEdit) {
        await updateFlashSale({ id, data: payload });
        swalToast("Sale Updated", "success");
      } else {
        await createFlashSale(payload);
        swalToast("Sale Created", "success");
      }
      setTimeout(() => router.push("/admin/flash-sales"), 1500);
    } catch (err) {
      swalError(
        "Error",
        err.response?.data?.message || "Please check the form for errors.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && isSaleLoading) {
    return (
      <div className="admin-page-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-page-container">
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
          <span>Back to Flash Sales</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            {isEdit ? "Edit" : "Create"} <span className="text-rose-500">Flash Sale</span>
          </h1>
          <p className="admin-subtitle">Manage your limited-time sale event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 📑 Campaign Parameters */}
        <div className="lg:col-span-5 space-y-10">
          <FlashSaleDetailsForm 
            register={register} 
            watchStartImmediately={watchStartImmediately} 
            errors={errors} 
          />
        </div>

        {/* 📦 Product Vault Linkage */}
        <div className="lg:col-span-7 space-y-10">
          <FlashSaleProductSelect
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            isFetching={isFetching}
            selectedProducts={selectedProducts}
            toggleProductSelection={toggleProductSelection}
            isEdit={isEdit}
            isSaving={isSaving}
          />
        </div>

      </form>
    </div>
  );
}
