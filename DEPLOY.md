# Burger House — deploy notes

## Kya theek kiya gaya

Pichli build Vercel pe is liye fail ho rahi thi ke `node_modules` GitHub pe
commit ho gaya tha — aur wo Windows ke binaries the
(`@esbuild/win32-x64`, `@rollup/rollup-win32-x64-msvc`).

Vercel Linux pe chalta hai. Clone karte waqt `node_modules` pehle se maujood
hoti thi aur `node_modules/.bin/vite` Git se aata tha bina executable
permission ke, is liye:

    sh: 1: vite: Permission denied

Wajah: purana `.gitignore` mein `node_module` likha tha — `s` missing tha,
is liye ignore hua hi nahi.

Is package mein:

- `node_modules` bilkul nahi — aap khud install karenge
- `.gitignore` theek kiya gaya (`node_modules/`, `.env`, `dist/`)
- `frontend/vercel.json` add kiya — SPA rewrite, warna `/menu` ya `/admin`
  pe direct refresh 404 deta
- `backend/.env` hata diya, uski jagah `.env.example` — asli secrets
  kabhi commit na karein
- root ka bekaar `package.json` / `package-lock.json` hata diya (usme
  sirf tailwind ki stray deps thin aur koi `build` script nahi tha)

## Local setup

    cd frontend
    npm install
    npm run dev

    cd backend
    cp .env.example .env     # values bhar dein
    npm install
    npm run dev

## Vercel settings (frontend)

Project Settings mein:

- **Root Directory**: `frontend`
- Framework Preset: Vite (auto-detect)
- Build Command: `npm run build`
- Output Directory: `dist`

Environment Variables mein add karein:

    VITE_API_URL = https://burger-house-px60.onrender.com/api

Ye zaroori hai. `src/lib/api.js` mein fallback `/api` hai jo sirf dev proxy
ke liye kaam karta hai — production mein set na kiya to saari API calls
404 dengi.

## Purana repo clean karna

Ye files copy karne ke baad, apne repo folder mein:

    git rm -r --cached node_modules backend/node_modules frontend/node_modules
    git rm --cached backend/.env
    git add .
    git commit -m "Remove node_modules and .env from tracking, fix gitignore"
    git push

## Secrets rotate karein

`backend/.env` public repo pe commit ho chuka tha. File hata dene se purani
commits saaf nahi hotin — history mein abhi bhi mojood hai.

Rotate karein:

- Supabase `SUPABASE_SERVICE_KEY` (service role key — poori DB ka access,
  RLS bypass karti hai)
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

Phir naye values Render ke environment variables mein daal dein.
