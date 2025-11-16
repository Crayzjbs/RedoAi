export interface UserInputs {
  image: File | null;
  designBrief: string;
  prompt: string;
}

export interface ProcessingState {
  currentPipeline: "pipeline1" | "pipeline2" | null;
  currentStep: string;
  progress: number;
}

export interface ProcessingResult {
  imageUrl: string;
  iteration: number;
  enhancedPrompt: string;
}

export interface CopyrightCheckResult {
  detected: boolean;
  matchedLogo?: string;
  similarity?: number;
}

export interface StyleVector {
  vector: number[];
  dimension: number;
}

export interface Pipeline1Response {
  enhancedPrompt: string;
  styleVector: StyleVector;
}

export interface Pipeline2Response {
  imageUrl: string;
  processedBy: "cyclegan" | "pix2pix";
}
