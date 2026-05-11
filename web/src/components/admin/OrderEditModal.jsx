"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { swalToast, swalError } from "@/utils/swal";
import { Search, Plus, Minus, Trash2, Package, X } from "lucide-react";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";

export default function OrderEditModal({ order, isOpen, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(order.orderItems || []);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch products for searching
  const { products: allProducts } = useAdminProducts({ search: searchTerm, limit: 5 });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: order.shippingAddress?.name || "",
      email: order.shippingAddress?.email || "",
      phone: order.shippingAddress?.phone || "",
      address: order.shippingAddress?.address || "",
    },
  });

  const handleAddItem = (product, size) => {
    const existingIndex = items.findIndex(
      (i) => (i.product?._id || i.product) === product._id && (i.size?._id || i.size) === size._id
    );

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          product: { _id: product._id, name: product.name, images: product.images },
          name: product.name,
          size: size._id,
          sizeName: size.name,
          quantity: 1,
          price: product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price,
        },
      ]);
    }
    setSearchTerm(""); // Reset search after adding
  };

  const handleUpdateQuantity = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      return swalError("Validation Error", "Order must have at least one artifact.");
    }

    try {
      setLoading(true);
      const cleanItems = items.map(i => ({
        product: i.product?._id || i.product,
        size: i.size?._id || i.size,
        quantity: i.quantity,
        price: i.price
      }));

      await onUpdate(order._id, { 
        shippingAddress: data,
        orderItems: cleanItems
      });
      
      swalToast("Deployment Data Synchronized", "success");
      onClose();
    } catch (err) {
      swalError("Sync Failed", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border p-0 overflow-hidden max-w-[95vw] lg:max-w-5xl h-[90vh] lg:h-[85vh] rounded-[2rem] lg:rounded-[3rem]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* LEFT: Order Manifest Management */}
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border custom-scrollbar">
            <DialogHeader className="mb-6 lg:mb-10">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl lg:text-3xl font-black uppercase tracking-tighter italic leading-none">
                    Edit <span className="text-muted-foreground/50 text-xl lg:text-2xl">Manifest</span>
                  </DialogTitle>
                  <p className="text-[8px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">
                    Sequence: #{order._id.slice(-8)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                    <X size={20} />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-3 lg:space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50">
                  <div className="h-14 w-10 lg:h-16 lg:w-12 bg-muted rounded-xl overflow-hidden shrink-0 border border-border">
                    <img
                      src={getImageUrl(item.image || item.product?.images?.[0])}
                      className="w-full h-full object-cover grayscale"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[10px] lg:text-xs text-foreground uppercase truncate">
                      {item.name}
                    </p>
                    <p className="text-[8px] lg:text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                      {item.sizeName || "Size N/A"} • ৳{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-3">
                    <div className="flex items-center bg-background rounded-lg border border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 lg:h-8 lg:w-8 rounded-none border-r border-border"
                        onClick={() => handleUpdateQuantity(idx, -1)}
                      >
                        <Minus size={10} />
                      </Button>
                      <span className="text-xs font-black w-6 lg:w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 lg:h-8 lg:w-8 rounded-none border-l border-border"
                        onClick={() => handleUpdateQuantity(idx, 1)}
                      >
                        <Plus size={10} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 lg:h-8 lg:w-8 rounded-lg text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-12 lg:py-20 text-center border-2 border-dashed border-border rounded-3xl">
                  <Package className="mx-auto text-muted-foreground/20 mb-4" size={40} />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    No artifacts in manifest
                  </p>
                </div>
              )}
            </div>

            {/* Product Search */}
            <div className="mt-8 lg:mt-10 pt-8 lg:pt-10 border-t border-border">
              <div className="relative mb-4 lg:mb-6">
                <Search className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input
                  placeholder="ADD ARTIFACT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 lg:h-14 bg-muted/50 border-border rounded-2xl pl-12 lg:pl-14 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em]"
                />
              </div>

              {searchTerm && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  {allProducts?.map((product) => (
                    <div key={product._id} className="p-3 lg:p-4 rounded-2xl border border-border bg-card/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-2 lg:mb-3">
                        <img src={getImageUrl(product.images?.[0])} className="h-10 w-8 object-cover rounded-lg grayscale shadow-sm" />
                        <span className="text-[9px] lg:text-[10px] font-black uppercase truncate">{product.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 lg:gap-2">
                        {product.sizes?.map((s) => (
                          <Button
                            key={s.size._id}
                            disabled={s.stock === 0}
                            onClick={() => handleAddItem(product, s.size)}
                            className="h-7 lg:h-8 px-3 lg:px-4 text-[7px] lg:text-[8px] font-black uppercase tracking-widest rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            {s.size.name} ({s.stock})
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Deployment Details */}
          <div className="w-full lg:w-[360px] bg-muted/20 p-6 lg:p-10 flex flex-col shrink-0">
            <h3 className="text-[9px] lg:text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6 lg:mb-8">
              Deployment Info
            </h3>

            <form id="order-edit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6 flex-1 flex flex-col">
              <div className="space-y-3 lg:space-y-4">
                <div className="grid gap-1.5">
                  <Label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Recipient</Label>
                  <Input {...register("name")} className="h-10 lg:h-12 bg-card border-border rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</Label>
                  <Input {...register("phone")} className="h-10 lg:h-12 bg-card border-border rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Optional)</Label>
                  <Input {...register("email")} className="h-10 lg:h-12 bg-card border-border rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deployment Base (Full Address)</Label>
                  <Input {...register("address")} className="h-10 lg:h-12 bg-card border-border rounded-xl px-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="pt-6 lg:pt-10 mt-auto border-t border-border/50">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex flex-col">
                     <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Items</span>
                     <span className="text-sm font-black">{items.length} Units</span>
                   </div>
                   <div className="text-right">
                     <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Settlement</span>
                     <p className="text-2xl lg:text-3xl font-black italic tracking-tighter">৳{items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(0)}</p>
                   </div>
                </div>
                <div className="flex gap-2 lg:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-10 lg:h-12 rounded-xl font-black uppercase text-[9px] lg:text-[10px] tracking-widest border-border hover:bg-muted"
                  >
                    Abort
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-10 lg:h-12 bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-xl font-black uppercase text-[9px] lg:text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    {loading ? "Syncing..." : "Commit"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
