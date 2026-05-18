"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAdminOrders } from "@/app/admin/orders/lib/useAdminOrders";
import { useAdminProducts } from "@/app/admin/_hooks/useAdminProducts";
import { swalToast, swalError } from "@/utils/swal";
import Loader from "@/components/common/Loader";
import { 
  ChevronLeft, 
  Save, 
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Reusable Components
import OrderItemsEditor from "@/app/admin/orders/components/OrderItemsEditor";
import OrderProductSearch from "@/app/admin/orders/components/OrderProductSearch";
import OrderShippingForm from "@/app/admin/orders/components/OrderShippingForm";
import OrderSummaryCard from "@/app/admin/orders/components/OrderSummaryCard";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { orderDetails: order, orderDetailsLoading, updateOrder } = useAdminOrders({}, id);
  const [searchTerm, setSearchTerm] = useState("");
  const { products: allProducts } = useAdminProducts({ search: searchTerm, limit: 5 });
  
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (order) {
      setItems(order.orderItems || []);
      
      // Robustly normalize payment method case
      const rawPayment = order.paymentMethod || "COD";
      const normalizedPayment = 
        rawPayment.toUpperCase() === "COD" ? "COD" :
        rawPayment.toLowerCase() === "bkash" ? "bKash" :
        rawPayment.toLowerCase() === "sslcommerz" ? "SSLCommerz" : rawPayment;

      reset({
        name: order.shippingAddress?.name || "",
        email: order.shippingAddress?.email || "",
        phone: order.shippingAddress?.phone || "",
        address: order.shippingAddress?.address || order.shippingAddress?.street || "",
        paymentMethod: normalizedPayment
      });
    }
  }, [order, reset]);

  const handleAddItem = (product, size) => {
    const sizeId = typeof size === "object" && size ? size._id : size;
    const sizeName = typeof size === "object" && size ? size.name : size;

    const existingIndex = items.findIndex(
      (i) => (i.product?._id || i.product) === product._id && (i.size?._id || i.size) === sizeId
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
          size: sizeId,
          sizeName: sizeName,
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
      return swalError("Validation Error", "Order must have at least one product.");
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
            address: data.address,
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
      {/* Header */}
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
              <span className="bg-indigo-600/10 text-indigo-600 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                Edit Order
              </span>
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
        {/* Workspace */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="rounded-[3rem] border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                 <Truck size={16} className="text-indigo-600" /> Products in Order
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <OrderItemsEditor
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />

              <div className="mt-10 pt-10 border-t border-border">
                <OrderProductSearch
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  products={allProducts}
                  onAddItem={handleAddItem}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logistics */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="rounded-[3rem] border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground flex items-center gap-3">
                 <Truck size={16} className="text-indigo-600" /> Shipping Address
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <OrderShippingForm
                register={register}
                errors={errors}
              />
            </CardContent>
          </Card>

          <OrderSummaryCard
            mode="edit"
            subtotal={items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
            total={items.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
            register={register}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
