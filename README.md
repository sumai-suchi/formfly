# FormFly — Modern Conversational Form & Chatbot Widget Platform

> Transform static, boring form fields into engaging, high-converting chatbot dialogues that can be embedded on any external website with a single `<script>` tag.

![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql)

---

## 🌟 Overview

**FormFly** is a full-stack web application engineered to solve form fatigue and improve submission rates. Instead of presenting respondents with a wall of 10+ open inputs, FormFly asks **one question at a time** in an intuitive messenger-style dialogue with instant keyboard navigation, real-time client/server validation, and custom brand theme styling.

---

## 🚀 Key Features Implemented

### 1. Landing Page
- **Hero Section**: Punchy value proposition, live chat demo teaser, and dual CTAs ("Create Free Form" and "View Interactive Demo").
- **Features Section**: Bento-grid breakdown highlighting one-question-at-a-time UX, keyboard ergonomics, brand palette customization, and 3x conversion metrics.
- **How It Works Section**: 3-step workflow (Build in Minutes → Theme & Brand → Embed & Collect).
- **Interactive Live Simulator**: Allows prospective customers to test lead capture, customer feedback, and event RSVP flows with live code snippet generation directly in their browser.
- **Dedicated Subpages**: Dedicated marketing routes for `/features`, `/how-it-works`, and `/demo`.
- **Responsive Footer**: Product navigation links, developer integration guide, newsletter subscription, and system status indicator.

### 2. User Dashboard
- **Analytics & Counters**: Real-time summary cards displaying Total Forms, Published Forms, Total Responses, and Active Forms.
- **Form Management**: Full CRUD operations — Create new forms, edit titles and settings, delete forms with confirmation modals, and toggle status between `DRAFT` and `PUBLISHED`.
- **Submissions Hub**: Dedicated responses view with form filtering, response timestamps, granular question-and-answer inspection modals, and pagination.
- **Sidebar & Topbar Navigation**: Intuitive navigation with user profile badge and secure logout functionality.

### 3. Form Builder & Studio
- **Question Types**:
  - `TEXT`: Single or multi-line freeform text answers.
  - `EMAIL`: Validated email addresses with regex check.
  - `MULTIPLE_CHOICE`: Custom clickable choice chips with dynamic option management.
  - `YES_NO`: High-contrast binary toggle buttons.
- **Reordering & Management**: Move questions up/down with instantaneous drag-like API reordering, edit question copy, mark questions as `required`, and delete questions.
- **Live Side-by-Side Preview**: Real-time interactive conversation preview on the right side of the screen with both **Inline** and **Floating Widget** simulation modes.
- **Theme & Colors Studio**:
  - 12 curated color palettes (Indigo, Modern Violet, Electric Blue, Emerald, Sunset Orange, Rose Pink, etc.).
  - Custom HEX color input and native HTML5 color wheel.
  - **Zero-delay (0ms) instant preview update** on the chat canvas upon color selection.

### 4. Chatbot Widget & Embedding
- **Vanilla JavaScript Widget (`public/formfly-widget.js`)**:
  - Under 3KB lightweight payload with zero external dependencies.
  - Floating pill launcher button anchored to `bottom-right` or `bottom-left`.
  - Sandboxed `<iframe>` viewport preventing CSS conflicts with the host website.
  - Bi-directional `postMessage` communication for automatic drawer resizing and closing.
  - 100% responsive: renders as an elegant floating popover on desktop and smooth full-screen modal on mobile.
- **Embed Modal**: Copy-pasteable `<script>` tag generator with live device toggle and quick instructions for Webflow, WordPress, Shopify, Next.js, and static HTML.
- **Test Embed Playground**: Dedicated route `/forms/[publicId]/test-widget` enabling creators to test their widget in a simulated external website environment with automatic teardown on navigation.

### 5. Responses & Publishing
- **Unique Public URLs**: Each form receives a permanent slug (`/forms/[publicId]`).
- **Access Control & Privacy**: Draft forms remain private to their creator; only published forms accept live external submissions.
- **Database Storage**: Submissions are validated and stored in PostgreSQL with indexed foreign keys, answer payloads, and ISO timestamps.

