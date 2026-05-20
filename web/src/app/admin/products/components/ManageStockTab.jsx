"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { swalToast, swalError } from "@/utils/swal";

export default function ManageStockTab({ product, filteredSizes, updateProduct }) {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (product) {
      const stockObj = {};
      product.sizes?.forEach(item => {
        stockObj[item.size._id || item.size] = item.stock;
      });
      setValue("sizes", stockObj);
      setValue("sku", product.sku || "");
    }
  }, [product, setValue]);

  const onStockSubmit = async (data) => {
    try {
      const sizesArray = [];
      if (data.sizes && typeof data.sizes === "object") {
        for (const [sizeId, stock] of Object.entries(data.sizes)) {
          if (stock !== undefined && stock !== "") {
            sizesArray.push({ size: sizeId, stock: parseInt(stock) || 0 });
          }
        }
      }
      await updateProduct({ 
        id: product._id, 
        data: { 
          sizes: sizesArray,
          sku: data.sku 
        } 
      });
      swalToast("Stock levels and SKU updated", "success");
    } catch (err) {
      swalError("Error", err.message);
    }
  };

  const handleAutoGenerateSku = () => {
    if (!product?.name) return;
    const cleanName = product.name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .toUpperCase();
    const words = cleanName.split(/\s+/);
    let prefix = "";
    if (words.length >= 2) {
      prefix = words.map(w => w[0]).join("").slice(0, 5);
    } else {
      prefix = words[0].slice(0, 5);
    }
    let brandPrefix = "";
    if (product.brand) {
      brandPrefix = product.brand.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 3) + "-";
    }
    const idSuffix = product._id ? product._id.slice(-4).toUpperCase() : Math.floor(1000 + Math.random() * 9000);
    const generatedSku = `${brandPrefix}${prefix}-${idSuffix}`;
    setValue("sku", generatedSku, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onStockSubmit)} className="p-0 space-y-12">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
          <Package size={20} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Sizes & Inventory Stock</h3>
      </div>

      <div className="max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
            Stock Keeping Unit (SKU)
          </label>
          <button
            type="button"
            onClick={handleAutoGenerateSku}
            className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors font-bold cursor-pointer"
          >
            Auto-Generate
          </button>
        </div>
        <Input 
          type="text"
          placeholder="e.g. VNG-TEE-BLK-L"
          {...register("sku")}
          className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 font-bold focus:ring-2 focus:ring-indigo-600/20"
        />
      </div>

      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
          Size Inventory Stock Levels
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {filteredSizes.map(size => (
            <div key={size._id} className="bg-muted/20 border border-border/5 rounded-3xl p-6 transition-all hover:bg-muted/30">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center mb-4">{size.name}</p>
              <Input 
                type="number"
                min={0}
                {...register(`sizes.${size._id}`, { valueAsNumber: true })}
                className="h-12 bg-background border-border/10 rounded-xl text-center font-black text-lg focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-border/5 flex justify-end">
        <Button type="submit" className="h-16 px-10 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">
          Save Stock levels
        </Button>
      </div>
    </form>
  );
}
