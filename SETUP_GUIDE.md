# Setup Guide - AI Logo Revision Tool

Complete step-by-step guide for setting up and running the AI-powered logo revision website.

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **DeepSeek API Key** ([Get one here](https://platform.deepseek.com/))
- ✅ **Git** (optional, for version control)
- ✅ **Code Editor** (VS Code recommended)

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open terminal in the project directory:

```bash
cd "g:/School/THESIS/Redo AI Website"
npm install
```

This will install all required packages (~2-3 minutes).

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Open `.env` in your editor and add your DeepSeek API key:
```env
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Create Required Directories

```bash
mkdir public\uploads
mkdir data\copyrighted-logos
```

### Step 4: Run Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

Navigate to: `http://localhost:3000`

✅ **You're ready to go!**

---

## 🔧 Detailed Setup

### Environment Configuration

Edit your `.env` file with all available options:

```env
# ============================================
# REQUIRED: DeepSeek LLM Configuration
# ============================================
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# ============================================
# OPTIONAL: ML Model Endpoints
# ============================================
# If you have separate servers running your ML models:
# CYCLEGAN_API_URL=http://localhost:5000/api/cyclegan
# PIX2PIX_API_URL=http://localhost:5000/api/pix2pix
# BERT_API_URL=http://localhost:5000/api/bert

# Leave commented out to use mock processing (for testing)

# ============================================
# Application Settings
# ============================================
MAX_ITERATIONS=4
IMAGE_SIZE=256
ALLOWED_IMAGE_FORMATS=png,jpg,jpeg

# ============================================
# Copyright Detection
# ============================================
COPYRIGHT_SIMILARITY_THRESHOLD=0.85
```

### Setting Up Copyright Database

To enable copyright detection:

1. **Create the directory** (if not already created):
```bash
mkdir data\copyrighted-logos
```

2. **Add copyrighted logo images**:
   - Place PNG or JPG files in `data/copyrighted-logos/`
   - Name them descriptively (e.g., `nike-swoosh.png`)
   - Recommended size: 256×256 pixels

Example structure:
```
data/copyrighted-logos/
  ├── nike-swoosh.png
  ├── apple-logo.png
  ├── mcdonalds-arches.png
  ├── starbucks-logo.png
  └── adidas-stripes.png
```

**Note**: Without this database, copyright checking will always return "not detected" (which is acceptable for thesis demonstration).

---

## 🧪 Testing the Application

### Test 1: Basic Functionality (No ML Models)

The application works without ML model servers using mock processing:

1. **Start the server**: `npm run dev`
2. **Open**: `http://localhost:3000`
3. **Upload a test image**:
   - Must be exactly 256×256 pixels
   - PNG or JPG format
4. **Enter design brief**: Any text describing your design goals
5. **Enter prompt**: "Make it more minimalist"
6. **Click "Generate Revision"**

**Expected Result**: 
- Progress indicators show
- Mock processing completes
- Original image returned (since no real models connected)
- Enhanced prompt displayed

### Test 2: With DeepSeek API

If you have a valid DeepSeek API key:

1. Ensure `DEEPSEEK_API_KEY` is set in `.env`
2. Follow Test 1 steps
3. **Expected Result**: Real AI-enhanced prompt generated

### Test 3: Copyright Detection

1. Add a logo to `data/copyrighted-logos/`
2. Upload the same logo (or very similar)
3. **Expected Result**: Copyright warning modal appears

### Test 4: Iteration System

1. Complete a first revision
2. Click "Request Another Iteration"
3. Enter new prompt
4. **Expected Result**: 
   - Iteration 2 of 4 shown
   - Processing uses Pix2Pix only (faster)
5. Repeat up to 4 times
6. **After 4th iteration**: Error message about model limitations

---

## 🔌 Connecting ML Models (Advanced)

If you have trained CycleGAN, Pix2Pix, and BERT models:

### Option 1: Local Model Servers

Create separate Python Flask/FastAPI servers for each model:

**Example CycleGAN Server** (`cyclegan_server.py`):
```python
from flask import Flask, request, send_file
import torch
# ... your model loading code

app = Flask(__name__)

@app.route('/api/cyclegan', methods=['POST'])
def process_cyclegan():
    image = request.files['image']
    style_vector = request.form['styleVector']
    
    # Process with your model
    output = model.process(image, style_vector)
    
    return send_file(output, mimetype='image/png')

if __name__ == '__main__':
    app.run(port=5000)
```

Then update `.env`:
```env
CYCLEGAN_API_URL=http://localhost:5000/api/cyclegan
PIX2PIX_API_URL=http://localhost:5001/api/pix2pix
BERT_API_URL=http://localhost:5002/api/bert
```

### Option 2: Cloud Deployment

Deploy models to cloud services:
- **Google Cloud Run**
- **AWS Lambda** (with container support)
- **Azure Functions**
- **Hugging Face Inference API**

Update `.env` with cloud URLs:
```env
CYCLEGAN_API_URL=https://your-cyclegan-service.run.app/api/cyclegan
PIX2PIX_API_URL=https://your-pix2pix-service.run.app/api/pix2pix
BERT_API_URL=https://api-inference.huggingface.co/models/your-bert-model
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Run `npm install` again
```bash
npm install
```

### Issue: Port 3000 already in use

**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

### Issue: DeepSeek API errors

**Possible causes**:
1. Invalid API key
2. No API credits
3. Rate limiting

**Solution**: 
- Verify API key in `.env`
- Check DeepSeek dashboard for credits
- Wait and retry if rate limited

### Issue: Image upload fails

**Possible causes**:
1. Image not exactly 256×256 pixels
2. Wrong file format
3. File too large

**Solution**:
- Resize image to exactly 256×256
- Convert to PNG or JPG
- Ensure file < 5MB

### Issue: Copyright check not working

**Cause**: No images in copyright database

**Solution**: 
- Add at least one image to `data/copyrighted-logos/`
- Or accept that it will always return "not detected"

### Issue: Processing stuck

**Possible causes**:
1. ML model server not responding
2. Network issues
3. Server error

**Solution**:
- Check browser console for errors
- Verify model server URLs in `.env`
- Check server logs: `npm run dev` output

---

## 📦 Production Deployment

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Add environment variables** in Vercel dashboard

4. **Note**: File uploads require persistent storage. Consider:
   - Vercel Blob Storage
   - AWS S3
   - Cloudinary

### Deploy to Other Platforms

- **Netlify**: Supports Next.js
- **Railway**: Easy deployment
- **DigitalOcean App Platform**: Full control
- **AWS Amplify**: AWS ecosystem

---

## 🔒 Security Considerations

### For Production:

1. **API Keys**: Never commit `.env` to Git
2. **File Upload**: Implement file size limits (already done: 5MB)
3. **Rate Limiting**: Add rate limiting to API routes
4. **Input Validation**: Already implemented for images
5. **CORS**: Configure if needed for external ML servers

### Example Rate Limiting:

```typescript
// Add to API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});
```

---

## 📊 Monitoring & Logging

### Development Logging

The application logs to console:
- API requests
- Processing steps
- Errors

### Production Logging

Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: Usage analytics

---

## 🎓 For Thesis Demonstration

### Minimal Setup (No ML Models)

Perfect for demonstrating the UI and workflow:

1. Install dependencies
2. Add DeepSeek API key
3. Run `npm run dev`
4. Demo with mock processing

### Full Setup (With ML Models)

For complete system demonstration:

1. Deploy ML models to servers
2. Configure all API endpoints
3. Add copyright database
4. Test full pipeline

---

## 📞 Support

For issues or questions:

1. Check this guide
2. Review `README.md`
3. Check browser console for errors
4. Review server logs
5. Contact thesis team

---

## ✅ Verification Checklist

Before presenting/submitting:

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with DeepSeek API key
- [ ] Directories created (`public/uploads`, `data/copyrighted-logos`)
- [ ] Server runs without errors (`npm run dev`)
- [ ] Can access `http://localhost:3000`
- [ ] Can upload 256×256 image
- [ ] Can submit design brief and prompt
- [ ] Processing completes successfully
- [ ] Can download result
- [ ] Iteration system works (up to 4 iterations)
- [ ] Copyright modal appears (if database populated)

---

**You're all set! Good luck with your thesis presentation! 🎉**
