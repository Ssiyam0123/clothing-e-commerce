"use client";

import { useState, useEffect } from "react";
import { getImageUrl } from "@/utils/imageUtils";

export default function ImageUpload({
  label,
  name,
  register,
  currentImage,
  onImageChange,
  accept = "image/*",
  multiple = false,
}) {
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState([]);

  // Ei useEffect ta asynchronous data ashar por preview ke automatic update kore dibe
  useEffect(() => {
    if (multiple) {
      if (currentImage && Array.isArray(currentImage)) {
        setPreviews(currentImage.map((img) => getImageUrl(img)));
      }
    } else {
      if (currentImage) {
        setPreview(getImageUrl(currentImage));
      }
    }
  }, [currentImage, multiple]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      if (onImageChange) onImageChange(files);
    } else {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        if (onImageChange) onImageChange(file);
      }
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
    } else {
      setPreview(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        {...register(name)}
        onChange={handleFileChange}
        multiple={multiple}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />

      {/* Single Image Preview using normal img tag */}
      {!multiple && preview && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage()}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Multiple Images Preview using normal img tag */}
      {multiple && previews.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">
            Preview ({previews.length} images):
          </p>
          <div className="flex flex-wrap gap-2">
            {previews.map((img, idx) => (
              <div
                key={idx}
                className="relative h-20 w-20 overflow-hidden rounded-lg border"
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
