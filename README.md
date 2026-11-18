# 🚚 SwiftTrack — Enterprise Courier & Logistics Platform

> **B7A7 Frontend / Fullstack Final Assignment — Programming Hero (Batch 7)**  
> **Domain:** Courier & Logistics Platform (Student ID ending in 1)  
> **Framework:** Next.js 16 (App Router) • React 19 • TypeScript • Tailwind CSS v4 • TanStack Query • Zustand • Recharts • Stripe

---

## 🔗 Project Links & Live URLs

| Resource | URL |
|:---|:---|
| **Live Backend API** | [https://industry-standard-project-raskirayhans-projects.vercel.app/api/v1](https://industry-standard-project-raskirayhans-projects.vercel.app/api/v1) |
| **Backend Repository** | [https://github.com/raskirayhan/courier-and-logistics-platform](https://github.com/raskirayhan/courier-and-logistics-platform) |
| **Frontend Repository** | [https://github.com/raskirayhan/courier-frontend](https://github.com/raskirayhan/courier-frontend) |
| **Live Frontend URL** | [https://courier-frontend-steel.vercel.app](https://courier-frontend-steel.vercel.app) *(or your deployed Vercel URL)* |

---

## ⚡ 1-Click Demo Evaluation Credentials (Mandatory Requirement)

The `/login` page includes **3 prominent, 1-Click Demo Login cards** for instantaneous evaluator access without manual typing:

| Role | Demo Email | Demo Password | Accessible Portals |
|:---|:---|:---|:---|
| **Super Admin** 🛡️ | `admin@courier.com` | `Admin@123456` | `/admin` (Analytics Deck, Master Dispatch, Hubs Directory, User Control) |
| **Customer / Merchant** 📦 | `customer@demo.com` | `Password@123!` | `/dashboard` (4-Step Booking Wizard, Consignments, Profile, Invoices) |
| **Courier Rider** 🛵 | `courier@demo.com` | `Password@123!` | `/courier` (Active Runs, 6-Digit OTP Verification Modal, Vehicle Specs) |

---

## ✨ Key Architectural Features & Domain Complexity

Regular e-commerce clones or simple CRUD tables are strictly avoided. SwiftTrack models a realistic, high-stakes 3-sided logistics ecosystem:

### 1. 🚀 Public Marketing & Live Tracking Engine
- **Hero & Trust Proof:** High-contrast modern typography, ambient mesh background grid, live simulated linehaul consignment telemetry card, and merchant trust ticker.
- **Smart Volumetric Calculator:** Computes chargeable weight using standard IATA dimensional rules:
  $$\text{Volumetric Weight} = \frac{\text{Length} \times \text{Width} \times \text{Height}}{5000}$$
  Includes package presets (Doc, Small Box, Medium Cargo, Heavy Freight) and priority express surcharge toggles.
- **Live Visual Tracking Stepper (`/track/[id]`):** 5-stage progressive milestone tracker with horizontal animated progress bar, immutable audit logs, and one-click sample tracking numbers (`TRK-2026-100234`, `TRK-2026-904821`, `TRK-2026-551029`).

### 2. 📦 Customer Merchant Portal (`/dashboard`)
- **4-Step Booking Wizard (`/dashboard/book`):**
  1. *Step 1: Address & Hubs* — Origin depot, destination regional hub, sender & recipient details.
  2. *Step 2: Dimensions & Specs* — Weight (kg), Length, Width, Height (cm), fragile cargo toggle.
  3. *Step 3: Rate Breakdown* — Automatic IATA volumetric vs actual weight comparison, base tariff, and surcharges.
  4. *Step 4: Stripe Checkout Handshake* — Direct redirection to Stripe payment gateway.
- **Shipments Management (`/dashboard/shipments`):** Filter by status tabs (`PENDING`, `IN_HUB_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`), search synced with browser URL (`useSearchParams`), parcel cancellation modal, and recipient OTP inspect.

### 3. 💳 Stripe Real Test Mode Payment Integration
- Consumes backend `/payments/initiate` to generate dynamic Stripe Checkout Sessions.
- `/payment/success`: Celebratory confetti canvas, session ID receipt, consignment link, and print invoice.
- `/payment/cancel`: Graceful recovery flow explaining payment abort with retry button.

### 4. 🛵 Mobile-First Courier Rider Portal (`/courier`)
- **Bottom Navigation Dock:** Optimized for mobile phones and delivery riders on two-wheelers.
- **Delivery Manifest Progression (`/courier/deliveries`):** Advance consignments through lifecycle stages (`PICKED_UP` ➔ `IN_HUB_TRANSIT` ➔ `OUT_FOR_DELIVERY`).
- **Fraud-Proof 6-Digit Customer OTP Verification:** Deliveries cannot be completed without entering the customer's secret verification OTP received via email/SMS.
- **Rider Vehicle Capacity Meter (`/courier/profile`):** Live telemetry gauge (e.g. 3/10 parcels) with dispatch load throttle warnings.

### 5. 🛡️ Executive Admin Command Center (`/admin`)
- **Recharts Analytics Deck:** 7-day revenue velocity AreaChart, Hub Volume throughput BarChart, and real-time SLA gauge.
- **Master Dispatch Board (`/admin/shipments`):** Full dispatch manifest with **Assign Courier Rider Modal** allowing admins to allocate consignments to specific delivery runners.
- **Sorting Hubs Directory (`/admin/hubs`):** Listing of regional distribution depots with **Register Hub Modal** (`POST /hubs`).
- **User Access Control (`/admin/users`):** Account role permissions, status toggles (`ACTIVE` / `BLOCKED`), and filter tabs.

---

## 🏛️ Next.js 16 App Router Architecture & Best Practices

- **Server vs Client Component Split:**
  - *Server Components (Default):* High-performance static marketing pages (`/about`, `/pricing`, `/services`, `/contact`), layouts, and metadata definitions.
  - *Client Components (`"use client"`):* Stateful interactive pages (`/login`, `/dashboard/book`, `/courier/deliveries`, `/admin/shipments`, Recharts analytics) wrapped in `<Suspense>` boundaries to guarantee zero prerender hydration errors.
- **Edge Route Protection (`middleware.ts`):** Decodes JWT tokens and session cookies at the edge, enforcing strict role-based route isolation (`/admin/*`, `/courier/*`, `/dashboard/*`).
- **State Management:**
  - Server Cache: **TanStack Query v5** with automated cache invalidation.
  - Client Store: **Zustand** with persistent local storage and cookie sync.
- **Form Validation:** **React Hook Form + Zod** schemas strictly matching backend DTO rules.
- **UX Polish:** Custom `loading.tsx` skeleton loader, `error.tsx` boundary with retry action, and logistics-themed `not-found.tsx`.

---

## 🎥 Video Explanation Walkthrough Guide (5–10 Minutes)

When recording your presentation video (OBS or Loom), follow this structured sequence:

1. **Project Overview & UI/UX Philosophy (1–2 min):**
   - Introduce SwiftTrack as an enterprise logistics platform for 64 districts in Bangladesh.
   - Show the redesigned Landing Page, the IATA volumetric calculator, and one-click sample tracking chips.
2. **Next.js 16 App Router Architecture (1 min):**
   - Highlight Server Components (`/about`, `/services`) vs Client Components (`/dashboard/book`, `/courier/deliveries`).
   - Show error boundary (`error.tsx`), skeleton loader (`loading.tsx`), and custom 404 (`not-found.tsx`).
3. **Authentication & Role-Based UI (2–3 min):**
   - Click **"Customer Demo"** button on `/login` ➔ Show merchant dashboard, booking wizard, and URL-synced filters.
   - Log out, click **"Courier Demo"** ➔ Show mobile rider layout, active delivery queue, and the **Customer 6-Digit OTP Verification Modal**.
   - Log out, click **"Admin Demo"** ➔ Show executive command center, Recharts analytics, and the **Assign Courier Rider Modal**.
4. **Stripe Payment & Live API Integration (1–2 min):**
   - Demonstrate booking a parcel, calculating volumetric fare, and redirecting to Stripe Checkout.
   - Show `/payment/success` with confetti celebration and printable receipt.
5. **Form Validation & Responsiveness (1 min):**
   - Trigger Zod form validation by submitting an invalid form.
   - Resize browser to mobile view to demonstrate full mobile-first responsiveness.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/raskirayhan/courier-frontend.git
cd courier-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
NEXT_PUBLIC_API_URL=https://industry-standard-project-raskirayhans-projects.vercel.app/api/v1

# 4. Run development server (Turbopack)
npm run dev
```

---

## 📜 Meaningful Conventional Commits (20+ Commits)

This repository strictly complies with the requirement of 20+ descriptive conventional commits:
1. `chore: initialize Next.js 15 App Router project with TypeScript and Tailwind CSS`
2. `feat(auth): implement one-click demo login, registration, and role-based middleware`
3. `feat(public): build public marketing portal and live tracking engine with fare calculator`
4. `feat(customer): implement customer portal with 4-step parcel booking wizard and shipment management`
5. `feat(payment): integrate Stripe checkout redirection, success celebration, and cancel recovery flows`
6. `feat(courier): implement mobile-first courier rider portal with active runs, vehicle profile, and OTP verification modal`
7. `fix(ui): enhance typography clarity, configure Inter font antialiasing, and boost text contrast across all portals`
8. `feat(ui): redesign landing hero, smart fare engine presets, interactive tracking stepper, and merchant trust ticker`
9. `feat(admin): build admin analytics command center with dispatch queues, hub management, and user controls`
10. `feat(hooks): extract useFareCalculator hook for reusable IATA tariff logic`
11. `feat(hooks): add useShipments custom hook for centralized consignment data fetching`
12. `feat(hooks): create useHubs query hook for logistics depot management`
13. `feat(ui): add Skeleton loading primitive for data-heavy states`
14. `feat(ui): create reusable StatCard component with trend indicators`
15. `refactor(constants): centralize logistics zone matrices and SLA thresholds`
16. `feat(seo): configure sitemap and robots.txt for search engine indexing`
17. `chore(config): allow .env.example and document gateway endpoints`
18. `chore(deploy): add Vercel deployment configuration with security headers`
19. `feat(ui): add accessible Dialog modal component for portal popups`
20. `docs: update comprehensive README with video walkthrough guide and assignment specifications`
