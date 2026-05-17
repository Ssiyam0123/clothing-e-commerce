"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError, swalConfirm } from "@/utils/swal";
import { useProductReviews } from "../lib/useProductReviews";

export default function ManageReviewsTab({ product, setProduct, patchProduct }) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    reviews,
    totalReviews,
    totalPages,
    isLoading: reviewsLoading,
    deleteReview
  } = useProductReviews(product?._id, page, limit);

  const handleDeleteReview = async (reviewId) => {
    const confirmed = await swalConfirm("Delete Review?", "This rating will be permanently removed.");
    if (!confirmed) return;

    try {
      await deleteReview(reviewId);
      swalToast("Review deleted", "success");
      
      const isLastItemOnPage = reviews.length === 1;
      if (isLastItemOnPage && page > 1) {
        setPage(p => p - 1);
      }
    } catch (err) {
      swalError("Error", err.message);
    }
  };

  const handleToggleReviews = async () => {
    try {
      const showReviews = product.showReviews === false;
      await patchProduct({ id: product._id, data: { showReviews } });
      setProduct(prev => ({ ...prev, showReviews }));
      swalToast("Reviews toggle updated", "success");
    } catch (err) {
      swalError("Failed", err.message);
    }
  };

  return (
    <div className="admin-table-form p-8 md:p-14 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
            <MessageSquare size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Customer Reviews</h3>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             type="button" 
             onClick={handleToggleReviews}
             className="h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest border border-border"
             variant="outline"
           >
             {product.showReviews === false ? "Enable Review Module" : "Disable Review Module"}
           </Button>
        </div>
      </div>

      {reviewsLoading ? (
         <div className="flex justify-center p-20"><Loader /></div>
      ) : reviews.length === 0 ? (
         <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
            <MessageSquare size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">No reviews submitted for this product yet.</p>
         </div>
      ) : (
         <div className="space-y-8 pt-6 border-t border-border/5">
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review._id} className="bg-muted/15 border border-border/5 rounded-3xl p-8 flex flex-col md:flex-row justify-between gap-6 hover:bg-muted/20 transition-all duration-300">
                   <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-full bg-muted border border-border/10 overflow-hidden">
                            <img src={getImageUrl(review.user?.avatar)} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase leading-none mb-1">{review.user?.name}</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-1">
                         {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                               key={star} 
                               size={14} 
                               className={cn(star <= review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground opacity-30")} 
                            />
                         ))}
                      </div>

                      <p className="text-xs font-medium text-foreground leading-relaxed max-w-2xl">{review.comment}</p>
                   </div>

                   <div className="flex items-start justify-end">
                      <Button 
                         onClick={() => handleDeleteReview(review._id)}
                         variant="destructive"
                         className="h-10 w-10 rounded-xl p-0 flex items-center justify-center"
                         title="Delete Review Permanently"
                      >
                         <Trash2 size={16} />
                      </Button>
                   </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pt-8 border-t border-border/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Showing {Math.min(totalReviews, (page - 1) * limit + 1)}-{Math.min(totalReviews, page * limit)} of {totalReviews} Reviews
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border/5 hover:bg-muted/10"
                    variant="outline"
                  >
                    <ChevronLeft size={14} className="mr-1" /> Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <Button
                        key={pNum}
                        type="button"
                        onClick={() => setPage(pNum)}
                        className={cn(
                          "h-10 w-10 rounded-xl text-[9px] font-black p-0 transition-all duration-300",
                          page === pNum 
                            ? "bg-foreground text-background scale-105" 
                            : "border border-border/5 text-muted-foreground hover:text-foreground hover:bg-muted/10"
                        )}
                        variant={page === pNum ? "default" : "outline"}
                      >
                        {pNum}
                      </Button>
                    );
                  })}

                  <Button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border/5 hover:bg-muted/10"
                    variant="outline"
                  >
                    Next <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
         </div>
      )}
    </div>
  );
}
