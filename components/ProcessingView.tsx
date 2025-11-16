"use client";

import { Loader2, Sparkles, Image, Zap } from "lucide-react";
import { ProcessingState } from "@/types";

interface ProcessingViewProps {
  state: ProcessingState;
}

export function ProcessingView({ state }: ProcessingViewProps) {
  const getPipelineIcon = () => {
    if (state.currentPipeline === "pipeline1") {
      return <Sparkles className="w-6 h-6" />;
    }
    return <Image className="w-6 h-6" />;
  };

  const getPipelineTitle = () => {
    if (state.currentPipeline === "pipeline1") {
      return "Pipeline 1: Prompt Enhancement";
    }
    return "Pipeline 2: Image Generation";
  };

  const getPipelineDescription = () => {
    if (state.currentPipeline === "pipeline1") {
      return "Processing your prompt through DeepSeek LLM, RAG, and BERT to generate style vectors...";
    }
    return "Transforming your image using CycleGAN and Pix2Pix models...";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Your Request
          </h2>
          <p className="text-gray-600">
            Please wait while we generate your minimalist logo revision
          </p>
        </div>

        {/* Pipeline Indicator */}
        {state.currentPipeline && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                {getPipelineIcon()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {getPipelineTitle()}
                </h3>
                <p className="text-sm text-gray-600">
                  {getPipelineDescription()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">
              {state.progress}% complete
            </p>
          </div>
        )}

        {/* Current Step */}
        {state.currentStep && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-medium text-gray-700">
                Current Step:
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-6">
              {state.currentStep}
            </p>
          </div>
        )}

        {/* Processing Steps Info */}
        <div className="mt-8 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Processing Stages:
          </h4>
          
          <div className="space-y-2">
            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              state.currentPipeline === "pipeline1" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                state.currentPipeline === "pipeline1" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
              }`}>
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Prompt Enhancement
                </p>
                <p className="text-xs text-gray-600">
                  DeepSeek LLM → RAG → BERT → Style Vector
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              state.currentPipeline === "pipeline2" ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                state.currentPipeline === "pipeline2" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
              }`}>
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Image Transformation
                </p>
                <p className="text-xs text-gray-600">
                  CycleGAN → Pix2Pix → Final Output
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
