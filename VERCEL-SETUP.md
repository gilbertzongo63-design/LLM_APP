# ⚙️ VERCEL CONFIGURATION GUIDE

## Environment Variables Setup

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Sign in with your GitHub account
3. Find and click on project: **cv-app**

### Step 2: Access Environment Variables
1. Click on the **cv-app** project
2. Go to **Settings** tab (at the top)
3. Click on **Environment Variables** in the left sidebar

### Step 3: Add Variables

Click **Add New** and add these variables:

#### Variable 1: API URL
- **Name**: `REACT_APP_API_URL`
- **Value**: `https://llm-app-1-lsgm.onrender.com`
- **Environments**: Check `Production`, `Preview`, and `Development`
- Click **Save**

#### Variable 2: Node Environment (Optional)
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environments**: Check `Production`
- Click **Save**

### Step 4: Redeploy Application

1. Go back to **Deployments** tab
2. Find the latest deployment
3. Click the **⋯** (three dots) menu
4. Select **Redeploy**
5. Confirm by clicking **Redeploy**

Wait for deployment to complete (usually 30-60 seconds).

### Step 5: Verify

1. Go to https://cv-app-smoky-two.vercel.app
2. Open DevTools (F12)
3. Check Console for logs from aiService.js
4. Should see: `🔗 AI Service Backend URL: https://llm-app-1-lsgm.onrender.com`
5. Open AI Assistant and ask a question
6. Check for response from backend

---

## Troubleshooting

### Issue: "REACT_APP_API_URL is undefined"

**Cause**: Environment variable not set correctly

**Solution**:
1. Go to Vercel Settings → Environment Variables
2. Verify `REACT_APP_API_URL` is set
3. Check it's available in `Production` environment
4. Redeploy the project

### Issue: "API responds with 404"

**Cause**: Wrong backend URL or backend is down

**Solution**:
1. Test backend directly: https://llm-app-1-lsgm.onrender.com/api/health
2. Verify REACT_APP_API_URL is correct in Vercel
3. Check Render service is running: https://dashboard.render.com

### Issue: "CORS error" in console

**Cause**: Backend doesn't allow cross-origin requests

**Solution**:
1. Backend has CORS enabled for all origins
2. Check browser console for exact error
3. Verify API endpoint is working directly

### Issue: AI Assistant not working

**Cause**: Multiple possible causes

**Debug Steps**:
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for debug logs from aiService.js:
   - `🔗 AI Service Backend URL: ...` (shows configured URL)
   - `📤 Sending to AI: ...` (shows request being sent)
   - `✅ AI Response received:` (shows successful response)
   - `❌ AI Service Error:` (shows error)
4. Check **Network** tab for failed requests
5. If seeing "CORS error", verify backend CORS settings

---

## Advanced Configuration

### Using Custom Domain

1. Go to Vercel Dashboard → cv-app → Settings
2. Click **Domains**
3. Add your custom domain
4. Follow DNS instructions

### Setting up CI/CD

Already configured via `.github/workflows/deploy-vercel.yml`

The workflow:
- Triggers on push to `master` branch
- Runs automated tests (if configured)
- Deploys to Vercel automatically
- Updates preview deployments

### Monitoring Performance

1. Go to **Analytics** tab in Vercel
2. Check:
   - Page load performance
   - API response times
   - Error rates

### Viewing Logs

1. Go to **Deployments** tab
2. Click on any deployment
3. Scroll down to **Build Logs** or **Runtime Logs**

---

## Testing After Deployment

### Automated Test
Run the test script:
```bash
cd Createur-CV-lettre_Motivation-app
bash test-api.sh  # On Linux/Mac
test-api.bat      # On Windows
```

### Manual Testing

1. **Load Frontend**
   - Visit: https://cv-app-smoky-two.vercel.app
   - Should load without errors

2. **Test Resume Creation**
   - Click "Créer un CV"
   - Fill in form data
   - Should load without errors

3. **Test AI Assistant**
   - Open AI Assistant (🤖 button)
   - Type: "Quelles competences ajouter?"
   - Should get response from backend
   - Check console for debug logs

4. **Test Responsive Design**
   - Press F12 (DevTools)
   - Press Ctrl+Shift+M (Device Toggle)
   - Test on mobile sizes
   - Verify UI is readable

5. **Test PDF Export**
   - Create a resume
   - Click "Exporter en PDF"
   - Should download PDF file

---

## Environment Variables Reference

| Variable | Value | Required | Notes |
|----------|-------|----------|-------|
| `REACT_APP_API_URL` | `https://llm-app-1-lsgm.onrender.com` | Yes | Backend URL for API calls |
| `NODE_ENV` | `production` | No | Enables production optimizations |
| `REACT_APP_DEBUG` | `false` | No | Enable debug logging |

---

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Project redeploy initiated
- [ ] Deployment successful (green checkmark)
- [ ] Frontend loads without errors
- [ ] AI Assistant working
- [ ] PDF export functional
- [ ] Mobile responsive design verified
- [ ] Backend accessible from frontend

---

## Quick Links

- **Frontend URL**: https://cv-app-smoky-two.vercel.app
- **Backend URL**: https://llm-app-1-lsgm.onrender.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/gilbertzongo63-design/LLM_APP
- **Render Dashboard**: https://dashboard.render.com

---

**Last Updated**: 2024
