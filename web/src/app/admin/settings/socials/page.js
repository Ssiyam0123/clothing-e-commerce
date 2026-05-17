"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/modules/admin/components/FormInput";
import { cn } from "@/lib/utils";

export default function SocialsPage() {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setSocialLinks(data.socialLinks || []);
      } catch (error) {
        toast.error("Failed to load social settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const allowedPlatforms = ["facebook", "instagram", "twitter", "linkedin", "tiktok"];
      const cleanedSocialLinks = socialLinks.filter(link => 
        allowedPlatforms.includes(link.platform?.toLowerCase()) && link.url?.trim() !== ""
      );

      const payload = new FormData();
      payload.append("socialLinks", JSON.stringify(cleanedSocialLinks));

      await api.put("/settings", payload);
      toast.success("Social links updated!");
    } catch (error) {
      toast.error("Failed to update social links.");
    } finally {
      setLoading(false);
    }
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

  if (isFetching) return <div className="animate-pulse h-96 bg-muted rounded-3xl" />;

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
              disabled={loading}
              className="bg-foreground text-background hover:bg-accent-secondary hover:text-white px-10 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
            >
              <Save size={16} className={cn("mr-2", loading && "animate-pulse")} />
              {loading ? "Updating Socials..." : "Save Social Links"}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
