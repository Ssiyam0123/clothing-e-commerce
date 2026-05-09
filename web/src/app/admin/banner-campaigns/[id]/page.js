"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminBannerCampaigns } from "@/hooks/useAdminBannerCampaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import { swalConfirm, swalError, swalToast } from "@/utils/swal";
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Layout, 
  FileImage,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BannerCampaignForm() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { campaigns, isLoading, createCampaign, updateCampaign } =
    useAdminBannerCampaigns();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slides: [],
    isActive: false,
  });
  const [slideFiles, setSlideFiles] = useState({});
  const [loadingForm, setLoadingForm] = useState(isEdit);

  useEffect(() => {
    if (isEdit && campaigns) {
      const campaign = campaigns.find((c) => c._id === id);
      if (campaign) {
        setFormData({
          name: campaign.name,
          description: campaign.description || "",
          slides: campaign.slides.map((s) => ({ ...s, _id: s._id })),
          isActive: campaign.isActive,
        });
        setLoadingForm(false);
      } else if (campaigns) {
        setLoadingForm(false);
      }
    } else {
      setLoadingForm(false);
    }
  }, [isEdit, id, campaigns]);

  const addSlide = () => {
    const newSlide = {
      tempId: Date.now() + "-" + Math.random(),
      title: "",
      subtitle: "",
      link: "",
      image: "",
      order: formData.slides.length,
    };
    setFormData({ ...formData, slides: [...formData.slides, newSlide] });
  };

  const updateSlide = (slideId, field, value) => {
    const newSlides = formData.slides.map((slide) => {
      if ((slide._id || slide.tempId) === slideId)
        return { ...slide, [field]: value };
      return slide;
    });
    setFormData({ ...formData, slides: newSlides });
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

  const removeSlide = async (slideId) => {
    const confirmed = await swalConfirm(
      "Remove Slide?",
      "This slide will be detached from this campaign.",
    );
    if (!confirmed) return;

    const slide = formData.slides.find((s) => (s._id || s.tempId) === slideId);
    if (slide?.image && slide.image.startsWith("blob:"))
      URL.revokeObjectURL(slide.image);

    const newSlides = formData.slides.filter(
      (s) => (s._id || s.tempId) !== slideId,
    );
    setFormData({ ...formData, slides: newSlides });

    const newFiles = { ...slideFiles };
    delete newFiles[slideId];
    setSlideFiles(newFiles);
    swalToast("Slide Removed", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.slides.length === 0) {
      return swalError(
        "Missing Media",
        "Please add at least one slide to launch this campaign.",
      );
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isActive", formData.isActive ? "true" : "false");

    const slidesForJSON = [];
    const filesToSend = [];

    formData.slides.forEach((slide) => {
      const slideId = slide._id || slide.tempId;
      const file = slideFiles[slideId];
      const copy = { ...slide };
      if (file && (!slide.image || slide.image.startsWith("blob:"))) {
        copy.fileId = slideId;
        delete copy.image;
        filesToSend.push(file);
      }
      slidesForJSON.push(copy);
    });

    formDataToSend.append("slides", JSON.stringify(slidesForJSON));
    filesToSend.forEach((file) => formDataToSend.append("slideImages", file));

    try {
      if (isEdit) {
        await updateCampaign({ id, formData: formDataToSend });
        swalToast("Deck Updated", "success");
      } else {
        await createCampaign(formDataToSend);
        swalToast("Campaign Launched", "success");
      }
      setTimeout(() => router.push("/admin/banner-campaigns"), 1500);
    } catch (err) {
      swalError(
        "Sync Error",
        err.response?.data?.message || "Error processing campaign data.",
      );
    }
  };

  if (loadingForm || isLoading)
    return (
      <div className="admin-page-container">
        <Loader />
      </div>
    );

  return (
    <div className="admin-page-container max-w-6xl">
      {/* 🔙 Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Return to Deck</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            {isEdit ? "Configure" : "Initialize"} <span className="text-muted-foreground/30">Deck</span>
          </h1>
          <p className="admin-subtitle">Hero Narrative Orchestration protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Core Metadata */}
        <div className="admin-table-form p-8 md:p-12 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center border border-indigo-600/20">
              <Layers size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Core Deck Meta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Campaign Identity *</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Winter Protocol 2024"
                required
                className="h-16 bg-muted/30 border-border/10 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block ml-1">Deck Narrative</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief tactical overview..."
                className="w-full h-16 bg-muted/30 border border-border/10 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/20 outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 bg-muted/20 p-6 rounded-[2rem] border border-border/5 w-fit">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-6 h-6 rounded-lg border-border/20 text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest">Master Deployment Status</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Set as live homepage narrative deck</p>
            </div>
          </div>
        </div>

        {/* Slide Orchestration */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <FileImage size={18} className="text-muted-foreground" /> Visual Sequence
              </h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Configure individual slide artifacts</p>
            </div>
            <Button
              type="button"
              onClick={addSlide}
              className="h-12 bg-foreground text-background hover:bg-indigo-600 hover:text-white rounded-full px-8 font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <Plus size={16} className="mr-2" /> Add Slide Artifact
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {formData.slides.map((slide, index) => {
              const slideId = slide._id || slide.tempId;
              return (
                <div
                  key={slideId}
                  className="admin-table-form group hover:border-indigo-600/20 transition-all"
                >
                  <div className="p-8 md:p-10 space-y-10">
                    <div className="flex justify-between items-center pb-8 border-b border-border/5">
                      <Badge variant="outline" className="h-8 px-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border-indigo-600/30 text-indigo-600 bg-indigo-600/5">
                        Slot 0{index + 1}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => removeSlide(slideId)}
                        className="w-10 h-10 rounded-full bg-rose-600/5 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-600/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Media Hub */}
                      <div className="lg:col-span-4">
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] block mb-4">Background Media</label>
                        <div className="relative aspect-[16/9] lg:aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed border-border/10 bg-muted/20 group/upload hover:border-indigo-600/30 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden">
                          {slide.image ? (
                            <>
                              <img
                                src={slide.image.startsWith("blob:") ? slide.image : getImageUrl(slide.image)}
                                className="w-full h-full object-cover grayscale group-hover/upload:grayscale-0 transition-all duration-700"
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-all">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">Replace Protocol</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-4 opacity-30 group-hover/upload:opacity-100 transition-all">
                              <ImageIcon size={40} strokeWidth={1} />
                              <span className="text-[9px] font-black uppercase tracking-widest">Inject Asset</span>
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

                      {/* Logical Meta */}
                      <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Headline Text</label>
                            <Input 
                              value={slide.title || ""}
                              onChange={(e) => updateSlide(slideId, "title", e.target.value)}
                              className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[11px] font-black uppercase tracking-widest"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Subheadline</label>
                            <Input 
                              value={slide.subtitle || ""}
                              onChange={(e) => updateSlide(slideId, "subtitle", e.target.value)}
                              className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[10px] font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-2 space-y-3">
                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Action Link (URL)</label>
                            <Input 
                              value={slide.link || ""}
                              onChange={(e) => updateSlide(slideId, "link", e.target.value)}
                              placeholder="/collection/winter"
                              className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[11px] font-bold text-indigo-600"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-1">Sequence Sort</label>
                            <Input 
                              type="number"
                              value={slide.order !== undefined ? slide.order : 0}
                              onChange={(e) => updateSlide(slideId, "order", parseInt(e.target.value) || 0)}
                              className="h-14 bg-muted/30 border-border/5 rounded-xl px-5 text-[11px] font-black text-center"
                            />
                          </div>
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
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Narrative Deck</h4>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-2">Initialize at least one slide artifact to proceed</p>
              </div>
            )}
          </div>
        </div>

        {/* 🚀 Submit Protocol */}
        <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-border/5">
          <Button
            type="submit"
            className="flex-1 h-20 bg-foreground text-background hover:bg-indigo-600 hover:text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-95 group"
          >
            {isEdit ? "Synchronize Configuration" : "Launch Narrative Protocol"}
            <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/banner-campaigns")}
            className="flex-1 h-20 rounded-[2rem] border-border/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all"
          >
            Discard & Abort
          </Button>
        </div>
      </form>
    </div>
  );
}
