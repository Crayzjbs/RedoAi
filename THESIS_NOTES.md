# Thesis Documentation Notes

## System Overview

This document contains important notes and citations for thesis documentation.

## Key Citations

### 1. CycleGAN
- **Paper**: "Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks"
- **Authors**: Zhu, J. Y., Park, T., Isola, P., & Efros, A. A.
- **Year**: 2017
- **Used for**: Initial image transformation in Pipeline 2

### 2. Pix2Pix
- **Paper**: "Image-to-Image Translation with Conditional Adversarial Networks"
- **Authors**: Isola, P., Zhu, J. Y., Zhou, T., & Efros, A. A.
- **Year**: 2017
- **Used for**: Image refinement in Pipeline 2

### 3. BERT
- **Paper**: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"
- **Authors**: Devlin, J., Chang, M. W., Lee, K., & Toutanova, K.
- **Year**: 2018
- **Used for**: Converting enhanced prompts to style vectors

### 4. RAG
- **Paper**: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
- **Authors**: Lewis, P., et al.
- **Year**: 2020
- **Used for**: Contextualizing prompts in Pipeline 1

### 5. Perceptual Hashing
- **Paper**: "Implementation and Benchmarking of Perceptual Image Hash Functions"
- **Author**: Zauner, C.
- **Year**: 2010
- **Used for**: Copyright detection system

## System Limitations (For Thesis)

### Acknowledged Limitations

1. **Copyright Detection**: Simple perceptual hash-based system due to lack of public APIs
2. **Model Accuracy**: Limited by training data quality
3. **Iteration Limit**: Maximum 4 iterations
4. **Image Size**: Fixed 256×256 requirement

## Technical Implementation

### Architecture
- **Frontend**: Next.js 14 with React 18
- **Backend**: Next.js API Routes
- **Styling**: TailwindCSS
- **Real-time Updates**: Server-Sent Events (SSE)

### Processing Flow
1. User Input → Copyright Check (first iteration only)
2. Pipeline 1: DeepSeek LLM → RAG → BERT → Style Vector
3. Pipeline 2: CycleGAN (iteration 1) → Pix2Pix → Output
4. Iterations 2-4: Pix2Pix only

## Future Improvements

- Advanced copyright API integration
- Automatic image resizing
- Support for multiple image sizes
- Enhanced model training
- Real-time collaboration features
