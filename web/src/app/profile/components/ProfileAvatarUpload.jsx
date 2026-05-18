import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

export default function ProfileAvatarUpload({ 
  avatarPreview, 
  handleAvatarChange, 
  ui,
  register 
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-6">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {ui.picLabel}
      </Label>
      <div className="flex items-center gap-8">
        <div className="relative group">
          <div className="h-32 w-32 rounded-3xl overflow-hidden bg-accent/20 border-2 border-border shadow-xl relative z-10">
            <img 
              src={avatarPreview} 
              alt="Profile Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute -bottom-4 -right-4 z-20 bg-foreground text-background p-4 rounded-2xl shadow-2xl hover:bg-accent-secondary hover:text-white transition-all hover:scale-110"
          >
            <Camera size={20} />
          </button>
        </div>
        
        <div className="space-y-1">
           <p className="text-[10px] font-black uppercase tracking-widest">Profile Photo</p>
           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{ui.picSub}</p>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...register("avatar", {
            onChange: handleAvatarChange
          })}
          ref={(e) => {
            register("avatar").ref(e);
            fileInputRef.current = e;
          }}
        />
      </div>
    </div>
  );
}
