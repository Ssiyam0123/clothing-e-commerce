// src/components/admin/RichTextEditor.js
"use client";
import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "blockquote", "code-block"],
              ["clean"],
            ],
            handlers: {
              image: function () {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = async () => {
                  const file = input.files[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const { data } = await api.post(
                      "/upload/blog-image",
                      formData,
                      {
                        headers: { "Content-Type": "multipart/form-data" },
                      },
                    );
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, "image", data.url);
                  } catch (err) {
                    console.error("Image upload failed:", err);
                    alert("Failed to upload image");
                  }
                };
              },
            },
          },
        },
      });

      if (value) quill.root.innerHTML = value;

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }
  }, [onChange, value]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="quill-modern-wrapper">
      <div ref={editorRef} style={{ minHeight: "450px" }} />
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-size: 16px;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e4e4e7 !important;
          padding: 15px !important;
        }
        .dark .ql-toolbar.ql-snow {
          background: #0a0a0a;
          border-bottom-color: #27272a !important;
        }
        .dark .ql-stroke {
          stroke: #a1a1aa !important;
        }
        .dark .ql-fill {
          fill: #a1a1aa !important;
        }
        .dark .ql-picker {
          color: #a1a1aa !important;
        }
        .dark .ql-editor {
          color: #e4e4e7;
        }
        .ql-editor.ql-blank::before {
          color: #52525b !important;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
