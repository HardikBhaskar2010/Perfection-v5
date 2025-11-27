# 🚀 Vercel Deployment Guide - STEM Project Generator

## ✅ Pre-Deployment Checklist

Your frontend is now **ready for Vercel deployment**!

### What's Been Configured:
- ✅ `.env.production` - Backend URL set to Render
- ✅ `vercel.json` - Vercel configuration created
- ✅ `package.json` - Build scripts verified
- ✅ Build test - Successful (dist folder created)
- ✅ API Service - Using smart fake generation (no real API calls)
- ✅ Backend CORS - Updated to allow Vercel domains

---

## 📦 Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to Frontend
```bash
cd /app/frontend
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
```
? Set up and deploy "~/frontend"? Y
? Which scope? (your-username)
? Link to existing project? N
? Project name? stem-project-generator
? In which directory is your code located? ./
? Want to override settings? N
```

### Step 4: Add Environment Variable (in Vercel Dashboard)
- Go to your project settings
- Navigate to "Environment Variables"
- Add: `VITE_API_BASE_URL` = `https://perfection-v2.onrender.com`

---

## 🐙 Option 2: Deploy via GitHub (Recommended for Teams)

### Step 1: Push to GitHub
```bash
# If not already a git repo
cd /app/frontend
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/stem-generator.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository

### Step 3: Configure Project
```
Framework Preset: Vite
Root Directory: frontend (or ./ if deploying from frontend folder)
Build Command: yarn build (or npm run build)
Output Directory: dist
Install Command: yarn install (or npm install)
```

### Step 4: Environment Variables
Add this in Vercel dashboard:
```
VITE_API_BASE_URL = https://perfection-v2.onrender.com
```

### Step 5: Deploy
Click **"Deploy"** and wait ~2 minutes

---

## 🌐 After Deployment

Your app will be available at:
```
https://stem-project-generator.vercel.app
or
https://[your-project-name].vercel.app
```

---

## 🔧 Project Structure

```
/app/frontend/
├── .env                   # Local dev (uses localhost:8001)
├── .env.local            # Local override
├── .env.production       # Production (uses Render URL)
├── vercel.json           # Vercel config
├── package.json          # Dependencies & scripts
├── vite.config.ts        # Vite configuration
├── dist/                 # Build output (created by `yarn build`)
└── src/
    ├── services/
    │   └── apiService.ts # Smart fake generation (no API calls)
    └── pages/
        └── Generator.tsx # Main generator page
```

---

## 🧪 Testing Your Deployment

### Test Locally Before Deploying:
```bash
cd /app/frontend

# Build for production
yarn build

# Preview production build
yarn preview
```

Visit: `http://localhost:4173`

---

## 🔄 Complete Data Flow

```
User visits Vercel URL
    ↓
React app loads (static files from Vercel CDN)
    ↓
User clicks "Generate Project"
    ↓
apiService.ts runs FAKE generation (no API call)
    ↓
Smart mock generates realistic project based on inputs
    ↓
2-second delay (simulates API call)
    ↓
Project displayed to user
```

**Note**: Currently using smart fake generation. No real backend API calls are made. The generation is client-side and creates realistic, accurate projects based on user inputs.

---

## 🛠️ Troubleshooting

### Build Fails?
```bash
# Clear cache and rebuild
cd /app/frontend
rm -rf node_modules dist
yarn install
yarn build
```

### Environment Variables Not Working?
- Make sure `VITE_` prefix is used (required for Vite)
- Redeploy after adding env vars in Vercel dashboard
- Check: Settings → Environment Variables

### Routing Issues (404 on refresh)?
The `vercel.json` is configured to handle client-side routing:
```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 📊 Vercel vs Render - Architecture

| Component | Platform | Purpose |
|-----------|----------|---------|
| **Frontend** | Vercel | React app (static files) |
| **Backend** | Render | FastAPI server (when API calls added) |
| **Database** | Firebase | Firestore (components storage) |
| **Generation** | Client-side | Smart fake generation (no API) |

---

## 🎯 Next Steps

1. **Deploy to Vercel** using one of the methods above
2. Test your live app
3. When ready to add real API:
   - Uncomment API call in `apiService.ts`
   - Implement `/api/generate-project` endpoint on Render
   - Backend will handle AI generation

---

## 🚨 Important Notes

- **No API calls currently**: Generation happens client-side with smart mocks
- **Backend ready**: Your Render backend has CORS configured for Vercel
- **Firebase works**: Component database will work on Vercel (uses Firebase directly)
- **Free tier**: Both Vercel and Render offer free tiers

---

## 📝 Vercel CLI Commands

```bash
vercel          # Deploy to preview
vercel --prod   # Deploy to production
vercel logs     # View deployment logs
vercel ls       # List deployments
vercel rm       # Remove deployment
```

---

## ✅ Ready to Deploy!

Your frontend is fully configured and tested. Choose your deployment method and go live! 🚀
