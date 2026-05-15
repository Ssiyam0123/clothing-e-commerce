"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Settings2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/admin/FormInput";
import { cn } from "@/lib/utils";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    paymentOptions: {
      cod: true,
      online: true,
      bkash: true,
    },
    payment: {
      sslStoreId: "",
      sslStorePassword: "",
      sslIsTest: true,
      bkashAppKey: "",
      bkashAppSecret: "",
      bkashUsername: "",
      bkashPassword: "",
      bkashIsTest: true,
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data) {
          setFormData({
            paymentOptions: data.paymentOptions || formData.paymentOptions,
            payment: data.payment || formData.payment,
          });
        }
      } catch (error) {
        toast.error("Failed to load payment settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("paymentOptions", JSON.stringify(formData.paymentOptions));
      payload.append("payment", JSON.stringify(formData.payment));

      await api.put("/settings", payload);
      toast.success("Payment settings updated!");
    } catch (error) {
      toast.error("Failed to update payment settings.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;

  return (
    <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <CardContent className="p-6 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <section className="space-y-10">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Payment Methods</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2">Turn on or off your payment options</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { id: "cod", label: "Cash On Delivery", desc: "Pay when you get product" },
                { id: "online", label: "Online Payment", desc: "Cards, Mobile Banking" },
                { id: "bkash", label: "bKash Direct", desc: "Instant mobile payment" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    paymentOptions: { 
                      ...formData.paymentOptions, 
                      [option.id]: !formData.paymentOptions[option.id] 
                    }
                  })}
                  className={cn(
                    "group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left overflow-hidden",
                    formData.paymentOptions?.[option.id]
                      ? "border-emerald-500/50 bg-emerald-500/5 shadow-2xl"
                      : "border-border/5 hover:border-border/20 bg-muted/20 opacity-40 hover:opacity-100"
                  )}
                >
                   <div className="flex flex-col gap-4 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        formData.paymentOptions?.[option.id] ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      )}>
                         <Settings2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">{option.label}</h3>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{option.desc}</p>
                      </div>
                   </div>
                   {formData.paymentOptions?.[option.id] && (
                     <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                   )}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-12 pt-16 border-t border-border/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest italic text-primary">SSLCommerz Settings</h3>
                  <button 
                    onClick={() => setFormData({...formData, payment: {...formData.payment, sslIsTest: !formData.payment?.sslIsTest}})}
                    className={cn("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", formData.payment?.sslIsTest ? "bg-orange-500/20 text-orange-500" : "bg-emerald-500/20 text-emerald-500")}
                  >
                    {formData.payment?.sslIsTest ? "Sandbox" : "Live"}
                  </button>
                </div>
                <FormInput
                  label="Store ID"
                  name="sslStoreId"
                  register={() => ({})}
                  value={formData.payment.sslStoreId}
                  onChange={(e) => setFormData({...formData, payment: {...formData.payment, sslStoreId: e.target.value}})}
                  errors={{}}
                  placeholder="Store ID"
                />
                <FormInput
                  label="Store Password"
                  name="sslStorePassword"
                  register={() => ({})}
                  value={formData.payment.sslStorePassword}
                  onChange={(e) => setFormData({...formData, payment: {...formData.payment, sslStorePassword: e.target.value}})}
                  errors={{}}
                  placeholder="Store Password"
                />
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest italic text-primary">bKash Settings</h3>
                  <button 
                    onClick={() => setFormData({...formData, payment: {...formData.payment, bkashIsTest: !formData.payment?.bkashIsTest}})}
                    className={cn("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all", formData.payment?.bkashIsTest ? "bg-orange-500/20 text-orange-500" : "bg-emerald-500/20 text-emerald-500")}
                  >
                    {formData.payment?.bkashIsTest ? "Sandbox" : "Live"}
                  </button>
                </div>
                <FormInput
                  label="App Key"
                  name="bkashAppKey"
                  register={() => ({})}
                  value={formData.payment.bkashAppKey}
                  onChange={(e) => setFormData({...formData, payment: {...formData.payment, bkashAppKey: e.target.value}})}
                  errors={{}}
                />
                <FormInput
                  label="App Secret"
                  name="bkashAppSecret"
                  register={() => ({})}
                  value={formData.payment.bkashAppSecret}
                  onChange={(e) => setFormData({...formData, payment: {...formData.payment, bkashAppSecret: e.target.value}})}
                  errors={{}}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Username"
                    name="bkashUsername"
                    register={() => ({})}
                    value={formData.payment.bkashUsername}
                    onChange={(e) => setFormData({...formData, payment: {...formData.payment, bkashUsername: e.target.value}})}
                    errors={{}}
                  />
                  <FormInput
                    label="Password"
                    name="bkashPassword"
                    register={() => ({})}
                    value={formData.payment.bkashPassword}
                    onChange={(e) => setFormData({...formData, payment: {...formData.payment, bkashPassword: e.target.value}})}
                    errors={{}}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="pt-16 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", loading && "animate-pulse")} />
              {loading ? "Updating Payments..." : "Save Payment Options"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
