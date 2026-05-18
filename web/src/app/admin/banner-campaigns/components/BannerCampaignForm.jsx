"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/utils/imageUtils";
import { swalError } from "@/utils/swal";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  FileImage,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function BannerCampaignForm({ 
  formData, 
  setFormData, 
  slideFiles, 
  setSlideFiles, 
  isEdit, 
  isSaving, 
  onSubmit 
}) {
  const router = useRouter();

  const updateSlide = (slideId, field, value) => {
    const newSlides = formData.slides.map((slide) => {
      if ((slide._id || slide.tempId) === slideId)
        return { ...slide, [field]: value };
      return slide;
    });
    setFormData({ ...formData, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide = {
      tempId: 'new-' + Date.now(),
      title: "",
      subtitle: "",
      link: "",
      image: "",
      order: formData.slides.length
    };
    setFormData(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
  };

  const removeSlide = (slideId) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter(s => (s._id || s.tempId) !== slideId)
    }));
  };

  const handleSlideImage = (slideId, file) => {
    const previewUrl = URL.createObjectURL(file);
    const oldPreview = formData.slides.find(
      (s) => (s._id || s.tempId) === slideId,
    )?.image;
    if (oldPreview && oldPreview.startsWith("blob:"))
      URL.revokeObjectURL(oldPreview);

    updateSlide(slideId, "image", previewUrl);
    setSlideFiles({ ...slideFiles, [slideId]: file });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      {/* Core Metadata */}
      <div className="admin-table-form p-8 md:p-12 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
            <Layers size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">Banner Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Banner Name *</label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Summer Sale 2024"
              required
              className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this banner about?"
              className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/20 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Artifact */}
      <div className="space-y-8">
        <div className="px-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <FileImage size={18} className="text-muted-foreground" /> Banner Slides
            </h3>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Add one or more images for this campaign</p>
          </div>
          <Button 
            type="button" 
            onClick={addSlide}
            className="rounded-xl px-6 font-black text-[9px] uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
          >
            <Plus size={14} className="mr-2" /> Add New Slide
          </Button>
        </div>

        {formData.slides.map((slide) => {
          const slideId = slide._id || slide.tempId;
          return (
            <div
              key={slideId}
              className="admin-table-form group hover:border-indigo-600/20 transition-all p-8 md:p-10 relative"
            >
              {formData.slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlide(slideId)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Media Hub */}
                <div className="lg:col-span-5">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] block mb-4">Main Image *</label>
                  <div className="relative aspect-[16/9] lg:aspect-video rounded-[2rem] overflow-hidden border-2 border-dashed border-border/10 bg-muted/20 group/upload hover:border-indigo-600/30 transition-all cursor-pointer flex flex-col items-center justify-center">
                    {slide.image ? (
                      <>
                        <img
                          src={slide.image.startsWith("blob:") ? slide.image : getImageUrl(slide.image)}
                          className="w-full h-full object-cover transition-all duration-700"
                          alt="Banner Preview"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-all">
                          <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-30 group-hover/upload:opacity-100 transition-all text-center p-4">
                        <ImageIcon size={40} strokeWidth={1} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Upload 1920x1080 image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleSlideImage(slideId, e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Messaging Meta */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Main Title</label>
                      <Input 
                        value={slide.title || ""}
                        onChange={(e) => updateSlide(slideId, "title", e.target.value)}
                        placeholder="e.g. New Arrivals"
                        className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[11px] font-black uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subtitle</label>
                      <Input 
                        value={slide.subtitle || ""}
                        onChange={(e) => updateSlide(slideId, "subtitle", e.target.value)}
                        placeholder="e.g. Explore the collection"
                        className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[10px] font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Link</label>
                      <Input 
                        value={slide.link || ""}
                        onChange={(e) => updateSlide(slideId, "link", e.target.value)}
                        placeholder="/shop/new-arrivals"
                        className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[11px] font-bold text-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {formData.slides.length === 0 && (
          <div className="admin-table-form py-32 flex flex-col items-center justify-center text-center opacity-30 grayscale">
            <Sparkles size={48} strokeWidth={1} className="mb-6" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">No Banner Image</h4>
            <p className="text-[8px] font-bold uppercase tracking-widest mt-2">Upload an image to create this banner.</p>
          </div>
        )}
      </div>

      {/* 🚀 Submit Protocol */}
      <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-border/5">
        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1 h-20 bg-foreground text-background hover:bg-indigo-600 hover:text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-95 group disabled:opacity-50"
        >
          {isSaving ? "Saving..." : (isEdit ? "Save Changes" : "Create Banner")}
          {!isSaving && <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => router.push("/admin/banner-campaigns")}
          className="flex-1 h-20 rounded-[2rem] border-border/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
