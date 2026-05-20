"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Trash2, Upload, Plus, X } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import { swalToast, swalError, swalConfirm } from "@/utils/swal";


export default function ManageImagesTab({ product, updateProduct, setProduct }) {
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync existing images when product changes
  useEffect(() => {
    if (product?.images) {
      setExistingImages(product.images);
    } else {
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setNewPreviews([]);
  }, [product]);

  // Handle file selections
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Filter duplicates
    const selectedFiles = [];
    const previews = [];

    files.forEach((file) => {
      // Avoid adding duplicate files by name/size
      if (!newImageFiles.some(f => f.name === file.name && f.size === file.size)) {
        selectedFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    setNewImageFiles(prev => [...prev, ...selectedFiles]);
    setNewPreviews(prev => [...prev, ...previews]);
  };

  // Remove a newly selected image preview before uploading
  const handleRemoveNewPreview = (index) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Mark an existing image for deletion (locally first)
  const handleRemoveExistingImage = (imgUrl) => {
    setExistingImages(prev => prev.filter(img => img !== imgUrl));
  };

  // Handle Form Submission to save images
  const onImagesSubmit = async (e) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && newImageFiles.length === 0) {
      swalError("Validation Error", "A product must have at least one image.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    
    // Add existing preserved images
    formData.append("images", JSON.stringify(existingImages));
    
    // Add new files
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const data = await updateProduct({ id: product._id, data: formData });
      
      // Update local state and parent state
      if (setProduct) {
        setProduct(prev => ({ ...prev, images: data.images }));
      }
      
      setNewImageFiles([]);
      setNewPreviews([]);
      swalToast("Product gallery updated successfully", "success");
    } catch (err) {
      console.error(err);
      swalError("Save Failed", err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onImagesSubmit} className="p-0 space-y-12">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
            <ImageIcon size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Product Image Gallery</h3>
        </div>
      </div>

      <div className="space-y-10">
        {/* Gallery Grid */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
            Current Active Gallery Images ({existingImages.length})
          </label>
          {existingImages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-border/20 bg-muted/5 opacity-50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">No images in the active gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {existingImages.map((imgUrl, index) => (
                <div key={imgUrl} className="group relative aspect-square rounded-[1.5rem] overflow-hidden border border-border bg-muted/20 hover:scale-102 hover:shadow-lg transition-all duration-300">
                  <img 
                    src={getImageUrl(imgUrl)} 
                    alt={`Product image ${index + 1}`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveExistingImage(imgUrl)}
                      className="h-10 w-10 rounded-xl p-0 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                      title="Remove Image"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                    <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">
                      {index === 0 ? "Cover" : `Image ${index + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload New Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Uploader Box */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
              Add New Images (Max 2MB per image)
            </label>
            <label className="min-h-[220px] rounded-[2rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-600/30 hover:bg-indigo-600/5 transition-all group">
              <Upload size={32} className="text-muted-foreground group-hover:text-indigo-600 transition-colors mb-3" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-indigo-600">
                Drag and Drop or Browse
              </span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>

          {/* New Previews list */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
              Queue to Upload ({newPreviews.length})
            </label>
            {newPreviews.length === 0 ? (
              <div className="min-h-[220px] p-12 text-center rounded-[2rem] border border-dashed border-border/10 bg-muted/5 flex items-center justify-center opacity-30">
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">No new images selected for upload.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {newPreviews.map((previewUrl, index) => (
                  <div key={previewUrl} className="group relative aspect-square rounded-xl overflow-hidden border border-indigo-600/20 bg-muted/20">
                    <img 
                      src={previewUrl} 
                      alt="Upload preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewPreview(index)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-lg bg-black/60 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-indigo-600 px-2 py-0.5 rounded-md">
                      <p className="text-[6px] font-black text-white uppercase tracking-widest leading-none">New</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-border/5 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="h-16 px-10 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isSubmitting ? "Uploading & Saving..." : "Save Gallery Configuration"}
        </Button>
      </div>
    </form>
  );
}
