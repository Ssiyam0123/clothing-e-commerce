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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Search, 
  Trash2, 
  Zap, 
  Calendar, 
  ShoppingBag, 
  ArrowRight,
  Package,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="admin-page-container">
        <Loader />
      </div>
    );

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
          <span>Return to Pulse</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            {isEdit ? "Configure" : "Initialize"} <span className="text-rose-500">Pulse</span>
          </h1>
          <p className="admin-subtitle">High-Velocity Liquidation Protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 📑 Campaign Parameters */}
        <div className="lg:col-span-5 space-y-10">
          <div className="admin-table-form p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <Zap size={20} className="text-rose-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Operational Meta</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Campaign Title *</label>
                <Input 
                  {...register("name", { required: true })}
                  placeholder="e.g. Midnight Surge 2.0"
                  className="h-14 bg-muted/30 border-border/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Narrative Context</label>
                <textarea 
                  rows="3"
                  {...register("description")}
                  placeholder="Marketing narrative for this drop..."
                  className="w-full bg-muted/30 border border-border/10 rounded-2xl px-6 py-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                />
              </div>

              <div className="p-6 bg-rose-600/5 rounded-3xl border border-rose-600/10 text-center space-y-3">
                <label className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em]">Global Discount Magnitude (%)</label>
                <input 
                  type="number"
                  {...register("discount", { required: true })}
                  className="w-full bg-transparent text-5xl font-black text-center tracking-tighter text-rose-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/5">
                <input
                  type="checkbox"
                  {...register("startImmediately")}
                  className="w-6 h-6 rounded-lg border-border/20 text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">Instant Ignition</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Sale begins immediately upon commit</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Temporal Start</label>
                  <input 
                    type="datetime-local"
                    {...register("startDate", { required: !watchStartImmediately })}
                    disabled={watchStartImmediately}
                    className="w-full h-12 bg-muted/30 border border-border/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none disabled:opacity-30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Temporal End</label>
                  <input 
                    type="datetime-local"
                    {...register("endDate", { required: true })}
                    className="w-full h-12 bg-muted/30 border border-border/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/5">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-6 h-6 rounded-lg border-border/20 text-rose-600 focus:ring-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest">Master Deployment Status</p>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Toggle visibility across all storefront nodes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📦 Product Vault Linkage */}
        <div className="lg:col-span-7 space-y-10">
          <div className="admin-table-form p-8 md:p-10 space-y-8 flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Vault Linkage</h3>
              </div>
              <Badge variant="outline" className="h-8 px-4 rounded-full text-[9px] font-black border-indigo-600/20 text-indigo-600 uppercase tracking-widest bg-indigo-600/5">
                Targeted Assets: {selectedProducts.length}
              </Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
              <Input 
                placeholder="Scan global inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-16 pl-14 bg-muted/20 border-border/10 rounded-2xl text-[11px] font-black uppercase tracking-widest"
              />
            </div>

            {/* Search Results */}
            {searchTerm.trim().length > 1 && (
              <div className="bg-muted/10 border border-border/5 rounded-[2rem] p-4 animate-in slide-in-from-top-2 duration-300">
                {isFetching ? (
                  <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse italic">Scanning Vaults...</div>
                ) : searchResults?.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((p) => {
                      const isSelected = selectedProducts.some(sel => sel._id === p._id);
                      return (
                        <div
                          key={p._id}
                          onClick={() => toggleProductSelection(p)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border group",
                            isSelected 
                              ? "bg-foreground border-transparent" 
                              : "bg-background/40 border-border/5 hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <img src={getImageUrl(p.images?.[0])} className="h-10 w-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <div>
                              <p className={cn("text-[10px] font-black uppercase tracking-tight leading-none", isSelected ? "text-background" : "text-foreground")}>{p.name}</p>
                              <p className={cn("text-[8px] font-bold uppercase tracking-widest mt-1", isSelected ? "text-background/50" : "text-muted-foreground")}>৳{p.price}</p>
                            </div>
                          </div>
                          {isSelected && <Badge className="bg-background text-foreground text-[8px] px-2 py-0.5 rounded-md">Linked</Badge>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Zero Matches Found</div>
                )}
              </div>
            )}

            {/* Selected Matrix */}
            <div className="flex-1 bg-muted/20 rounded-[2.5rem] border border-border/5 p-6 overflow-hidden flex flex-col">
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 px-2 italic">Linked Payload Matrix</p>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                 {selectedProducts.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale gap-4">
                     <Package size={48} strokeWidth={1} />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em]">Payload Static</p>
                   </div>
                 ) : (
                   selectedProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-4 rounded-2xl bg-background shadow-xl border border-border/5 group">
                      <div className="flex items-center gap-4">
                        <img src={getImageUrl(p.images?.[0])} className="h-12 w-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight leading-none">{p.name}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">৳{p.price}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleProductSelection(p)}
                        className="w-10 h-10 rounded-full bg-rose-600/5 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-600/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                   ))
                 )}
               </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={selectedProducts.length === 0}
                className="w-full h-20 bg-foreground text-background hover:bg-rose-600 hover:text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-95 group"
              >
                {isEdit ? "Sync Configuration" : "Launch Protocol"}
                <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
