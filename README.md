# 🎨 Article Fetcher — React + TypeScript (Vite + PrimeReact)

This project is built as part of an assignment using **React (with Vite)** and **TypeScript**.  
It displays artworks data fetched from a public API using a **PrimeReact DataTable** with **server-side pagination** and **persistent row selection** across pages.

---

## 🚀 Features

- ⚡ **Vite + TypeScript** setup for fast development
- 🎨 **PrimeReact DataTable** for rich table UI
- 🌐 **Server-side pagination** (data fetched per page from API)
- ✅ **Row selection with persistence** across page changes
- 📄 **Dynamic API fetching** (no caching of all pages — prevents memory issues)
- 🧭 Pagination fully synchronized with API responses

---

## 🧠 API Used

**Endpoint:**  
[`https://api.artic.edu/api/v1/artworks?page=1`]

**Fields Displayed:**

- `title`
- `place_of_origin`
- `artist_display`
- `inscriptions`
- `date_start`
- `date_end`

---

## 🏗️ Project Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
