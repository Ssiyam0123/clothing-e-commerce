import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import api from "@/lib/api";
import { useProductStore } from "@/store/productStore";
import { swalToast } from "@/utils/swal";

export default function SizeEditModal({ isOpen, onClose, item, isAuth, t }) {
  const { changeItemSize } = useProductStore();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [prevItem, setPrevItem] = useState(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  if (item !== prevItem || isOpen !== prevIsOpen) {
    setPrevItem(item);
    setPrevIsOpen(isOpen);
    if (isOpen && item && item.size) {
      setSelectedSize({
        _id: item.size._id || item.size,
        name: item.size.name || "Standard"
      });
      setIsLoading(true);
    } else {
      setSelectedSize(null);
    }
  }

  useEffect(() => {
    if (isOpen && item) {
      api.get(`/products/${item.product._id}`)
        .then(res => {
          setProductData(res.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, item]);

  const discountedPrice = useMemo(() => {
    if (!productData) return 0;
    return productData.price - (productData.price * (productData.discount || 0)) / 100;
  }, [productData]);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!selectedSize) return;
    await changeItemSize(item.product._id, item.size._id, selectedSize._id, selectedSize.name, isAuth);
    onClose();
    swalToast(t.attributeRecalibrated || "Attribute Re-calibrated", "success");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="quick-select-modal-container">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="quick-select-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Product Title */}
            <div className="pr-8">
              <h4 className="quick-select-title">
                {item.product.name}
              </h4>
            </div>

            {isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader size="small" />
              </div>
            ) : (
              <>
                {/* Price Info */}
                <div className="flex flex-col">
                  <span className="quick-select-price-label">
                    {t.price || "Price"}
                  </span>
                  <span className="quick-select-price-val">
                    {discountedPrice.toFixed(0)} BDT
                  </span>
                </div>

                {/* Size Section */}
                <div className="flex flex-col gap-2">
                  <span className="quick-select-size-label">
                    Select New Size
                  </span>
                  <div className="flex flex-wrap gap-2.5 mt-1">
                    {productData?.sizes?.map((s, index) => {
                      const sId = s.size?._id || s.size;
                      const sName = s.size?.name || "Standard";
                      const outOfStock = s.stock <= 0;
                      const isSelected = selectedSize?._id === sId;

                      return (
                        <button
                          key={sId || index}
                          type="button"
                          disabled={outOfStock}
                          onClick={() => setSelectedSize({ _id: sId, name: sName })}
                          className={cn(
                            "quick-select-size-btn",
                            isSelected && "quick-select-size-btn-active",
                            outOfStock && "quick-select-size-btn-disabled"
                          )}
                        >
                          {sName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Update Button */}
                <div className="mt-4">
                  <button
                    onClick={handleUpdate}
                    className="quick-select-buy-btn"
                  >
                    {t.modifyAttribute || "Update Size"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
  );
}
