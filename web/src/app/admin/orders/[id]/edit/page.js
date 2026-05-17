"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAdminOrders } from "@/modules/admin/hooks/useAdminOrders";
import { useAdminProducts } from "@/modules/admin/hooks/useAdminProducts";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError } from "@/utils/swal";
import Loader from "@/components/common/Loader";
import { 
  ChevronLeft, 
  Package, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Save, 
  ArrowRight,
  ShieldAlert,
  Settings,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { orderDetails: order, orderDetailsLoading, updateOrder } = useAdminOrders({}, id);
  const [searchTerm, setSearchTerm] = useState("");
  const { products: allProducts } = useAdminProducts({ search: searchTerm, limit: 5 });
  
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (order) {
      setItems(order.orderItems || []);
      setValue("name", order.shippingAddress?.name || "");
      setValue("email", order.shippingAddress?.email || "");
      setValue("phone", order.shippingAddress?.phone || "");
      setValue("street", order.shippingAddress?.street || "");
      setValue("city", order.shippingAddress?.city || "");
      setValue("paymentMethod", order.paymentMethod);
    }
  }, [order, setValue]);

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
    setSearchTerm("");
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

    setIsSubmitting(true);
    try {
      const cleanItems = items.map(i => ({
        product: i.product?._id || i.product,
        size: i.size?._id || i.size,
        quantity: i.quantity,
        price: i.price
      }));

      await updateOrder({ 
        id, 
        data: {
          shippingAddress: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            street: data.street,
            city: data.city,
          },
          orderItems: cleanItems,
          paymentMethod: data.paymentMethod
        } 
      });
      
      swalToast("Order updated successfully", "success");
      router.push(`/admin/orders/${id}`);
    } catch (err) {
      swalError("Sync Failed", err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderDetailsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-32 px-4 sm:px-10 pt-10">
      {/* 🏔️ Strategic Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="w-14 h-14 rounded-2xl border-border bg-muted/30 hover:bg-foreground hover:text-background transition-all"
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge className="bg-indigo-600/10 text-indigo-600 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                Edit Order
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">/ Updating Order</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
              Order #{id.slice(-8)}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hidden sm:flex text-[10px] font-black uppercase tracking-widest hover:bg-rose-600/5 hover:text-rose-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="h-16 px-10 rounded-2xl bg-foreground text-background hover:bg-indigo-600 hover:text-white transition-all duration-500 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-600/20"
          >
            {isSubmitting ? <Loader size="small" className="mr-3" /> : <Save className="mr-3" size={16} />}
            Save Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 📦 Manifest Workspace */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="rounded-[3rem] border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                 <Package size={16} className="text-indigo-600" /> Products in Order
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-muted/30 border border-border group transition-all hover:bg-muted/50">
                  <div className="h-24 w-18 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
                    <img
                      src={getImageUrl(item.image || item.product?.images?.[0])}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={item.name}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="font-black text-lg text-foreground uppercase truncate italic">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                      {item.sizeName || "Universal Size"} • ৳{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-background rounded-xl border border-border overflow-hidden shadow-sm">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none border-r border-border hover:bg-muted"
                        onClick={() => handleUpdateQuantity(idx, -1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="text-sm font-black w-10 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none border-l border-border hover:bg-muted"
                        onClick={() => handleUpdateQuantity(idx, 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/10">
                   <Package className="mx-auto text-muted-foreground/10 mb-6" size={64} strokeWidth={1} />
                   <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em]">No products in this order</p>
                </div>
              )}

              {/* Artifact Search Overlay */}
              <div className="mt-10 pt-10 border-t border-border">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1 mb-4 block">Add a Product</Label>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={20} />
                  <Input
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-16 bg-muted/50 border-border rounded-2xl pl-16 text-[11px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-indigo-600/20 transition-all"
                  />
                </div>

                {searchTerm && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    {allProducts?.map((product) => (
                      <div key={product._id} className="p-4 rounded-2xl border border-border bg-card shadow-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <img src={getImageUrl(product.images?.[0])} className="h-14 w-10 object-cover rounded-xl grayscale" />
                          <span className="text-[10px] font-black uppercase tracking-tight truncate flex-1">{product.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes?.map((s) => (
                            <Button
                              key={s.size._id}
                              disabled={s.stock === 0}
                              variant="outline"
                              onClick={() => handleAddItem(product, s.size)}
                              className="h-10 px-4 text-[8px] font-black uppercase tracking-widest rounded-lg border-border/50 hover:bg-foreground hover:text-background transition-all"
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
            </CardContent>
          </Card>
        </div>

        {/* 📋 Tactical Logistics Module */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="rounded-[3rem] border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                 <Truck size={16} className="text-indigo-600" /> Shipping Address
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <Input {...register("name")} className="h-14 bg-muted/30 border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <Input {...register("email")} className="h-14 bg-muted/30 border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input {...register("phone")} className="h-14 bg-muted/30 border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Street Address</Label>
                  <Input {...register("street")} className="h-14 bg-muted/30 border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</Label>
                  <Input {...register("city")} className="h-14 bg-muted/30 border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                 <ShieldAlert size={16} className="text-indigo-600" /> Payment Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="grid gap-3">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Method</Label>
                <select
                  {...register("paymentMethod")}
                  className="w-full h-14 bg-muted/30 border border-border rounded-xl px-6 text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 outline-none appearance-none cursor-pointer uppercase tracking-widest"
                >
                  <option value="COD">Cash On Delivery</option>
                  <option value="SSLCommerz">SSLCommerz (Online)</option>
                  <option value="bKash">bKash (MFS)</option>
                </select>
              </div>

              <div className="pt-8 border-t border-border flex justify-between items-end">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Order Total</p>
                   <p className="text-4xl font-black italic tracking-tighter">
                     ৳{items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(0)}
                   </p>
                 </div>
                 <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-indigo-600/20 text-indigo-600 px-3 py-1 mb-1">
                   Total Amount
                 </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
