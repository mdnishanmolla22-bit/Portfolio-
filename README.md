# আমার 3D Portfolio

এই folder টা একটা সম্পূর্ণ website। Netlify তে free তে host করা যায়। Admin panel ঠিকমতো চালাতে Netlify ব্যবহার করুন।

## এতে কী কী আছে

- পুরো design, 3D object, projects, gallery (album সহ), contact
- Contact এ click করলে Gmail, WhatsApp chat, LinkedIn, Facebook, Instagram এ সরাসরি নিয়ে যায়
- Chatbot (Pixel), যে page এর সব তথ্য জানে
- `/admin` panel, যেখান থেকে সবকিছু বদলানো যায়: নাম, ছবি, রং, 3D object (আকার, রং, গতি, বা নিজের .glb model), projects, gallery album ও photo, contact link, chatbot এর উত্তর

## Folder এর ফাইল

| ফাইল | কাজ |
|---|---|
| `index.html`, `style.css`, `app.js` | website নিজে |
| `content/site.json` | সব লেখা ও তথ্য। Admin panel এই ফাইল বদলায় |
| `uploads/` | Admin panel থেকে upload করা ছবি এখানে জমা হয় |
| `admin/` | Admin panel (Decap CMS) |
| `netlify/functions/chat.mjs` | Optional: Claude AI দিয়ে chatbot এর উত্তর |

## ধাপ ১: GitHub এ রাখুন

1. https://github.com এ account খুলুন, নতুন repository বানান (নাম যেমন `my-portfolio`)।
2. এই folder এর সব ফাইল ওই repository তে upload করুন (Add file → Upload files)।
3. `admin/config.yml` ফাইল খুলে `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` জায়গায় আপনার আসল `username/repository` লিখুন। `site_url` ও `display_url` এ Netlify এর link (ধাপ ২ এর পর পাবেন) বসান।

## ধাপ ২: Netlify তে deploy

1. https://app.netlify.com এ GitHub দিয়ে login করুন।
2. Add new site → Import an existing project → GitHub → আপনার repository বাছুন।
3. Build command ফাঁকা রাখুন, Publish directory `.` রাখুন, Deploy চাপুন।
4. কিছুক্ষণ পর একটা link পাবেন, যেমন `https://something.netlify.app`। এটাই আপনার website।

## ধাপ ৩: Admin panel চালু করা (একবারই করতে হবে)

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App।
   - Homepage URL: আপনার Netlify site এর link
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. বানানোর পর **Client ID** পাবেন, আর Generate a new client secret চেপে **Client secret** নিন।
3. Netlify → আপনার site → Site configuration → Access & security → OAuth → Install provider → GitHub, ওখানে Client ID ও Secret বসান।
4. এখন `আপনার-site-link/admin` এ যান, Login with GitHub চাপুন।

শুধু ওই GitHub repository তে লেখার অনুমতি আছে এমন মানুষ (মানে আপনি) admin এ ঢুকে বদলাতে পারবেন। অন্য কেউ ঢুকতে পারবে না।

## Admin panel কীভাবে ব্যবহার করবেন

1. `/admin` এ গিয়ে "Everything on the website" চাপুন।
2. বাঁ পাশে সব অংশ সাজানো আছে: Top bar and hero, Colours, 3D object, Projects, Education/Skills/Process/Quote, Contact, Photo albums, Chatbot।
3. বদলান, ছবি upload করুন, তারপর উপরে **Publish** চাপুন।
4. ১ থেকে ২ মিনিটের মধ্যে website এ নতুন তথ্য দেখা যাবে।

কিছু জানার কথা:
- Gallery তে অনেক বড় ছবি upload করলে site ধীর হয়। ছবি ২ MB এর নিচে রাখুন।
- Contact এ WhatsApp এর জন্য শুধু নম্বর লিখুন (`01712345678`)। LinkedIn, Facebook, Instagram এর জন্য শুধু username লিখুন।
- নিজের 3D model দিতে চাইলে 3D object এ Shape বদলে "My own 3D model" বাছুন এবং .glb file upload করুন (৫ MB এর নিচে)।

## Chatbot

- ডিফল্ট: সম্পূর্ণ free। এটা website এর তথ্য এবং আপনার দেওয়া Question/Answer pair থেকে উত্তর দেয়। Admin এর Chatbot অংশে "Extra information" ও Q&A যোগ করলে আরও ভালো উত্তর দেবে।
- Optional, Claude AI দিয়ে উত্তর: Anthropic API key নিয়ে Netlify → Site configuration → Environment variables এ `ANTHROPIC_API_KEY` নামে বসান, তারপর Admin → Chatbot এ "Use Claude AI for answers" চালু করুন। এতে প্রতি message এ সামান্য খরচ হয়। Anthropic console এ monthly spend limit দিয়ে রাখুন। কিছু ভুল হলে chatbot নিজে থেকেই ডিফল্ট উত্তরে ফিরে যায়।

## Vercel এ দিলে

Website, 3D, gallery, contact, chatbot (ডিফল্ট) সবই Vercel এ চলবে। কিন্তু `/admin` এর GitHub login এর জন্য Netlify এর OAuth সুবিধা লাগে। Vercel এ admin চালাতে নিজের OAuth server লাগবে, তাই Admin চাইলে Netlify ব্যবহার করুন। Vercel এ দিলে `content/site.json` ফাইল GitHub এ সরাসরি edit করেও সব বদলানো যায়।

## নিজের কম্পিউটারে দেখা

`index.html` এ double click করলে চলবে না। Folder এর ভিতরে terminal খুলে চালান: `npx serve` (অথবা `python3 -m http.server`), তারপর browser এ `http://localhost:3000` (বা 8000) খুলুন।
