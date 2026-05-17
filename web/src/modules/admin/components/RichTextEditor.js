"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";

// 🚀 Dynamically import Jodit to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-accent/10 animate-pulse rounded-[2.5rem] flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-muted-foreground/30">Deploying Tactical Environment...</div>
});

export default function RichTextEditor({ value, onChange, placeholder = "Initialize narrative data stream..." }) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder,
    theme: "dark",
    minHeight: 600,
    maxHeight: "100vh",
    autofocus: false,
    spellcheck: true,
    // 🎨 Vanguard Tactical Theme Styling
    style: {
      background: "#09090b",
      color: "#e4e4e7",
      fontSize: "15px",
      lineHeight: "1.8",
      fontFamily: "var(--font-geist-sans), Inter, sans-serif",
    },
    // 🛠️ Optimized Toolbar (Source & Fullsize at start)
    buttons: [
      "source", "preview", "fullsize", "|",
      "bold", "italic", "underline", "strikethrough", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "video", "table", "link", "|",
      "ul", "ol", "outdent", "indent", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "symbol", "print"
    ],
    // 🖼️ Advanced Media
    uploader: {
      insertImageAsBase64URI: true,
    },
    // 🧩 Ultimate Optimization
    toolbarAdaptive: false,
    toolbarSticky: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: true,
    beautifyHTML: true,
    // Ensure handles are always visible for resizing
    observer: {
      timeout: 100
    },
    // Fix for fullscreen mode in fixed layouts
    zIndex: 10000,
  }), [placeholder]);

  return (
    <div className="vanguard-editor-wrapper">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
      <style jsx global>{`
        /* 🛡️ Fullscreen Viewport Takeover */
        .jodit_fullsize {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 1000000 !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        .jodit-container {
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          background: #09090b !important;
          border-radius: 2.5rem !important;
          overflow: hidden;
        }

        .jodit-toolbar__box {
          background: #09090b !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 12px 24px !important;
        }

        .jodit-workplace {
          background: transparent !important;
          padding: 30px !important;
        }

        .jodit-status-bar {
          background: #09090b !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #71717a !important;
          padding: 10px 24px !important;
        }

        .jodit-toolbar-button__button {
          color: #a1a1aa !important;
        }

        .jodit-toolbar-button__button:hover {
          background: rgba(225, 29, 72, 0.1) !important;
          color: #f43f5e !important;
        }

        /* Tactical Tooltip/Dropdown Fixes */
        .jodit-ui-panel, .jodit-ui-popup {
          background: #18181b !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          color: white !important;
          z-index: 1000001 !important;
        }
      `}</style>
    </div>
  );
}