### 6. Authentication & Security
- **Next.js 16 Edge Proxy (`src/proxy.ts`)**: Automatic route protection redirecting unauthorized visitors attempting to access `/dashboard` to `/login?from=...`.
- **Secure Sessions**: HTTP-only JWT cookies (`formflow_session`) verified via `jose`.
- **Dynamic Navbar State**: Shows Login/Signup for guests, and User Email/Name + Dashboard Link + Logout button for authenticated users.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.4.2](https://nextjs.org/) (App Router & Turbopack) |
| **Frontend Library** | [React 19.3.0](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [GSAP 3.15](https://greensock.com/gsap/) & `@gsap/react` |
| **ORM & Database** | [Prisma 7.9](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) |
| **Authentication** | JWT via [`jose`](https://github.com/panva/jose) & `bcryptjs` |
| **Validation** | [Zod 4](https://zod.dev/) |

---

## 📦 Project Structure

```
formfly/
├── prisma/
│   └── schema.prisma                  # Prisma data models (User, Form, Question, Submission)
├── public/
│   ├── formfly-widget.js              # Standalone embeddable floating chatbot widget
│   └── ...
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/             # Dashboard, forms manager, submissions, builder
│   │   ├── (public)/
│   │   │   ├── (auth)/                # Login & Register routes
│   │   │   ├── (marketing)/           # Landing page, /features, /how-it-works, /demo
│   │   │   └── forms/[publicId]/      # Standalone form viewer & /test-widget playground
│   │   └── api/
│   │       ├── auth/                  # Login, register, logout, session check
│   │       ├── forms/                 # Form CRUD & question management API
│   │       └── public/forms/          # Public form metadata & submission collector
│   ├── components/
│   │   ├── authComponents/            # LoginForm, RegisterForm
│   │   ├── dashboard/                 # FormsList, Pagination, EmbedCodePanel, Sidebar
│   │   ├── formBuilder/               # BuilderLayout, QuestionsPanel, ChatPreview, Modals
│   │   ├── Navbar.tsx                 # Dynamic navigation bar with auth & logout state
│   │   └── Footer.tsx                 # Site footer with links
│   ├── lib/
│   │   ├── auth.ts                    # JWT token generation & cookie extraction
│   │   ├── prisma.ts                  # Prisma Client singleton
│   │   └── gsap.ts                    # Smooth scrolling & animation utilities
│   ├── proxy.ts                       # Next.js 16 Edge proxy for route protection
│   └── types/
│       └── form.ts                    # TypeScript types and interfaces
└── package.json
```

---

## 💻 Local Setup & Installation

Follow these steps to run FormFly on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/formfly.git
cd formfly
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):
```bash
cp .env.example .env
```

Set the required environment variables:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/formfly?sslmode=prefer"

# JWT Secret for secure cookie authentication
JWT_SECRET="formfly-super-secret-jwt-key-2026-production-ready"

# Application base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Sync Database Schema
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

*(Optional) Generate Prisma Client if not generated automatically:*
```bash
npx prisma generate
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Embedding the Widget

To embed a FormFly chatbot form onto any website (HTML, WordPress, Webflow, Shopify, etc.), paste the following snippet before the closing `</body>` tag:

```html
<script
  src="https://your-domain.com/formfly-widget.js"
  data-form-id="YOUR_FORM_PUBLIC_ID"
  data-theme="#4f46e5"
  data-position="bottom-right"
  data-btn-text="Chat with us"
  async>
</script>
```

### Widget Configuration Options
| Attribute | Description | Default |
|---|---|---|
| `data-form-id` | **Required.** The unique public ID of your published form. | `""` |
| `data-theme` | Primary accent HEX color for launcher button and chat bubbles. | `#4f46e5` |
| `data-position` | Floating button placement (`bottom-right` or `bottom-left`). | `bottom-right` |
| `data-btn-text` | Label text displayed on the launcher pill. | `"Chat with us"` |

---

## 🧪 Testing & Verification

Run the test and build checks:

```bash
# Type-checking
npx tsc --noEmit

# ESLint audit
npm run lint

# Production build
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
