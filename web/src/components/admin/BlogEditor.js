'use client';
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function BlogEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'blockquote', 'code-block'],
            ['clean']
          ]
        }
      });

      if (value) quillRef.current.root.innerHTML = value;

      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        if (onChange) onChange(html);
      });
    }
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className="quill-modern-wrapper">
      <div ref={editorRef} style={{ minHeight: '450px' }} />
      <style jsx global>{`
        .ql-container.ql-snow { border: none !important; font-size: 16px; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #27272a !important; padding: 15px !important; }
        .dark .ql-toolbar.ql-snow { background: #09090b; }
        .dark .ql-stroke { stroke: #a1a1aa !important; }
        .dark .ql-fill { fill: #a1a1aa !important; }
        .dark .ql-picker { color: #a1a1aa !important; }
        .dark .ql-editor { color: #e4e4e7; }
        .ql-editor.ql-blank::before { color: #52525b !important; font-style: normal; }
      `}</style>
    </div>
  );
}