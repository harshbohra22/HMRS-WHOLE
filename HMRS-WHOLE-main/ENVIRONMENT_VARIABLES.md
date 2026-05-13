# Environment Variables Configuration

## For Vercel (Frontend Deployment)

Add these in **Vercel Dashboard → Settings → Environment Variables**:

### 1. VITE_ADZUNA_APP_ID
```
Name: VITE_ADZUNA_APP_ID
Value: [Your Adzuna Application ID from https://developer.adzuna.com/]
```

### 2. VITE_ADZUNA_APP_KEY
```
Name: VITE_ADZUNA_APP_KEY
Value: [Your Adzuna Application Key from https://developer.adzuna.com/]
```

### 3. VITE_API_URL (Optional)
```
Name: VITE_API_URL
Value: https://hmrs.onrender.com/api
```
**Note**: This is optional since `vercel.json` already handles the API proxy.

---

## For Render (Backend Deployment)

Add these in **Render Dashboard → Your Service → Environment**:

### 1. SPRING_DATASOURCE_URL
```
Name: SPRING_DATASOURCE_URL
Value: [Your database connection URL]
Example: jdbc:postgresql://your-db-host:5432/hmrs_db
```

### 2. SPRING_DATASOURCE_USERNAME
```
Name: SPRING_DATASOURCE_USERNAME
Value: [Your database username]
```

### 3. SPRING_DATASOURCE_PASSWORD
```
Name: SPRING_DATASOURCE_PASSWORD
Value: [Your database password]
```

### 4. CORS_ALLOWED_ORIGINS (Important!)
```
Name: CORS_ALLOWED_ORIGINS
Value: https://your-vercel-app.vercel.app,http://localhost:5173
```
**Replace** `your-vercel-app.vercel.app` with your actual Vercel deployment URL.

---

## How to Get Adzuna API Keys (Free)

1. Visit: **https://developer.adzuna.com/**
2. Click **"Sign Up"** or **"Get API Key"**
3. Create a **developer account** (NOT a job seeker account)
4. After registration, you'll see:
   - **Application ID** (numeric)
   - **Application Key** (alphanumeric string)
5. Copy these values to Vercel environment variables

---

## Configuration Steps

### Step 1: Configure Vercel
1. Go to https://vercel.com/dashboard
2. Select your HMRS project
3. Click **Settings** → **Environment Variables**
4. Add the 3 variables listed above
5. Click **Redeploy** to apply changes

### Step 2: Configure Render (Backend)
1. Go to https://dashboard.render.com/
2. Select your HMRS backend service
3. Click **Environment** in the left sidebar
4. Add the database and CORS variables
5. Click **Save Changes** (service will auto-redeploy)

### Step 3: Update CORS After Vercel Deployment
1. After Vercel deploys, copy your deployment URL (e.g., `https://hmrs-whole.vercel.app`)
2. Go back to Render → Environment
3. Update `CORS_ALLOWED_ORIGINS` to include your Vercel URL
4. Save and redeploy

---

## Quick Reference

**Frontend (Vercel):**
- `VITE_ADZUNA_APP_ID` - For external job search
- `VITE_ADZUNA_APP_KEY` - For external job search
- `VITE_API_URL` - Backend API URL (optional)

**Backend (Render):**
- `SPRING_DATASOURCE_URL` - Database connection
- `SPRING_DATASOURCE_USERNAME` - Database user
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `CORS_ALLOWED_ORIGINS` - Allowed frontend URLs

---

## Testing

After configuration:
1. ✅ Vercel deployment should build successfully
2. ✅ Frontend should connect to backend at `https://hmrs.onrender.com`
3. ✅ External jobs search should work (if Adzuna keys are configured)
4. ✅ No CORS errors in browser console
