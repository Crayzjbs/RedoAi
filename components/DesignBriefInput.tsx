"use client";

import { useState, useRef } from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignBriefInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DesignBriefInput({ value, onChange }: DesignBriefInputProps) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      alert("Please upload a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onChange(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Design Brief
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant={mode === "text" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("text")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Type Manually
        </Button>
        <Button
          type="button"
          variant={mode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("file");
            fileInputRef.current?.click();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload .txt File
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your design brief here... Describe the purpose, target audience, brand values, and design preferences."
        className="w-full min-h-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      <p className="text-xs text-gray-500">
        Provide context about your design goals, target audience, and brand identity
      </p>
    </div>
  );
}
