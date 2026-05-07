"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useFlashSales } from "@/hooks/useFlashSale";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";
import { swalToast, swalError } from "@/utils/swal";

export default function FlashSaleForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { allFlashSales, createFlashSale, updateFlashSale } =
    useFlashSales(true);

  const [loading, setLoading] = useState(isEdit);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { products: searchResults, isFetching } = useProducts({
    search: debouncedSearch,
    limit: 5,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const watchStartImmediately = watch("startImmediately");

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isEdit && allFlashSales) {
      const sale = allFlashSales.find((s) => s._id === id);
      if (sale) {
        setValue("name", sale.name);
        setValue("description", sale.description || "");
        setValue("discount", sale.discount);
        setValue("startDate", formatDateTime(sale.startDate));
        setValue("endDate", formatDateTime(sale.endDate));
        setValue("isActive", sale.isActive);
        setValue("startImmediately", sale.startImmediately || false);
        if (sale.products) setSelectedProducts(sale.products);
        setLoading(false);
      } else if (allFlashSales) setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isEdit, id, allFlashSales, setValue]);

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
        "Missing Payload",
        "Please select at least one product.",
      );
    }

    let start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // If "Start Immediately" is checked, override startDate to current time
    if (data.startImmediately) {
      start = new Date();
    }

    if (start >= end) {
      return swalError("Timeline Error", "End date must be after start date.");
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
      if (isEdit) {
        await updateFlashSale({ id, data: payload });
        swalToast("Campaign Updated", "success");
      } else {
        await createFlashSale(payload);
        swalToast("Campaign Launched", "success");
      }
      setTimeout(() => router.push("/admin/flash-sales"), 1500);
    } catch (err) {
      swalError(
        "Sync Protocol Failed",
        err.response?.data?.message || "Check your parameters.",
      );
    }
  };

  if (loading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      {/* Header (unchanged) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? "Campaign Config" : "Initialize Protocol"}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Flash Sale Setup Wizard
          </p>
        </div>
        <Link
          href="/admin/flash-sales"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← Cancel & Return
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* Left: Meta */}
        <div className="lg:col-span-5 space-y-8 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm h-fit">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">
            Campaign Meta
          </h2>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Campaign Title *
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
              Narrative Description
            </label>
            <textarea
              rows="3"
              {...register("description")}
              className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none font-medium text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">
              Global Discount % *
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              {...register("discount", { required: true })}
              className="w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl px-5 py-4 outline-none font-black text-2xl text-center text-rose-600 dark:text-rose-400 focus:border-rose-500 transition-all"
            />
          </div>

          {/* Start Immediately Checkbox */}
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
            <input
              type="checkbox"
              {...register("startImmediately")}
              className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white cursor-pointer"
            />
            <div>
              <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                Start Immediately
              </p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                The sale will begin right after creation/update (overrides
                manual start date).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
                Start *
              </label>
              <input
                type="datetime-local"
                {...register("startDate", { required: !watchStartImmediately })}
                disabled={watchStartImmediately}
                className={`w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none text-xs font-bold text-zinc-700 dark:text-zinc-300 ${
                  watchStartImmediately ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">
                End *
              </label>
              <input
                type="datetime-local"
                {...register("endDate", { required: true })}
                className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none text-xs font-bold text-zinc-700 dark:text-zinc-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white cursor-pointer"
            />
            <div>
              <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                Active Campaign
              </p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Immediately visible to customers.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Product Picker (unchanged) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm">
          {/* ... existing product picker UI ... */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">
              Vault Linkage
            </h2>
            <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
              Selected: {selectedProducts.length}
            </span>
          </div>

          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search databanks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none font-bold text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 transition-all text-xs uppercase tracking-widest"
            />
          </div>

          {searchTerm.trim().length > 1 && (
            <div className="bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-4 mb-8">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 px-2">
                Matches
              </p>
              {isFetching ? (
                <div className="p-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">
                  Scanning...
                </div>
              ) : searchResults?.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((p) => {
                    const isSelected = selectedProducts.some(
                      (sel) => sel._id === p._id,
                    );
                    return (
                      <div
                        key={p._id}
                        onClick={() => toggleProductSelection(p)}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${isSelected ? "bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white" : "bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800"}`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={getImageUrl(p.images?.[0])}
                            className="h-10 w-10 rounded-lg object-cover grayscale"
                          />
                          <div>
                            <p
                              className={`text-xs font-black truncate leading-none ${isSelected ? "text-white dark:text-black" : "text-zinc-900 dark:text-white"}`}
                            >
                              {p.name}
                            </p>
                            <p
                              className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}
                            >
                              ৳{p.price}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="bg-white dark:bg-black text-black dark:text-white text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-widest">
                            Added
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-[10px] font-black text-zinc-400 uppercase">
                  No Data Found
                </div>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 overflow-hidden min-h-[300px]">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 px-2">
              Campaign Payload
            </p>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {selectedProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 grayscale">
                  <span className="text-4xl mb-4">📭</span>
                  <span className="text-[10px] font-black uppercase text-zinc-500">
                    Payload Empty
                  </span>
                </div>
              ) : (
                selectedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 shadow-sm group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(p.images?.[0])}
                        className="h-10 w-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                      <div>
                        <p className="text-xs font-black text-zinc-900 dark:text-white truncate leading-none">
                          {p.name}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                          ৳{p.price}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleProductSelection(p)}
                      className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isEdit
                ? "Sync Campaign Configuration"
                : "Launch Campaign Protocol"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
