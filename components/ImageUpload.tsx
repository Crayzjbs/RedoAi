"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateImageFile, validateImageDimensions } from "@/lib/utils";

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type and size
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      setError(fileValidation.error || "Invalid file");
      return;
    }

    // Validate dimensions
    const dimensionValidation = await validateImageDimensions(file);
    if (!dimensionValidation.valid) {
      setError(dimensionValidation.error || "Invalid dimensions");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Upload Logo Image
        <span className="text-red-500 ml-1">*</span>
      </label>
      <p className="text-xs text-gray-500">
        Must be exactly 256×256 pixels in PNG or JPG format
      </p>

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-50 p-3 rounded-full">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG or JPG (256×256px)
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-contain border border-gray-200 rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {value?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {value?.size ? `${(value.size / 1024).toFixed(2)} KB` : ""}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ImageIcon className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">256×256px</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
