# PowerLink - Electricity Management System

PowerLink is a simple, clean, beginner-friendly electricity utility management portal (inspired by WAPDA / K-Electric) built with **React**, **Vite**, **Tailwind CSS**, and **localStorage** for state persistence. It is fully frontend-only and ready for static deployment on Vercel.

---

## Features
- **3 User Roles**:
  - **Consumer**: View bills (with itemized PDF/print view), pay bills (JazzCash, Easypaisa, Credit Card, Bank Transfer with receipt generation), file and track complaints with status timeline and 1-5 star feedback, manage profile.
  - **Admin**: Operations dashboard with charts, complaint management (Accept, Reject with reason, Assign to technician), consumer and technician user management, bill generation (with slab tariff calculation and bulk generator), revenue and payment tracking.
  - **Technician**: Assigned jobs management, start work (In Progress), mark resolved with repair notes, work history, profile.
- **Robust Workflow**: Exact complaint state transition flow (*Pending → Accepted/Rejected → Assigned → In Progress → Resolved*) with history logging.
- **Preloaded Demo Data**: 5 consumers, 3 technicians, 10 complaints in various stages, and 6 months of historical bills.

---

## Local Development
1. **Clone or download the project**.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: Navigate to `http://localhost:3000`.

---

## Demo Accounts (Quick Login)
- **Consumer**: `consumer@demo.com` / `1234`
- **Admin**: `admin@demo.com` / `1234`
- **Technician**: `tech@demo.com` / `1234`

---

## Vercel Deployment
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel will automatically detect Vite. The build command is `npm run build` and output directory is `dist`.
4. The included `vercel.json` ensures all SPA client-side routes rewrite correctly to `index.html`.
