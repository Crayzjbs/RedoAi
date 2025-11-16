"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyrightModalProps {
  matchedLogo?: string;
  similarity?: number;
  onProceed: () => void;
  onCancel: () => void;
}

export function CopyrightModal({
  matchedLogo,
  similarity,
  onProceed,
  onCancel,
}: CopyrightModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Copyright Notice
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                The image you uploaded appears to be copyrighted. Our system detected
                a similarity match with known copyrighted logos.
              </p>
              
              {matchedLogo && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Matched Logo:</p>
                  <p className="text-sm font-medium text-gray-900">{matchedLogo}</p>
                  {similarity && (
                    <p className="text-xs text-gray-500 mt-1">
                      Similarity: {(similarity * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Disclaimer
                </p>
                <p className="text-xs text-gray-600">
                  By continuing, you acknowledge that you are responsible for any
                  legal issues resulting from unauthorized use of copyrighted
                  material. Please ensure you have the necessary rights or
                  permissions to use this image.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onProceed}
            variant="destructive"
            className="flex-1"
          >
            I Understand, Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
