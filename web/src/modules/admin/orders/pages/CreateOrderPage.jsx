"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminOrders } from "../lib/useAdminOrders";
import { useProducts } from "@/modules/client/common/lib/useProducts";
import { useUsers } from "@/modules/client/auth/lib/useUsers";
import { usePathao } from "@/modules/client/checkout/lib/usePathao";
import { useCoupons } from "@/modules/client/common/lib/useCoupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  Search, 
  User as UserIcon, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  ChevronLeft,
  Package,
  BadgePercent
} from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function CreateAdminOrder() {
  const router = useRouter();
  const { createAdminOrder, isCreating: isCreatingAdminOrder } = useAdminOrders();
  
  // 🛒 Items State
  const [items, setItems] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 👤 Customer State
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
  });

  // 🚚 Logistics State
  const [cityId, setCityId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [areaId, setAreaId] = useState("");
  const { cities, zones, areas } = usePathao(cityId, zoneId);

  // 🎟️ Financials State
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderStatus, setOrderStatus] = useState("Processing");

  // 🔍 Data Fetching
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // Debounced search effect for Products
  useEffect(() => {
    const searchProducts = async () => {
      if (!productSearch) {
        setProducts([]);
        return;
      }
      setIsSearchingProducts(true);
      try {
        const { data } = await api.get("/admin/products", { 
          params: { search: productSearch, limit: 5, isActive: "all" } 
        });
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingProducts(false);
      }
    };

    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Debounced search effect for Users
  useEffect(() => {
    const searchUsers = async () => {
      if (!userSearch || isGuest) {
        setUsers([]);
        return;
      }
      setIsSearchingUsers(true);
      try {
        const { data } = await api.get("/users", { 
          params: { search: userSearch, limit: 5 } 
        });
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearchingUsers(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [userSearch, isGuest]);

  // 🧮 Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  const shippingPrice = cityId === "1" ? 60 : 120;
  const total = subtotal + shippingPrice;

  const addItem = () => {
    if (!selectedProduct || !selectedSize) return;
    
    const existingIndex = items.findIndex(i => i.product === selectedProduct._id && i.size === selectedSize);
    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += quantity;
      setItems(newItems);
    } else {
      const price = selectedProduct.discount > 0 
        ? selectedProduct.price * (1 - selectedProduct.discount / 100) 
        : selectedProduct.price;
        
      setItems([...items, {
        product: selectedProduct._id,
        name: selectedProduct.name,
        image: selectedProduct.images?.[0],
        size: selectedSize,
        quantity,
        price
      }]);
    }
    
    // Reset
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
    setProductSearch("");
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const shippingAddress = isGuest ? {
      ...guestDetails,
      pathao_city_id: cityId,
      pathao_zone_id: zoneId,
      pathao_area_id: areaId,
      city: cities?.find(c => String(c.city_id) === cityId)?.city_name || guestDetails.city
    } : {
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone || "",
      street: guestDetails.street,
      city: cities?.find(c => String(c.city_id) === cityId)?.city_name || "",
      pathao_city_id: cityId,
      pathao_zone_id: zoneId,
      pathao_area_id: areaId,
    };

    const orderData = {
      user: isGuest ? null : selectedUser._id,
      orderItems: items.map(i => ({
        product: i.product,
        size: i.size,
        quantity: i.quantity
      })),
      shippingAddress,
      couponCode,
      paymentMethod,
      orderStatus,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed"
    };

    try {
      const order = await createAdminOrder(orderData);
      router.push(`/admin/orders/${order._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page-container">
      {/* 🔙 Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Back to History</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">Create New <span className="text-muted-foreground/50">Order</span></h1>
          <p className="admin-subtitle text-rose-500/80">Create a manual order for a customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 🛠️ Matrix Core (Left 2/3) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* 🔍 Product Identification */}
          <div className="admin-table-form p-8 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Package size={16} className="text-primary" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Select Product</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Search Product</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search by Name or SKU..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setSelectedProduct(null);
                    }}
                    className="pl-12 bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest"
                  />
                  
                  {productSearch && !selectedProduct && products?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-3xl">
                      {products.map(p => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(p);
                            setProductSearch(p.name);
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors border-b border-border/5 last:border-none"
                        >
                          <img src={getImageUrl(p.images?.[0])} className="w-10 h-10 rounded-lg object-cover grayscale" />
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{p.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground">৳{p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Size</label>
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-background/50 border border-border/10 rounded-xl h-14 px-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="">Select</option>
                    {selectedProduct?.sizes?.filter(s => s.stock > 0).map(s => (
                      <option key={s.size} value={s.size}>{s.size} ({s.stock} Unit)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Quantity</label>
                  <Input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="button"
              onClick={addItem}
              disabled={!selectedProduct || !selectedSize}
              className="w-full h-14 bg-foreground text-background hover:bg-primary hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <Plus size={16} className="mr-2" /> Add to Order
            </Button>
          </div>

          {/* 📋 Manifest Table */}
          <div className="admin-table-form overflow-hidden">
            <div className="p-8 border-b border-border/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <ShoppingBag size={16} className="text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em]">Order Summary</h3>
                </div>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Items: {items.length}
                </span>
              </div>
            </div>
            
            {items.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                <Package size={40} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No items added yet. Search and add products.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border/5">
                    <tr>
                      <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground">Product Details</th>
                      <th className="px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">Variant</th>
                      <th className="px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">Units</th>
                      <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">Unit Price</th>
                      <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</th>
                      <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5">
                    {items.map((item, idx) => (
                      <tr key={`${item.product}-${item.size}`} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <img src={getImageUrl(item.image)} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <span className="text-[11px] font-black uppercase tracking-tight">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="text-[10px] font-bold text-muted-foreground">{item.size}</span>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="text-[11px] font-black">{item.quantity}</span>
                        </td>
                        <td className="px-8 py-4 text-right font-black text-[11px]">৳{item.price}</td>
                        <td className="px-8 py-4 text-right font-black text-[11px]">৳{item.price * item.quantity}</td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            type="button" 
                            onClick={() => removeItem(idx)}
                            className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 🛰️ Logistics & Summary (Right 1/3) */}
        <div className="space-y-10">
          
          {/* 👤 Identity Framework */}
          <div className="admin-table-form p-8 space-y-6">
             <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <UserIcon size={16} className="text-indigo-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Customer Info</h3>
            </div>

            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              <button 
                type="button"
                onClick={() => setIsGuest(false)}
                className={cn("flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !isGuest ? "bg-background shadow-lg" : "text-muted-foreground opacity-50")}
              >Member</button>
              <button 
                type="button"
                onClick={() => setIsGuest(true)}
                className={cn("flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", isGuest ? "bg-background shadow-lg" : "text-muted-foreground opacity-50")}
              >Guest</button>
            </div>

            {!isGuest ? (
               <div className="relative">
                 <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search for a customer..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setSelectedUser(null);
                    }}
                    className="pl-12 bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest"
                  />
                  {userSearch && !selectedUser && users?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/20 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-3xl">
                      {users.map(u => (
                        <button
                          key={u._id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setUserSearch(u.name);
                            setGuestDetails({
                              name: u.name,
                              email: u.email,
                              phone: u.phone || "",
                              street: "",
                              city: ""
                            });
                          }}
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted transition-colors text-left border-b border-border/5 last:border-none"
                        >
                          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-[10px] font-black text-background">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-tight mb-1">{u.name}</p>
                            <p className="text-[8px] font-bold text-muted-foreground">{u.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
               </div>
            ) : (
              <div className="space-y-4">
                <Input 
                  placeholder="Full Name"
                  value={guestDetails.name}
                  onChange={e => setGuestDetails({...guestDetails, name: e.target.value})}
                  className="bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest"
                />
                 <Input 
                  placeholder="Email Address"
                  value={guestDetails.email}
                  onChange={e => setGuestDetails({...guestDetails, email: e.target.value})}
                  className="bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest"
                />
              </div>
            )}

             <Input 
              placeholder="Phone Number"
              value={guestDetails.phone}
              onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})}
              className="bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest border-indigo-500/20"
            />
          </div>

          {/* 🚚 Shipping Protocol */}
          <div className="admin-table-form p-8 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Truck size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Shipping Address</h3>
            </div>

             <textarea 
              placeholder="Street Address / Landmark"
              value={guestDetails.street}
              onChange={e => setGuestDetails({...guestDetails, street: e.target.value})}
              className="w-full bg-background/50 border border-border/10 rounded-xl p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-emerald-500/50 transition-all min-h-[100px] resize-none"
            />

            <div className="space-y-4">
              <select 
                value={cityId}
                onChange={(e) => {
                  setCityId(e.target.value);
                  setZoneId("");
                  setAreaId("");
                }}
                className="w-full bg-background/50 border border-border/10 rounded-xl h-14 px-4 text-[11px] font-bold uppercase tracking-widest outline-none appearance-none"
              >
                <option value="">Select City</option>
                {cities?.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
              </select>

              <select 
                value={zoneId}
                onChange={(e) => {
                  setZoneId(e.target.value);
                  setAreaId("");
                }}
                disabled={!cityId}
                className="w-full bg-background/50 border border-border/10 rounded-xl h-14 px-4 text-[11px] font-bold uppercase tracking-widest outline-none appearance-none disabled:opacity-30"
              >
                <option value="">Select Zone</option>
                {zones?.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
              </select>

              <select 
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                disabled={!zoneId}
                className="w-full bg-background/50 border border-border/10 rounded-xl h-14 px-4 text-[11px] font-bold uppercase tracking-widest outline-none appearance-none disabled:opacity-30"
              >
                <option value="">Select Area</option>
                {areas?.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
              </select>
            </div>
          </div>

          {/* 💰 Settlement Summary */}
          <div className="admin-table-form p-8 space-y-8 bg-foreground text-background">
             <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-background/10 flex items-center justify-center border border-background/20">
                <CreditCard size={16} className="text-background" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Order Total</h3>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
               <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>Delivery Charge</span>
                <span>+ ৳{shippingPrice}</span>
              </div>
              
              <div className="relative group">
                 <BadgePercent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-background/40" />
                <input 
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-full bg-background/5 border border-background/10 rounded-xl h-12 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-background/30 placeholder:text-background/30 transition-all"
                />
              </div>

              <div className="h-px bg-background/10 my-6" />

              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Grand Total</span>
                <span className="text-3xl font-black tracking-tighter">৳{total}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <select 
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full bg-background/5 border border-background/10 rounded-xl h-14 px-4 text-[10px] font-black uppercase tracking-widest outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Paid">Prepaid / Manual Sync</option>
              </select>

               <Button 
                type="submit"
                disabled={items.length === 0 || isCreatingAdminOrder}
                className="w-full h-16 bg-background text-foreground hover:bg-rose-600 hover:text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95"
              >
                {isCreatingAdminOrder ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
