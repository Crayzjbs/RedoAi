"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { DesignBriefInput } from "@/components/DesignBriefInput";
import { PromptInput } from "@/components/PromptInput";
import { ProcessingView } from "@/components/ProcessingView";
import { ResultView } from "@/components/ResultView";
import { CopyrightModal } from "@/components/CopyrightModal";
import { Header } from "@/components/Header";
import { ProcessingState, UserInputs } from "@/types";

export default function Home() {
  const [step, setStep] = useState<"input" | "copyright" | "processing" | "result">("input");
  const [inputs, setInputs] = useState<UserInputs>({
    image: null,
    designBrief: "",
    prompt: "",
  });
  const [processingState, setProcessingState] = useState<ProcessingState>({
    currentPipeline: null,
    currentStep: "",
    progress: 0,
  });
  const [result, setResult] = useState<{
    imageUrl: string;
    iteration: number;
    enhancedPrompt: string;
  } | null>(null);
  const [copyrightMatch, setCopyrightMatch] = useState<{
    detected: boolean;
    matchedLogo?: string;
    similarity?: number;
  } | null>(null);

  const handleInputsComplete = async (data: UserInputs) => {
    setInputs(data);
    
    // Check copyright on first iteration only
    if (!result) {
      const copyrightCheck = await checkCopyright(data.image!);
      if (copyrightCheck.detected) {
        setCopyrightMatch(copyrightCheck);
        setStep("copyright");
      } else {
        startProcessing(data);
      }
    } else {
      startProcessing(data);
    }
  };

  const checkCopyright = async (image: File): Promise<{
    detected: boolean;
    matchedLogo?: string;
    similarity?: number;
  }> => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/copyright-check", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Copyright check failed:", error);
      return { detected: false };
    }
  };

  const startProcessing = async (data: UserInputs) => {
    setStep("processing");
    
    try {
      const formData = new FormData();
      formData.append("image", data.image!);
      formData.append("designBrief", data.designBrief);
      formData.append("prompt", data.prompt);
      formData.append("iteration", result ? String(result.iteration + 1) : "1");
      formData.append("previousImage", result?.imageUrl || "");

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "progress") {
                setProcessingState({
                  currentPipeline: data.pipeline,
                  currentStep: data.step,
                  progress: data.progress,
                });
              } else if (data.type === "complete") {
                setResult({
                  imageUrl: data.imageUrl,
                  iteration: data.iteration,
                  enhancedPrompt: data.enhancedPrompt,
                });
                setStep("result");
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Processing error:", error);
      alert("An error occurred during processing. Please try again.");
      setStep("input");
    }
  };

  const handleCopyrightProceed = () => {
    setStep("processing");
    startProcessing(inputs);
  };

  const handleCopyrightCancel = () => {
    setStep("input");
    setCopyrightMatch(null);
  };

  const handleIterationRequest = (newPrompt: string) => {
    const currentIteration = result?.iteration || 0;
    
    if (currentIteration >= 4) {
      alert("Maximum iterations (4) reached. Our trained model is not yet sufficient to generate your desired output.");
      return;
    }

    setInputs({
      ...inputs,
      prompt: newPrompt,
    });
    
    startProcessing({
      ...inputs,
      prompt: newPrompt,
    });
  };

  const handleReset = () => {
    setStep("input");
    setInputs({ image: null, designBrief: "", prompt: "" });
    setResult(null);
    setCopyrightMatch(null);
    setProcessingState({ currentPipeline: null, currentStep: "", progress: 0 });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {step === "input" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Upload Your Design
              </h2>
              
              <div className="space-y-6">
                <ImageUpload
                  value={inputs.image}
                  onChange={(file) => setInputs({ ...inputs, image: file })}
                />
                
                <DesignBriefInput
                  value={inputs.designBrief}
                  onChange={(brief) => setInputs({ ...inputs, designBrief: brief })}
                />
                
                <PromptInput
                  value={inputs.prompt}
                  onChange={(prompt) => setInputs({ ...inputs, prompt })}
                  onSubmit={() => handleInputsComplete(inputs)}
                  disabled={!inputs.image || !inputs.designBrief || !inputs.prompt}
                />
              </div>
            </div>
          </div>
        )}

        {step === "copyright" && copyrightMatch && (
          <CopyrightModal
            matchedLogo={copyrightMatch.matchedLogo}
            similarity={copyrightMatch.similarity}
            onProceed={handleCopyrightProceed}
            onCancel={handleCopyrightCancel}
          />
        )}

        {step === "processing" && (
          <ProcessingView state={processingState} />
        )}

        {step === "result" && result && (
          <ResultView
            result={result}
            onIterationRequest={handleIterationRequest}
            onReset={handleReset}
            maxIterations={4}
          />
        )}
      </div>
    </main>
  );
}
