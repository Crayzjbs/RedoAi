import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import axios from "axios";

// Server-Sent Events for real-time progress updates
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  const designBrief = formData.get("designBrief") as string;
  const prompt = formData.get("prompt") as string;
  const iteration = parseInt(formData.get("iteration") as string) || 1;
  const previousImage = formData.get("previousImage") as string;

  // Create a TransformStream for SSE
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send SSE message helper
  const sendProgress = async (
    pipeline: "pipeline1" | "pipeline2",
    step: string,
    progress: number
  ) => {
    const data = JSON.stringify({
      type: "progress",
      pipeline,
      step,
      progress,
    });
    await writer.write(encoder.encode(`data: ${data}\n\n`));
  };

  const sendComplete = async (
    imageUrl: string,
    iteration: number,
    enhancedPrompt: string
  ) => {
    const data = JSON.stringify({
      type: "complete",
      imageUrl,
      iteration,
      enhancedPrompt,
    });
    await writer.write(encoder.encode(`data: ${data}\n\n`));
  };

  const sendError = async (message: string) => {
    const data = JSON.stringify({
      type: "error",
      message,
    });
    await writer.write(encoder.encode(`data: ${data}\n\n`));
  };

  // Process in background
  (async () => {
    try {
      // Save uploaded image
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const imagePath = path.join(uploadsDir, `input-${Date.now()}.png`);
      await fs.writeFile(imagePath, buffer);

      // PIPELINE 1: Prompt Enhancement + Style Vector Generation
      await sendProgress("pipeline1", "Initializing DeepSeek LLM...", 10);

      const enhancedPrompt = await enhancePromptWithDeepSeek(
        prompt,
        designBrief,
        sendProgress
      );

      await sendProgress(
        "pipeline1",
        "Generating style vector with BERT...",
        70
      );

      const styleVector = await generateStyleVector(enhancedPrompt, sendProgress);

      await sendProgress("pipeline1", "Pipeline 1 complete", 100);

      // PIPELINE 2: Image-to-Image Processing
      await sendProgress("pipeline2", "Initializing image processing...", 10);

      let processedImagePath: string;

      if (iteration === 1) {
        // First iteration: Use CycleGAN then Pix2Pix
        await sendProgress(
          "pipeline2",
          "Transforming image with CycleGAN...",
          30
        );

        const cycleGanOutput = await processCycleGAN(
          imagePath,
          styleVector,
          sendProgress
        );

        await sendProgress(
          "pipeline2",
          "Refining with Pix2Pix...",
          70
        );

        processedImagePath = await processPix2Pix(
          cycleGanOutput,
          styleVector,
          sendProgress
        );
      } else {
        // Subsequent iterations: Skip CycleGAN, use only Pix2Pix
        await sendProgress(
          "pipeline2",
          "Refining with Pix2Pix (iteration mode)...",
          50
        );

        // Use previous image as input
        const prevImagePath = previousImage
          ? path.join(process.cwd(), "public", previousImage.replace("/uploads/", "uploads/"))
          : imagePath;

        processedImagePath = await processPix2Pix(
          prevImagePath,
          styleVector,
          sendProgress
        );
      }

      await sendProgress("pipeline2", "Pipeline 2 complete", 100);

      // Return result
      const resultUrl = `/uploads/${path.basename(processedImagePath)}`;
      await sendComplete(resultUrl, iteration, enhancedPrompt);
    } catch (error) {
      console.error("Processing error:", error);
      await sendError(
        error instanceof Error ? error.message : "Processing failed"
      );
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// Pipeline 1 Functions

async function enhancePromptWithDeepSeek(
  prompt: string,
  designBrief: string,
  sendProgress: (pipeline: "pipeline1" | "pipeline2", step: string, progress: number) => Promise<void>
): Promise<string> {
  try {
    await sendProgress("pipeline1", "Sending to DeepSeek LLM...", 20);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";

    if (!apiKey) {
      throw new Error("DeepSeek API key not configured");
    }

    const systemPrompt = `You are an expert design assistant specializing in minimalist logo design. 
Your task is to enhance user prompts for logo revision by:
1. Analyzing the design brief and user intent
2. Adding specific minimalist design principles
3. Providing clear, actionable design directions
4. Incorporating relevant design terminology

Keep the enhanced prompt concise but comprehensive (2-3 sentences).`;

    const userMessage = `Design Brief: ${designBrief}

User Prompt: ${prompt}

Please enhance this prompt for a minimalist logo revision, making it more specific and design-focused.`;

    await sendProgress("pipeline1", "Processing with RAG context...", 40);

    const response = await axios.post(
      apiUrl,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 200,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    await sendProgress("pipeline1", "Enhanced prompt generated", 60);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("DeepSeek API error:", error);
    // Fallback: return original prompt with basic enhancement
    return `Create a minimalist logo revision: ${prompt}. Focus on clean lines, simple shapes, and modern aesthetics as described in the design brief.`;
  }
}

async function generateStyleVector(
  enhancedPrompt: string,
  sendProgress: (pipeline: "pipeline1" | "pipeline2", step: string, progress: number) => Promise<void>
): Promise<number[]> {
  try {
    await sendProgress("pipeline1", "Encoding with BERT...", 80);

    const bertApiUrl = process.env.BERT_API_URL;

    if (!bertApiUrl) {
      // Fallback: generate a mock style vector
      console.warn("BERT API not configured, using mock style vector");
      return generateMockStyleVector(enhancedPrompt);
    }

    const response = await axios.post(bertApiUrl, {
      text: enhancedPrompt,
    });

    await sendProgress("pipeline1", "Style vector generated", 90);

    return response.data.vector;
  } catch (error) {
    console.error("BERT API error:", error);
    // Fallback: generate a mock style vector
    return generateMockStyleVector(enhancedPrompt);
  }
}

function generateMockStyleVector(text: string): number[] {
  // Generate a deterministic mock vector based on text
  // In production, this would be replaced with actual BERT embeddings
  const vector: number[] = [];
  const dimension = 768; // Standard BERT dimension

  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed += text.charCodeAt(i);
  }

  for (let i = 0; i < dimension; i++) {
    // Simple pseudo-random generation based on text
    const x = Math.sin(seed + i) * 10000;
    vector.push(x - Math.floor(x));
  }

  return vector;
}

// Pipeline 2 Functions

async function processCycleGAN(
  imagePath: string,
  styleVector: number[],
  sendProgress: (pipeline: "pipeline1" | "pipeline2", step: string, progress: number) => Promise<void>
): Promise<string> {
  try {
    await sendProgress("pipeline2", "CycleGAN processing...", 40);

    const cycleGanApiUrl = process.env.CYCLEGAN_API_URL;

    if (!cycleGanApiUrl) {
      console.warn("CycleGAN API not configured, using mock processing");
      return await mockImageProcessing(imagePath, "cyclegan");
    }

    const imageBuffer = await fs.readFile(imagePath);
    const formData = new FormData();
    formData.append("image", new Blob([imageBuffer]));
    formData.append("styleVector", JSON.stringify(styleVector));

    const response = await axios.post(cycleGanApiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer",
    });

    const outputPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      `cyclegan-${Date.now()}.png`
    );
    await fs.writeFile(outputPath, Buffer.from(response.data));

    await sendProgress("pipeline2", "CycleGAN complete", 60);

    return outputPath;
  } catch (error) {
    console.error("CycleGAN error:", error);
    return await mockImageProcessing(imagePath, "cyclegan");
  }
}

async function processPix2Pix(
  imagePath: string,
  styleVector: number[],
  sendProgress: (pipeline: "pipeline1" | "pipeline2", step: string, progress: number) => Promise<void>
): Promise<string> {
  try {
    await sendProgress("pipeline2", "Pix2Pix processing...", 80);

    const pix2pixApiUrl = process.env.PIX2PIX_API_URL;

    if (!pix2pixApiUrl) {
      console.warn("Pix2Pix API not configured, using mock processing");
      return await mockImageProcessing(imagePath, "pix2pix");
    }

    const imageBuffer = await fs.readFile(imagePath);
    const formData = new FormData();
    formData.append("image", new Blob([imageBuffer]));
    formData.append("styleVector", JSON.stringify(styleVector));

    const response = await axios.post(pix2pixApiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "arraybuffer",
    });

    const outputPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      `pix2pix-${Date.now()}.png`
    );
    await fs.writeFile(outputPath, Buffer.from(response.data));

    await sendProgress("pipeline2", "Pix2Pix complete", 95);

    return outputPath;
  } catch (error) {
    console.error("Pix2Pix error:", error);
    return await mockImageProcessing(imagePath, "pix2pix");
  }
}

async function mockImageProcessing(
  inputPath: string,
  modelType: "cyclegan" | "pix2pix"
): Promise<string> {
  // For development/testing: copy the input image as output
  // In production, this would be replaced with actual model inference
  const outputPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    `${modelType}-${Date.now()}.png`
  );

  await fs.copyFile(inputPath, outputPath);
  return outputPath;
}
