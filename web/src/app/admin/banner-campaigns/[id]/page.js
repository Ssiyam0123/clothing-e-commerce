"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminBannerCampaigns } from "@/hooks/useAdminBannerCampaigns";
import Loader from "@/components/common/Loader";
import { getImageUrl } from "@/utils/imageUtils";
import Link from "next/link";
// 2. Swal Utilities Import
import { swalConfirm, swalToast, swalError } from "@/utils/swal";

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
      <div className="p-20">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
            {isEdit ? "Configure Deck" : "Initialize Campaign"}
          </h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            Hero Banner Architecture
          </p>
        </div>
        <Link
          href="/admin/banner-campaigns"
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          ← Back to Hub
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Core Details */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-6">
          <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">
            Core Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-black text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="1"
                className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm resize-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl w-fit">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white cursor-pointer"
            />
            <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest leading-none">
              Set as Active Campaign
            </p>
          </div>
        </div>

        {/* Slide Deck */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                Slide Deck
              </h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                Configure individual banners
              </p>
            </div>
            <button
              type="button"
              onClick={addSlide}
              className="mt-4 md:mt-0 bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
            >
              + Add Slide
            </button>
          </div>

          <div className="space-y-6">
            {formData.slides.map((slide, index) => {
              const slideId = slide._id || slide.tempId;
              return (
                <div
                  key={slideId}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 bg-zinc-50 dark:bg-[#111] relative group transition-all hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm"
                >
                  <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      Slide {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSlide(slideId)}
                      className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 dark:border-rose-500/20"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    {/* Image Upload */}
                    <div className="col-span-1">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-3">
                        Background Media
                      </label>
                      <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0a0a0a] group/upload hover:border-zinc-900 dark:hover:border-white transition-all cursor-pointer flex flex-col items-center justify-center">
                        {slide.image ? (
                          <>
                            <img
                              src={
                                slide.image.startsWith("blob:")
                                  ? slide.image
                                  : getImageUrl(slide.image)
                              }
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                                Change Media
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-4xl mb-3 grayscale opacity-30">
                              🖼️
                            </span>
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
                              Upload Image
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handleSlideImage(slideId, e.target.files[0])
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="col-span-1 lg:col-span-2 space-y-5">
                      <div>
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                          Headline
                        </label>
                        <input
                          type="text"
                          value={slide.title || ""}
                          onChange={(e) =>
                            updateSlide(slideId, "title", e.target.value)
                          }
                          className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm font-black text-zinc-900 dark:text-white outline-none focus:border-zinc-900 transition-all shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                          Subheadline
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ""}
                          onChange={(e) =>
                            updateSlide(slideId, "subtitle", e.target.value)
                          }
                          className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-900 transition-all shadow-inner"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={slide.link || ""}
                            onChange={(e) =>
                              updateSlide(slideId, "link", e.target.value)
                            }
                            className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-bold text-indigo-500 outline-none focus:border-zinc-900 transition-all shadow-inner"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">
                            Sort Order
                          </label>
                          <input
                            type="number"
                            value={slide.order !== undefined ? slide.order : 0}
                            onChange={(e) =>
                              updateSlide(
                                slideId,
                                "order",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-900 transition-all shadow-inner"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {formData.slides.length === 0 && (
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-16 text-center bg-zinc-50 dark:bg-[#111]">
                <span className="text-5xl block mb-4 grayscale opacity-30">
                  🎴
                </span>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                  Deck is empty. Add a slide to begin.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            {isEdit ? "Sync Campaign Data" : "Launch Campaign Protocol"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/banner-campaigns")}
            className="flex-1 bg-zinc-100 dark:bg-[#111] text-zinc-500 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-200 dark:border-zinc-800"
          >
            Discard
          </button>
        </div>
      </form>
    </div>
  );
}
