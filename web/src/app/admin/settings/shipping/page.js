"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Save, Info, Plus, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { swalToast, swalError } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ShippingSettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    couriers: []
  });

  const [newCourier, setNewCourier] = useState({
    name: "",
    charge: "",
    estimatedDays: ""
  });

  useEffect(() => {
    if (settings?.shipping) {
      setFormData({
        couriers: settings.shipping.couriers || []
      });
    }
  }, [settings]);

  const handleAddCourier = () => {
    if (!newCourier.name.trim() || !newCourier.charge) {
      swalToast("Courier Name and Charge are required", "error");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      couriers: [
        ...(prev.couriers || []),
        {
          name: newCourier.name.trim(),
          charge: Number(newCourier.charge),
          estimatedDays: newCourier.estimatedDays.trim() || "Standard Delivery",
          isActive: true
        }
      ]
    }));

    setNewCourier({ name: "", charge: "", estimatedDays: "" });
    swalToast("Courier added to batch list", "success");
  };

  const handleToggleCourier = (index) => {
    setFormData(prev => {
      const list = [...(prev.couriers || [])];
      list[index] = { ...list[index], isActive: !list[index].isActive };
      return { ...prev, couriers: list };
    });
  };

  const handleDeleteCourier = (index) => {
    setFormData(prev => {
      const list = [...(prev.couriers || [])];
      list.splice(index, 1);
      return { ...prev, couriers: list };
    });
    swalToast("Courier removed from batch list", "success");
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        shipping: formData,
      });
    } catch (error) {
      // Error alerts are automatically managed by the hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Custom Courier Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-border/80 dark:border-border/10 bg-card rounded-[2.5rem] shadow-2xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 space-y-10">
              
              {/* Input Agency Form */}
              <div className="p-6 sm:p-8 rounded-[2rem] bg-accent/20 border border-slate-200 dark:border-border/10 space-y-6">
                <h3 className="text-sm font-bold text-accent-secondary">Add Courier</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground ml-1">Courier Name</Label>
                    <Input
                      placeholder="e.g. Steadfast Courier"
                      value={newCourier.name}
                      onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                      className="h-12 px-4 rounded-xl bg-background border border-slate-300 dark:border-border/40 font-bold text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground ml-1">Delivery Charge (BDT)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 120"
                      value={newCourier.charge}
                      onChange={(e) => setNewCourier({ ...newCourier, charge: e.target.value })}
                      className="h-12 px-4 rounded-xl bg-background border border-slate-300 dark:border-border/40 font-bold text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground ml-1">Est. Transit Duration</Label>
                    <Input
                      placeholder="e.g. 2-3 Days"
                      value={newCourier.estimatedDays}
                      onChange={(e) => setNewCourier({ ...newCourier, estimatedDays: e.target.value })}
                      className="h-12 px-4 rounded-xl bg-background border border-slate-300 dark:border-border/40 font-bold text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={handleAddCourier}
                    className="h-12 px-6 rounded-xl bg-accent-secondary text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-foreground hover:text-background transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Courier
                  </Button>
                </div>
              </div>

              {/* Courier Batch List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground ml-1">Couriers List</h3>
                
                {(!formData.couriers || formData.couriers.length === 0) ? (
                  <div className="text-center py-12 rounded-[2rem] border-2 border-dashed border-border/10 bg-accent/5">
                    <p className="text-xs font-bold text-muted-foreground italic">No custom couriers added yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Add couriers above to offer shipping choices at checkout.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {formData.couriers.map((courier, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-5 rounded-[2rem] bg-accent/10 border border-slate-200 dark:border-border/10 hover:border-accent-secondary/30 transition-all shadow-sm"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-foreground">{courier.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/80">BDT {courier.charge} • <span className="italic">{courier.estimatedDays}</span></p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Active Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleCourier(index)}
                              className={`p-2 rounded-xl transition-all duration-300 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                                courier.isActive 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {courier.isActive ? (
                                <>
                                  <ShieldCheck size={14} /> Active
                                </>
                              ) : (
                                <>
                                  <ShieldAlert size={14} /> Inactive
                                </>
                              )}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCourier(index)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border border-border/80 dark:border-border/10 bg-card rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 flex items-center justify-center text-accent-secondary shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground">Custom Courier Config</h4>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">
                  Add courier methods, define pricing, and toggle status. These options populate the checkout selector dynamically.
                </p>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full h-20 rounded-[2.5rem] bg-foreground text-background font-bold uppercase tracking-wider text-xs shadow-2xl hover:bg-accent-secondary hover:text-white transition-all duration-300 active:scale-95 group"
          >
            {isUpdating ? (
              <div className="w-6 h-6 border-4 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20} className="mr-3 group-hover:scale-125 transition-transform" />
                Save Settings
              </>
            )}
          </Button>
        </div>

      </div>
    </motion.div>
  );
}
