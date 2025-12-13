# 🛠 Challenges & Solutions

This document outlines the key technical and design challenges faced during the development of MenuFlight, along with the specific solutions implemented.

## 🎯 Challenges & Solutions

| Area | Challenge | Solution |
| :--- | :--- | :--- |
| **🎨 Design** | Balancing "appetizing" food aesthetics with clean SaaS tech UI. | Used **Yellow/Red accents** for appetite + **Glassmorphism/Dark Mode** for modern tech feel. |
| **🗄️ Database** | Managing Supabase relational complexity & foreign keys for the first time. | Designed strict schema with **Foreign Keys** (Owner→Poll) & **RLS policies** for security. |
| **⚡ Backend** | Building a scalable backend without complex server management. | Leveraged **Next.js API Routes** (Serverless) for instant scaling & separation of concerns. |
| **🛡️ Security** | Securing the full pipeline from raw user input to database storage. | **Defense-in-depth**: Zod validation (Input) → HTML Sanitization (Process) → RLS (Storage). |
| **🗳️ Voting** | Allowing "No Login" voting while preventing spam/duplicates. | Implemented **IP Hashing** & DB **UNIQUE constraints** `(poll_id, ip)` for one-tap integrity. |
| **📱 UX** | Creating distinct, intuitive views for Voters vs. Owners. | **Voter**: Distraction-free "Vote Only" UI. **Owner**: Rich analytics dashboard. |
| **🚀 Deployment** | Overcoming build errors & strict type checks on Vercel. | Enforced **Strict TypeScript** & configured correct **Environment Variables** for production. |

---

## ✅ Best Practices Followed

*   **🛡️ Security First**: Zero-trust architecture with RLS & Input Sanitization.
*   **💎 Code Quality**: Strict **TypeScript** & **ESLint** for maintainability.
*   **⚡ Performance**: **Server Components** for speed & **Optimistic UI** for interaction.
*   **📱 Mobile-First**: Optimized for handheld devices (primary use case for diners).
*   **🧩 Component Modularity**: atomic design with reusable UI components.
