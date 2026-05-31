"use client";

import { useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MessageInput({
  input,
  setInput,
  handleSend,
  handleFileChange,
  isUploading,
  fileInputRef
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground/70 shrink-0 mb-1"
        >
          {isUploading ? (
            <Loader2 size={22} className="animate-spin text-accent-secondary" />
          ) : (
            <ImageIcon size={22} />
          )}
        </Button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            style={{ resize: "none" }}
            className="w-full min-h-[42px] max-h-[120px] py-2.5 px-4 border-none bg-white dark:bg-[#2a3942] rounded-xl text-sm focus-visible:ring-0 shadow-sm focus:outline-none transition-all scrollbar-thin overflow-y-auto"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!input.trim() || isUploading}
          className={cn(
            "h-[42px] w-[42px] rounded-full transition-all duration-300 shadow-md shrink-0 flex items-center justify-center mb-1",
            input.trim() ? "bg-accent-secondary hover:bg-accent-secondary/90 scale-100" : "bg-muted text-muted-foreground scale-95 opacity-50"
          )}
        >
          <Send size={20} className={cn("transition-transform", input.trim() && "translate-x-0.5 -translate-y-0.5")} />
        </Button>
      </div>
    </footer>
  );
}
