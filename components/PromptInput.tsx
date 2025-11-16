"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function PromptInput({ value, onChange, onSubmit, disabled }: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Revision Prompt
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the changes you want... (e.g., 'Make it more minimalist with clean lines' or 'Add modern geometric elements')"
          className="w-full min-h-[100px] px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <p className="text-xs text-gray-500">
        Provide specific instructions for how you want the logo to be revised
      </p>

      <Button
        onClick={onSubmit}
        disabled={disabled}
        className="w-full"
        size="lg"
      >
        <Send className="w-4 h-4 mr-2" />
        Generate Revision
      </Button>
    </div>
  );
}
