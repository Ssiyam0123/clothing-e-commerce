"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAdminBannerCampaigns, useAdminBannerCampaign } from "@/app/admin/banner-campaigns/lib/useAdminBannerCampaigns";
import { swalError, swalToast } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import { ChevronLeft } from "lucide-react";
import BannerCampaignForm from "../components/BannerCampaignForm";

export default function BannerCampaignFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = id !== "new";

  const { createCampaign, updateCampaign } = useAdminBannerCampaigns();
  const { campaign, isLoading: isCampaignLoading } = useAdminBannerCampaign(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slides: [],
    isActive: false,
  });
  const [slideFiles, setSlideFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description || "",
        slides: campaign.slides.length > 0 
          ? campaign.slides.map((s) => ({ ...s, _id: s._id }))
          : [{ tempId: 'default-' + Date.now(), title: "", subtitle: "", link: "", image: "", order: 0 }],
        isActive: campaign.isActive,
      });
    } else if (!isEdit) {
      setFormData({
        name: "",
        description: "",
        slides: [{ tempId: 'default-' + Date.now(), title: "", subtitle: "", link: "", image: "", order: 0 }],
        isActive: false,
      });
    }
  }, [isEdit, id, campaign]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mainSlide = formData.slides[0];
    if (!mainSlide?.image) {
      return swalError(
        "Missing Image",
        "Please upload a banner image.",
      );
    }

    setIsSaving(true);

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
        swalToast("Banner Updated", "success");
      } else {
        await createCampaign(formDataToSend);
        swalToast("Banner Created", "success");
      }
      setTimeout(() => router.push("/admin/banner-campaigns"), 1500);
    } catch (err) {
      swalError(
        "Error",
        err.response?.data?.message || "Could not save changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && isCampaignLoading) {
    return (
      <div className="admin-page-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-page-container max-w-6xl">
      {/* 🔙 Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/banner-campaigns")}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all p-0 hover:bg-transparent"
        >
          <div className="w-8 h-8 rounded-full border border-border/10 flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span>Back to Banners</span>
        </Button>
      </div>

      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">
            {isEdit ? "Edit" : "Create"} <span className="text-muted-foreground/30">Banner</span>
          </h1>
          <p className="admin-subtitle">Manage your banner details and visuals</p>
        </div>
      </div>

      <BannerCampaignForm 
        formData={formData}
        setFormData={setFormData}
        slideFiles={slideFiles}
        setSlideFiles={setSlideFiles}
        isEdit={isEdit}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
