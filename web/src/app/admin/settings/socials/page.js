"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useSettings } from "@/app/admin/settings/lib/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/app/admin/_components/FormInput";
import { cn } from "@/lib/utils";

export default function SocialsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  const [socialLinks, setSocialLinks] = useState([]);

  // Sync state with React Query cache instantly on load/update
  useEffect(() => {
    if (settings?.socialLinks) {
      setSocialLinks(settings.socialLinks || []);
    }
  }, [settings]);

  const handleSave = async () => {
    const allowedPlatforms = ["facebook", "instagram", "twitter", "linkedin", "tiktok"];
    const cleanedSocialLinks = socialLinks.filter(link => 
      allowedPlatforms.includes(link.platform?.toLowerCase()) && link.url?.trim() !== ""
    );

    const payload = new FormData();
    payload.append("socialLinks", JSON.stringify(cleanedSocialLinks));

    await updateSettings(payload);
  };

  const updateLink = (platform, url) => {
    const newLinks = [...socialLinks];
    const index = newLinks.findIndex(s => s.platform === platform);
    if (index > -1) {
      newLinks[index].url = url;
    } else {
      newLinks.push({ platform, url });
    }
    setSocialLinks(newLinks);
  };

  if (isLoading && !settings) return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;

  return (
    <Card className="rounded-[2rem] md:rounded-[3rem] border-border/10 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <CardContent className="p-6 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { id: "facebook", label: "Facebook Link", placeholder: "https://facebook.com/your-page" },
              { id: "instagram", label: "Instagram Link", placeholder: "https://instagram.com/your-profile" },
              { id: "twitter", label: "Twitter Link", placeholder: "https://twitter.com/your-profile" },
              { id: "linkedin", label: "LinkedIn Link", placeholder: "https://linkedin.com/company/your-page" },
              { id: "tiktok", label: "TikTok Link", placeholder: "https://tiktok.com/@your-profile" },
            ].map((platform) => (
              <FormInput
                key={platform.id}
                label={platform.label}
                name={platform.id}
                register={() => ({})}
                value={socialLinks.find(s => s.platform === platform.id)?.url || ""}
                onChange={(e) => updateLink(platform.id, e.target.value)}
                errors={{}}
                placeholder={platform.placeholder}
              />
            ))}
          </div>

          <div className="pt-12 border-t border-border/5 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", isUpdating && "animate-pulse")} />
              {isUpdating ? "Updating Socials..." : "Save Social Links"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
