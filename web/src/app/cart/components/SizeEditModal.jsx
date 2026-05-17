import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import api from "@/lib/api";
import { useProductStore } from "@/store/productStore";
import { swalToast } from "@/utils/swal";

export default function SizeEditModal({ isOpen, onClose, item, isAuth, t }) {
  const { changeItemSize } = useProductStore();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && item) {
      setIsLoading(true);
      api.get(`/products/${item.product._id}`)
        .then(res => {
          setProductData(res.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSizeSelect = async (newSizeId, newSizeName) => {
    const sId = typeof newSizeId === 'object' ? newSizeId._id : newSizeId;
    await changeItemSize(item.product._id, item.size._id, sId, newSizeName, isAuth);
    onClose();
    swalToast(t.attributeRecalibrated || "Attribute Re-calibrated", "success");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/60 backdrop-blur-2xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-10 sm:p-14 space-y-10">
            <div className="space-y-3 text-center">
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-[0.4em] border-accent-secondary/30 text-accent-secondary bg-accent-secondary/5 mb-4">
                 {t.manifest || "Update Item"}
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-gradient leading-none">
                {t.modifyAttribute || "Adjust Size"}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                {t.recalibrating || "Optimizing"} {item.product.name}
              </p>
            </div>

            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader size="small" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {productData?.sizes?.map((s) => {
                  const sId = s.size?._id || s.size;
                  const sName = s.size?.name || "Standard";
                  const isSelected = String(item.size._id || item.size) === String(sId);
                  
                  return (
                    <button
                      key={sId}
                      type="button"
                      disabled={s.stock <= 0}
                      onClick={() => handleSizeSelect(sId, sName)}
                      className={cn(
                        "group relative h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden",
                        isSelected
                          ? "border-accent-secondary bg-accent-secondary text-white shadow-lg shadow-accent-secondary/20" 
                          : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20",
                        s.stock <= 0 && "opacity-20 cursor-not-allowed grayscale"
                      )}
                    >
                      <span className="text-sm font-black uppercase tracking-widest italic">{sName}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Check size={10} className="text-white opacity-50" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-6">
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 text-muted-foreground transition-all"
              >
                {t.abortModification || "Cancel"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
