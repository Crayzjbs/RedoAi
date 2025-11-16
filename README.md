# AI-Powered Logo Revision Tool

An automated revision tool designed to help creatives streamline their revision workload by generating minimalist design outputs using AI-driven processing with CycleGAN and Pix2Pix models.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Thesis Documentation](#thesis-documentation)
- [Limitations](#limitations)
- [Technology Stack](#technology-stack)

## 🎯 Overview

This web application is a multi-phase AI revision system that processes:
- A 256×256 PNG/JPG logo
- A design brief (uploaded as .txt or manually typed)
- A prompt/instruction from the user

The system produces an AI-generated revised minimalist version of the logo using trained CycleGAN and Pix2Pix models.

## 🏗️ System Architecture

### Phase 1: User Input
Users provide three required inputs:
1. **Image Upload**: 256×256 PNG/JPG logo
2. **Design Brief**: Text file upload or manual input
3. **Revision Prompt**: Textual instruction for stylistic changes

### Phase 2: Processing Pipeline

#### Pipeline 1 - Prompt Enhancement + Style Vector Generation
```
User Inputs → DeepSeek LLM → RAG → Enhanced Prompt → BERT → Style Vector → Pipeline 2
```

**Steps:**
1. Inputs sent to DeepSeek LLM API
2. LLM uses RAG (Retrieval-Augmented Generation) for contextualization
3. Returns enhanced, structured prompt
4. BERT converts textual instruction into style vector
5. Style vector guides visual transformation

#### Pipeline 2 - Image-to-Image Processing
```
Style Vector → CycleGAN → Initial Output → Pix2Pix → Final Output
```

**Steps:**
1. Style vector input into CycleGAN for first transformation
2. CycleGAN output passed to Pix2Pix for refinement
3. Pix2Pix produces final output

### Phase 3: Iteration Logic

**First Iteration:**
- Full pipeline: CycleGAN → Pix2Pix

**Subsequent Iterations (2-4):**
- Rejected output becomes new input
- User submits new prompt only
- **Skips CycleGAN**, uses only Pix2Pix for refinement
- Maximum 4 iterations allowed

**After 4 iterations:**
> "Our trained model is not yet sufficient to generate your desired output."

### Phase 4: Copyright Detection

**First Iteration Only:**
- Perceptual hash-based similarity checking
- Compares against database of known copyrighted logos
- Displays disclaimer modal if similarity detected
- User must acknowledge responsibility to proceed

**Limitation Acknowledgment:**
> We acknowledge that we cannot integrate an advanced copyright-checking API because no suitable public API exists for this purpose. Therefore, we implemented only a simple similarity-based system using a manually curated database.

## ✨ Features

- ✅ Modern, responsive UI built with Next.js and TailwindCSS
- ✅ Real-time processing progress with Server-Sent Events (SSE)
- ✅ Multi-phase AI pipeline integration
- ✅ Iterative refinement system (up to 4 iterations)
- ✅ Copyright detection with perceptual hashing
- ✅ Image validation (256×256 requirement)
- ✅ Design brief upload or manual input
- ✅ Download processed results
- ✅ Clean, minimalist interface

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- DeepSeek API key
- (Optional) Separate ML model servers for CycleGAN, Pix2Pix, and BERT

### Steps

1. **Clone the repository**
```bash
cd "g:/School/THESIS/Redo AI Website"
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# Optional: ML Model Endpoints
CYCLEGAN_API_URL=http://localhost:5000/api/cyclegan
PIX2PIX_API_URL=http://localhost:5000/api/pix2pix
BERT_API_URL=http://localhost:5000/api/bert

# Application Settings
MAX_ITERATIONS=4
IMAGE_SIZE=256
ALLOWED_IMAGE_FORMATS=png,jpg,jpeg

# Copyright Detection
COPYRIGHT_SIMILARITY_THRESHOLD=0.85
```

4. **Create required directories**
```bash
mkdir -p public/uploads
mkdir -p data/copyrighted-logos
```

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
Navigate to `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek LLM API key | Required |
| `DEEPSEEK_API_URL` | DeepSeek API endpoint | `https://api.deepseek.com/v1/chat/completions` |
| `CYCLEGAN_API_URL` | CycleGAN model endpoint | Optional |
| `PIX2PIX_API_URL` | Pix2Pix model endpoint | Optional |
| `BERT_API_URL` | BERT embedding endpoint | Optional |
| `MAX_ITERATIONS` | Maximum iteration limit | `4` |
| `COPYRIGHT_SIMILARITY_THRESHOLD` | Copyright detection threshold | `0.85` |

### Copyright Database Setup

Add copyrighted logo images to `data/copyrighted-logos/`:
```
data/copyrighted-logos/
  ├── nike-swoosh.png
  ├── apple-logo.png
  ├── mcdonalds-arches.png
  └── ...
```

## 📖 Usage

### Basic Workflow

1. **Upload Logo**: Select a 256×256 PNG/JPG image
2. **Provide Design Brief**: Upload .txt file or type manually
3. **Enter Prompt**: Describe desired changes
4. **Submit**: Click "Generate Revision"
5. **Review**: View processed result
6. **Iterate** (optional): Request up to 3 more iterations
7. **Download**: Save final result

### Example Prompts

- "Make it more minimalist with clean lines"
- "Add modern geometric elements"
- "Simplify the design and use negative space"
- "Convert to a flat design style"

## 🔌 API Documentation

### POST `/api/copyright-check`

Check uploaded image against copyright database.

**Request:**
```typescript
FormData {
  image: File
}
```

**Response:**
```typescript
{
  detected: boolean;
  matchedLogo?: string;
  similarity?: number;
}
```

### POST `/api/process`

Process logo through AI pipeline (Server-Sent Events).

**Request:**
```typescript
FormData {
  image: File;
  designBrief: string;
  prompt: string;
  iteration: number;
  previousImage?: string;
}
```

**SSE Events:**
```typescript
// Progress Update
{
  type: "progress";
  pipeline: "pipeline1" | "pipeline2";
  step: string;
  progress: number;
}

// Completion
{
  type: "complete";
  imageUrl: string;
  iteration: number;
  enhancedPrompt: string;
}

// Error
{
  type: "error";
  message: string;
}
```

## 📚 Thesis Documentation

### Citations Required

For thesis documentation, the following components require citations:

1. **CycleGAN Architecture**
   - Zhu, J. Y., Park, T., Isola, P., & Efros, A. A. (2017). Unpaired image-to-image translation using cycle-consistent adversarial networks.

2. **Pix2Pix Model**
   - Isola, P., Zhu, J. Y., Zhou, T., & Efros, A. A. (2017). Image-to-image translation with conditional adversarial networks.

3. **BERT Embeddings**
   - Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2018). BERT: Pre-training of deep bidirectional transformers for language understanding.

4. **RAG (Retrieval-Augmented Generation)**
   - Lewis, P., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks.

5. **Perceptual Hashing**
   - Zauner, C. (2010). Implementation and benchmarking of perceptual image hash functions.

### System Limitations

**Acknowledged in Thesis:**

1. **Copyright Detection**: Simple perceptual hash-based system due to lack of public copyright-checking APIs
2. **Model Accuracy**: Limited to training data quality and quantity
3. **Iteration Limit**: Maximum 4 iterations based on model capabilities
4. **Image Size**: Fixed 256×256 requirement for model compatibility

## ⚠️ Limitations

### Current Limitations

1. **ML Model Integration**: Requires separate model servers (fallback to mock processing if unavailable)
2. **Copyright Database**: Manual curation required
3. **Image Size**: Strict 256×256 pixel requirement
4. **API Dependencies**: Requires DeepSeek API key
5. **Processing Time**: Depends on model server response times

### Known Issues

- Mock processing used when ML endpoints unavailable
- Copyright detection requires pre-populated database
- No automatic image resizing (user must provide correct dimensions)

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Lucide React**: Icons

### Backend
- **Next.js API Routes**: Serverless functions
- **Server-Sent Events**: Real-time progress updates
- **Axios**: HTTP client
- **Image-Hash**: Perceptual hashing
- **Hamming Distance**: Similarity calculation

### AI/ML Integration
- **DeepSeek LLM**: Prompt enhancement
- **BERT**: Text embeddings
- **CycleGAN**: Image transformation
- **Pix2Pix**: Image refinement

## 📝 Development

### Project Structure
```
├── app/
│   ├── api/
│   │   ├── copyright-check/
│   │   │   └── route.ts
│   │   └── process/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── button.tsx
│   ├── CopyrightModal.tsx
│   ├── DesignBriefInput.tsx
│   ├── Header.tsx
│   ├── ImageUpload.tsx
│   ├── ProcessingView.tsx
│   ├── PromptInput.tsx
│   └── ResultView.tsx
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
├── public/
│   └── uploads/
├── data/
│   └── copyrighted-logos/
└── package.json
```

### Build for Production
```bash
npm run build
npm start
```

## 👥 Contributors

Thesis Project Team

## 📄 License

This project is developed for academic/thesis purposes.

---

**Note**: This is a thesis project demonstrating AI-powered design revision. The system's effectiveness depends on the quality of trained models and available API services.
