"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import Loader from "@/components/common/Loader";
import StarRating from "@/components/store/StarRating";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Package, 
  Zap, 
  Camera, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductManagement() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("stock");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    field: "",
    value: "",
    extraData: null,
  });

  const {
    data: product,
    isLoading: pLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminProduct", id],
    queryFn: async () => (await api.get(`/admin/products/${id}`)).data,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => (await api.get(`/reviews/product/${id}`)).data,
  });

  const { updateProduct: updateMutation } = useAdminProducts();

  const salePrice = useMemo(() => {
    if (!product) return 0;
    return (
      product.price -
      (product.price * (product.discount || 0)) / 100
    ).toFixed(2);
  }, [product]);

  if (pLoading)
    return (
      <div className="admin-page-container flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
    
  if (!product)
    return (
      <div className="admin-page-container flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Package size={64} className="opacity-10" />
        <h1 className="text-2xl font-black uppercase tracking-widest opacity-20 italic text-center">Artifact De-synchronized</h1>
        <Button onClick={() => router.push("/admin/products")} variant="outline" className="rounded-full px-8 uppercase tracking-widest text-[10px] font-black">Return to Catalog</Button>
      </div>
    );

  const syncWithBackend = async (changes) => {
    const formData = new FormData();
    const finalData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount: product.discount,
      category: product.category._id,
      subcategory: product.subcategory?._id,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      showReviews: product.showReviews,
      tags: product.tags,
      sizes: product.sizes.map((s) => ({ size: s.size._id, stock: s.stock })),
      images: product.images,
      ...changes,
    };

    Object.keys(finalData).forEach((key) => {
      if (["sizes", "tags", "images"].includes(key)) {
        formData.append(key, JSON.stringify(finalData[key]));
      } else if (finalData[key] !== undefined && key !== "newFiles") {
        formData.append(key, finalData[key]);
      }
    });

    if (changes.newFiles) {
      for (let i = 0; i < changes.newFiles.length; i++) {
        formData.append("images", changes.newFiles[i]);
      }
    }

    try {
      await updateMutation({ id, data: formData });
      swalToast("Databanks Synchronized", "success");
      setModal({ ...modal, isOpen: false });
      refetch();
    } catch (err) {
      swalError("Sync Protocol Failed", err.response?.data?.message || "Check connection.");
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const val = e.target.inputVal?.value;

    if (modal.type === "stock") {
      const newSizes = product.sizes.map((s) =>
        s.size._id === modal.extraData
          ? { size: s.size._id, stock: parseInt(val) }
          : { size: s.size._id, stock: s.stock },
      );
      syncWithBackend({
        sizes: newSizes.map((s) => ({ size: s.size, stock: s.stock })),
      });
    } else if (modal.type === "bulkStock") {
      syncWithBackend({
        sizes: product.sizes.map((s) => ({
          size: s.size._id,
          stock: parseInt(val),
        })),
      });
    } else if (modal.type === "image") {
      const files = fileInputRef.current.files;
      if (product.images.length + files.length > 5) {
        return swalError("Quota Exceeded", "Limit: 5 images per product.");
      }
      syncWithBackend({ newFiles: files });
    } else {
      syncWithBackend({ [modal.field]: val });
    }
  };

  const handleRemoveImage = async (index) => {
    const isConfirmed = await swalConfirm(
      "Purge Visual?",
      "This image will be permanently deleted.",
    );
    if (isConfirmed) {
      syncWithBackend({
        images: product.images.filter((_, idx) => idx !== index),
      });
    }
  };

  const handleDeleteReview = async (revId) => {
    const isConfirmed = await swalConfirm(
      "Moderate Review?",
      "This feedback will be removed.",
    );
    if (isConfirmed) {
      try {
        await api.delete(`/reviews/${revId}`);
        refetchReviews();
        swalToast("Review Removed", "success");
      } catch (err) {
        swalError("Action Blocked", err.response?.data?.message || "Could not delete.");
      }
    }
  };

  return (
    <div className="admin-page-container max-w-7xl">
      {/* 🔙 Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/products")}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Return to Catalog</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <img
              src={getImageUrl(product.images?.[0])}
              className="h-20 w-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border border-border/10 shadow-xl"
              alt=""
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 border-2 border-background flex items-center justify-center">
              <ShieldCheck size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="admin-title">{product.name}</h1>
            <p className="admin-subtitle">Artifact Hub // ID: {id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => syncWithBackend({ isActive: !product.isActive })}
            variant="outline"
            className={cn(
              "h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              product.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
            )}
          >
            {product.isActive ? "● Public" : "○ Hidden"}
          </Button>
          <Button
            onClick={() => syncWithBackend({ showReviews: !product.showReviews })}
            variant="outline"
            className={cn(
              "h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              product.showReviews !== false ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" : "bg-muted text-muted-foreground border-border"
            )}
          >
            {product.showReviews !== false ? "★ Ratings On" : "☆ Ratings Off"}
          </Button>
          <Button
             onClick={() => router.push(`/admin/products/${id}`)}
             variant="outline"
             className="h-12 px-6 rounded-full text-[9px] font-black uppercase tracking-widest border-border hover:bg-foreground hover:text-background transition-all"
          >
             <Settings size={14} className="mr-2" /> Base Configuration
          </Button>
        </div>
      </div>

      {/* TACTICAL TABS */}
      <div className="flex bg-muted/20 p-2 rounded-full border border-border/10 mb-10 overflow-x-auto gap-2 no-scrollbar backdrop-blur-md">
        {[
          { id: "stock", label: "Inventory", icon: Package },
          { id: "pricing", label: "Financials", icon: Zap },
          { id: "media", label: "Visuals", icon: Camera },
          { id: "reviews", label: "Feedback", icon: MessageSquare },
          { id: "details", label: "Narrative", icon: TrendingUp },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 min-w-[140px] py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all flex items-center justify-center gap-3",
              activeTab === t.id 
                ? "bg-foreground text-background shadow-2xl scale-[1.02]" 
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* INVENTORY HUB */}
        {activeTab === "stock" && (
          <div className="admin-table-form p-8 md:p-14 space-y-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Allocation Matrix</h3>
              </div>
              <Button
                onClick={() => setModal({ isOpen: true, type: "bulkStock", title: "Global Sync", value: 0 })}
                variant="outline"
                className="h-10 px-6 rounded-full text-[9px] font-black uppercase tracking-widest border-border/10 hover:bg-indigo-600 hover:text-white transition-all"
              >
                Global Override
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {product.sizes?.map((s) => (
                <div
                  key={s._id}
                  className="p-8 bg-muted/20 border border-border/5 rounded-[2rem] flex justify-between items-center group hover:border-indigo-600/20 transition-all hover:bg-muted/30"
                >
                  <div>
                    <p className="text-3xl font-black text-foreground uppercase tracking-tighter mb-2">{s.size?.name}</p>
                    <Badge className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      s.stock < 10 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-600"
                    )}>
                      {s.stock} Artifacts
                    </Badge>
                  </div>
                  <button
                    onClick={() => setModal({ isOpen: true, type: "stock", title: `Update ${s.size?.name}`, extraData: s.size._id, value: s.stock })}
                    className="w-12 h-12 rounded-2xl bg-background border border-border/10 flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all shadow-xl"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCIAL HUB */}
        {activeTab === "pricing" && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="admin-table-form p-8 md:p-12 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/20">
                  <Zap size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Financial Protocols</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-8 bg-muted/20 rounded-[2rem] border border-border/5 group hover:border-emerald-600/20 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Current Valuation</p>
                    <p className="text-4xl font-black text-foreground tracking-tighter leading-none">৳{product.price}</p>
                  </div>
                  <Button
                    onClick={() => setModal({ isOpen: true, type: "price", title: "Refine Base Valuation", field: "price", value: product.price })}
                    className="rounded-full h-12 px-8 uppercase font-black text-[10px] tracking-widest bg-background border-border/10 text-foreground hover:bg-emerald-600 hover:text-white transition-all shadow-xl"
                  >
                    Edit
                  </Button>
                </div>

                <div className="flex justify-between items-center p-8 bg-rose-500/5 rounded-[2rem] border border-rose-500/10 group hover:border-rose-500/30 transition-all">
                  <div>
                    <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-widest mb-2 ml-1">Liquidation Delta</p>
                    <p className="text-4xl font-black text-rose-600 tracking-tighter leading-none">{product.discount || 0}% Yield</p>
                  </div>
                  <Button
                    onClick={() => setModal({ isOpen: true, type: "discount", title: "Set Liquidation Protocol", field: "discount", value: product.discount })}
                    className="rounded-full h-12 px-8 uppercase font-black text-[10px] tracking-widest bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-xl"
                  >
                    Adjust
                  </Button>
                </div>
              </div>
            </div>

            <div className="admin-table-form bg-foreground p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10 space-y-6">
                <p className="text-[11px] font-black text-background/40 uppercase tracking-[0.5em] italic">Consumer End Magnitude</p>
                <h2 className="text-[7rem] md:text-[9rem] font-black text-background tracking-tighter leading-none animate-in fade-in duration-1000">
                  <span className="text-4xl md:text-5xl opacity-40 mr-2">৳</span>{salePrice}
                </h2>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-background/5 border border-background/10 backdrop-blur-md">
                   <trending-up className="text-emerald-400 w-4 h-4" />
                   <span className="text-[9px] font-black text-background/60 uppercase tracking-widest">Optimized for Conversion</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISUALS HUB */}
        {activeTab === "media" && (
          <div className="admin-table-form p-8 md:p-14 space-y-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                  <Camera size={20} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Visual Artifact Management</h3>
              </div>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-4 py-2 border-border/10">Quota: {product.images.length}/5</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className="relative group aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-border/10 shadow-xl bg-muted/20"
                >
                  <img
                    src={getImageUrl(img)}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
                    >
                      <Trash2 size={24} />
                    </button>
                    <p className="text-[8px] font-black text-white uppercase tracking-widest">Purge Artifact</p>
                  </div>
                </div>
              ))}
              
              {product.images.length < 5 && (
                <label className="relative aspect-[3/4] rounded-[2.5rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center cursor-pointer hover:border-amber-600/40 hover:bg-amber-600/5 transition-all group overflow-hidden bg-muted/10">
                  <Plus size={32} className="mb-3 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-amber-600">Inject Asset</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={() => setModal({ isOpen: true, type: "image", title: "Upload Media" })}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* FEEDBACK HUB */}
        {activeTab === "reviews" && (
          <div className="admin-table-form overflow-hidden">
            <div className="p-10 border-b border-border/5 bg-muted/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
                  <MessageSquare size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Community Pulse</h3>
              </div>
              <Badge className="bg-foreground text-background px-6 py-2 rounded-full text-[9px] uppercase tracking-widest font-black shadow-lg">
                {reviewsData?.totalReviews || 0} Artifact Reports
              </Badge>
            </div>
            
            <div className="divide-y divide-border/5">
              {reviewsData?.reviews?.map((rev) => (
                <div key={rev._id} className="p-10 flex flex-col md:flex-row justify-between items-start gap-10 hover:bg-muted/5 transition-colors group">
                  <div className="flex gap-8 w-full max-w-3xl">
                    <div className="h-16 w-16 rounded-3xl bg-muted/30 flex items-center justify-center font-black text-xl text-foreground border border-border/10 shrink-0 shadow-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      {rev.user?.avatar ? (
                        <img src={getImageUrl(rev.user.avatar)} className="h-full w-full object-cover" />
                      ) : (
                        rev.user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <p className="font-black text-sm uppercase tracking-tight text-foreground">{rev.user?.name}</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => (
                            <div key={s} className={cn("w-2 h-2 rounded-full", s <= rev.rating ? "bg-amber-500" : "bg-muted/20")}></div>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">"{rev.comment}"</p>
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-6">
                          {rev.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={getImageUrl(typeof img === "string" ? img : img?.url)} 
                              className="w-24 h-24 rounded-2xl object-cover border border-border/10 grayscale hover:grayscale-0 transition-all cursor-zoom-in shadow-md"
                              onClick={() => window.open(getImageUrl(typeof img === "string" ? img : img?.url), "_blank")}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest pt-4">
                        Reported: {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteReview(rev._id)}
                    variant="ghost"
                    className="text-rose-500 font-black text-[9px] border border-rose-500/10 bg-rose-500/5 px-6 py-3 rounded-full hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest shadow-sm"
                  >
                    Moderate Report
                  </Button>
                </div>
              ))}
              
              {reviewsData?.reviews?.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center opacity-10 gap-6 grayscale">
                  <MessageSquare size={64} strokeWidth={1} />
                  <p className="text-sm font-black uppercase tracking-[0.5em] italic">No Community Pulse Detected</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NARRATIVE HUB */}
        {activeTab === "details" && (
          <div className="admin-table-form p-8 md:p-14 space-y-10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-foreground/10 flex items-center justify-center border border-foreground/20">
                  <TrendingUp size={20} className="text-foreground" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Narrative Parameters</h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {[
                  { label: "Artifact Identity", field: "name", value: product.name },
                  { label: "Temporal Description", field: "description", value: product.description, multi: true },
                  { label: "Unique Network Slug", field: "slug", value: product.slug, tactical: true },
                ].map((d) => (
                  <div key={d.field} className="p-10 border border-border/5 bg-muted/20 rounded-[2.5rem] flex flex-col md:flex-row justify-between md:items-center gap-8 group hover:border-foreground/10 transition-all">
                    <div className="flex-1 space-y-3">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] ml-1">{d.label}</p>
                      <p className={cn(
                        "text-foreground font-bold leading-relaxed",
                        d.tactical ? "text-indigo-600 font-mono text-sm" : "text-lg tracking-tight"
                      )}>
                        {d.value || <span className="opacity-10 italic">Awaiting Protocol...</span>}
                      </p>
                    </div>
                    <Button
                      onClick={() => setModal({ isOpen: true, type: "details", title: `Edit ${d.label}`, field: d.field, value: d.value })}
                      variant="outline"
                      className="h-12 px-10 rounded-full text-[10px] font-black uppercase tracking-widest border-border/10 hover:bg-foreground hover:text-background transition-all shadow-xl"
                    >
                      Refine
                    </Button>
                  </div>
                ))}
              </div>
          </div>
        )}
      </div>

      {/* MODAL OVERLAY */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-card border border-border/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500">
            <div className="px-12 py-10 border-b border-border/5 flex justify-between items-center bg-muted/20">
              <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">{modal.title}</h3>
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="w-10 h-10 rounded-full border border-border/10 flex items-center justify-center hover:rotate-90 transition-all text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="p-12 space-y-10">
              {modal.type === "image" ? (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-border/20 rounded-[2.5rem] p-16 text-center hover:border-indigo-600/40 hover:bg-indigo-600/5 transition-all group bg-muted/10">
                     <Camera size={48} strokeWidth={1} className="mx-auto mb-6 text-muted-foreground group-hover:text-indigo-600 transition-all" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-indigo-600">Select Visual Assets</p>
                  </div>
                </div>
              ) : modal.field === "description" ? (
                <textarea
                  name="inputVal"
                  defaultValue={modal.value}
                  required
                  rows="6"
                  className="w-full bg-muted/30 border border-border/10 rounded-[2rem] p-8 text-foreground font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none shadow-inner"
                  placeholder="Inject narrative content..."
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] ml-2">Protocol Input</p>
                  <input
                    name="inputVal"
                    type={["price", "discount", "stock", "bulkStock"].includes(modal.field || modal.type) ? "number" : "text"}
                    defaultValue={modal.value}
                    required
                    autoFocus
                    className="w-full bg-muted/30 border border-border/10 rounded-[2.5rem] p-10 text-6xl font-black text-foreground outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all text-center tracking-tighter"
                  />
                </div>
              )}
              
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="flex-1 h-20 bg-foreground text-background rounded-full font-black uppercase tracking-[0.5em] text-[11px] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                >
                  {updateMutation.isLoading ? "Synchronizing..." : "Synchronize Data"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
