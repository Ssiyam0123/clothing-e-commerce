"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminOrders } from "@/app/admin/orders/lib/useAdminOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft,
  Package,
  ShoppingBag,
  User as UserIcon,
  Truck,
  CreditCard,
  BadgePercent
} from "lucide-react";
import { cn } from "@/lib/utils";

// Reusable Components
import OrderItemsEditor from "@/app/admin/orders/components/OrderItemsEditor";
import OrderProductSearch from "@/app/admin/orders/components/OrderProductSearch";
import OrderShippingForm from "@/app/admin/orders/components/OrderShippingForm";
import OrderSummaryCard from "@/app/admin/orders/components/OrderSummaryCard";

export default function CreateAdminOrder() {
  const router = useRouter();
  const { createAdminOrder, isCreating: isCreatingAdminOrder, searchAdminProducts, searchAdminUsers } = useAdminOrders();
  
  // Set page title dynamically
  useEffect(() => {
    document.title = "Create Order | Vanguard Admin";
  }, []);

  // 🛒 Items State
  const [items, setItems] = useState([]);
  const [productSearch, setProductSearch] = useState("");

  // 👤 Customer State
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // 🚚 Logistics State
  const [shippingRegion, setShippingRegion] = useState("dhaka"); // "dhaka", "outside", "custom"
  const [customShippingPrice, setCustomShippingPrice] = useState(60);

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
        const productsList = await searchAdminProducts(productSearch);
        setProducts(productsList);
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
        const usersList = await searchAdminUsers(userSearch);
        setUsers(usersList);
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

  const shippingPrice = useMemo(() => {
    if (shippingRegion === "dhaka") return 60;
    if (shippingRegion === "outside") return 120;
    return Number(customShippingPrice) || 0;
  }, [shippingRegion, customShippingPrice]);
  const total = subtotal + shippingPrice;

  const handleAddItem = (product, size) => {
    const sizeId = typeof size === "object" && size ? size._id : size;
    const sizeName = typeof size === "object" && size ? size.name : size;

    const price = product.discount > 0 
      ? product.price * (1 - product.discount / 100) 
      : product.price;

    const existingIndex = items.findIndex(
      (i) => i.product === product._id && i.size === sizeId
    );

    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      setItems([
        ...items,
        {
          product: product._id,
          name: product.name,
          image: product.images?.[0],
          size: sizeId,
          sizeName: sizeName,
          quantity: 1,
          price
        },
      ]);
    }
    setProductSearch("");
  };

  const handleUpdateQuantity = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + delta);
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const shippingAddress = isGuest ? {
      ...guestDetails,
    } : {
      name: selectedUser.name,
      email: selectedUser.email,
      phone: guestDetails.phone,
      address: guestDetails.address,
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
      {/* Navigation */}
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
        
        {/* Workspace */}
        <div className="lg:col-span-2 space-y-10">
          {/* Reusable Product Search Component */}
          <div className="admin-table-form !overflow-visible p-8 space-y-8 relative z-[30]">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Package size={16} className="text-primary" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Select Product</h3>
            </div>

            <OrderProductSearch
              searchTerm={productSearch}
              onSearchChange={setProductSearch}
              products={products}
              onAddItem={handleAddItem}
              isSearching={isSearchingProducts}
            />
          </div>

          {/* Reusable Order Items Workspace Component */}
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
            
            <div className="p-8">
              <OrderItemsEditor
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>

        {/* Customer & Settlement */}
        <div className="space-y-10">
          
          {/* Identity */}
          <div className="admin-table-form !overflow-visible p-8 space-y-6 relative z-[20]">
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
                className={cn("flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !isGuest ? "bg-background shadow-lg text-foreground" : "text-muted-foreground opacity-50")}
              >Member</button>
              <button 
                type="button"
                onClick={() => setIsGuest(true)}
                className={cn("flex-1 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", isGuest ? "bg-background shadow-lg text-foreground" : "text-muted-foreground opacity-50")}
              >Guest</button>
            </div>

            {!isGuest && (
               <div className="relative">
                 <div className="relative">
                  <ChevronLeft className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground rotate-180" size={16} />
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/20 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-3xl">
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
                              address: "",
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
            )}

            {/* Reusable Shipping Form Component */}
            <OrderShippingForm
              values={guestDetails}
              onChange={(field, val) => setGuestDetails(prev => ({ ...prev, [field]: val }))}
            />
          </div>

          {/* Logistics */}
          <div className="admin-table-form p-8 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Truck size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Shipping Protocol</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Shipping Region</label>
                <select 
                  value={shippingRegion}
                  onChange={(e) => setShippingRegion(e.target.value)}
                  className="w-full bg-background/50 border border-border/10 rounded-xl h-14 px-4 text-[11px] font-bold uppercase tracking-widest outline-none appearance-none"
                >
                  <option value="dhaka">Inside Dhaka (৳60)</option>
                  <option value="outside">Outside Dhaka (৳120)</option>
                  <option value="custom">Custom shipping charge</option>
                </select>
              </div>

              {shippingRegion === "custom" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">Custom Shipping Charge (৳)</label>
                  <Input 
                    type="number"
                    min="0"
                    placeholder="Enter Charge Amount"
                    value={customShippingPrice}
                    onChange={e => setCustomShippingPrice(e.target.value)}
                    className="bg-background/50 border-border/10 rounded-xl h-14 text-[11px] font-bold uppercase tracking-widest border-emerald-500/20"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settlement Summary */}
          <OrderSummaryCard
            mode="create"
            subtotal={subtotal}
            shippingPrice={shippingPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            total={total}
            isDisabled={items.length === 0}
            isSubmitting={isCreatingAdminOrder}
          />

        </div>
      </form>
    </div>
  );
}
