# VenusOutlet - Full-Stack E-Commerce Platform

A modern, production-ready e-commerce platform built with **Next.js 15**, **React 18**, and **MongoDB**. VenusOutlet is a feature-rich online retail solution showcasing advanced full-stack development practices including real payment processing, inventory management, and responsive design.

**Live Demo:** [Venus Outlet](https://venusoutlet.net)

---

## 🎯 Project Overview

VenusOutlet is a sophisticated e-commerce platform serving as both a complete business solution and a portfolio demonstration of enterprise-level web development. The platform handles the complete customer journey from product discovery through order fulfillment, with robust backend systems for inventory, payments, and user management.

---

## ✨ Key Features

### 🛍️ **E-Commerce Core**
- **Product Catalog** - Dynamic product browsing with advanced filtering and search
- **Inventory Management** - Real-time stock tracking with variant support (size, color)
- **Shopping Cart** - Persistent cart with dual-mode storage (local & server-based)
- **Wishlist** - User wishlists with secure account persistence
- **Product Details** - Rich product pages with image galleries and specifications

### 💳 **Payment & Orders**
- **Multiple Payment Methods** - Paymob payment gateway integration + Cash on Delivery
- **Order Management** - Complete lifecycle tracking (Pending → Confirmed → Shipped → Delivered)
- **Cancellation Requests** - Built-in order cancellation workflow
- **Payment Webhooks** - Secure HMAC-verified payment status updates
- **Invoice Generation** - Automatic PDF invoicing with RTL support (Arabic/English)

### 🎁 **Promotions & Marketing**
- **Dynamic Promotions** - Flexible discount system with multiple types:
  - Automatic promotions (cart-based)
  - Minimum subtotal promotions
  - Minimum quantity promotions
- **Coupon Codes** - Limited-use promotional codes with usage tracking
- **Category & Product-Specific Offers** - Targeted discounts
- **Promotion Banner** - Dynamic promotion display on homepage

### 👤 **Authentication & User Management**
- **NextAuth.js Integration** - Secure authentication with:
  - Google OAuth sign-in
  - Email/Password credentials
  - JWT-based sessions (30-day default)
- **Email Verification** - OTP verification for new accounts
- **User Profiles** - Account management and order history
- **Password Recovery** - Secure password reset flow

### 🌐 **Internationalization & UX**
- **RTL Support** - Full right-to-left language support (Arabic)
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Error Boundaries** - Graceful error handling with fallback UI
- **Loading States** - Skeleton screens and spinners for smooth UX
- **Toast Notifications** - Real-time user feedback (Sonner)

### 📊 **Admin & Analytics**
- **Order Tracking** - Dashboard for order management and status updates
- **Google Analytics** - Integrated analytics with gtag
- **Product Management** - Complete CRUD operations for products
- **Category Management** - Hierarchical category system
- **User Management** - Admin user controls

### 🔒 **Security & Performance**
- **Rate Limiting** - Protection against brute force attacks
- **HMAC Verification** - Secure payment webhook validation
- **Email Notifications** - Transactional emails (Nodemailer)
- **Image Optimization** - Multi-CDN support (MinIO, AWS S3, Cloudflare R2)
- **SEO Optimization** - Meta tags, Open Graph, XML sitemaps
- **CORS & Security Headers** - Production-ready security

### 📱 **UI Components**
- **Carousel/Slider** - Image galleries and product sliders (Keen Slider)
- **Modal System** - Reusable modal components for:
  - Auth (Sign In)
  - Search
  - User Profile
  - Testimonials
  - Shipping Forms
  - Product Carousel
- **Material-UI Integration** - Professional UI components
- **Custom Buttons & Forms** - Tailored component library

---

## 🏗️ Architecture

### **Tech Stack**

**Frontend:**
- Next.js 15 (React 18)
- Tailwind CSS + RTL support
- Material-UI (MUI)
- Keen Slider
- React PDF Renderer
- Lucide React Icons

**Backend:**
- Next.js API Routes
- NextAuth.js
- Express-style middleware

**Database:**
- MongoDB + Mongoose ODM
- 10+ data models (Products, Orders, Users, Promotions, etc.)

**External Services:**
- Paymob (Payment Gateway)
- Nodemailer (Email Service)
- Google OAuth

**DevTools:**
- ESLint + TypeScript support
- PostCSS
- Autoprefixer

### **Database Schema**

- **Product** - Title, variants, pricing, categories, metadata
- **Order** - Line items, shipping, payment status, totals
- **User** - Authentication, verification, preferences
- **Promotion** - Discount rules, codes, expiration
- **Cart** - User shopping cart persistence
- **WishList** - Saved items
- **Category** - Product organization (parent/child)
- **Shipping** - Shipping options & costs
- **Subscription** - Newsletter subscriptions
- **Testimonial** - Customer reviews
- **Branch** - Multi-location support

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB instance
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone https://github.com/yourname/venus-outlet.git
cd VenusOutlet

# Install dependencies
npm install

# Configure environment variables
# Create a .env.local file with:
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
PAYMOB_API_KEY=your_paymob_key
PAYMOB_HMAC=your_paymob_hmac_secret
WEBSITE_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build & Deployment

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
VenusOutlet/
├── components/           # React components
│   ├── cart/            # Cart-related components
│   ├── modals/          # Modal components
│   └── sections/        # Page sections
├── pages/               # Next.js pages & API routes
│   ├── api/             # Backend API endpoints
│   │   ├── auth/        # Authentication endpoints
│   │   ├── paymob/      # Payment webhooks
│   │   └── ...          # Other API routes
│   └── ...              # Frontend pages
├── models/              # Mongoose schemas (10+ models)
├── contexts/            # React Context providers
├── lib/                 # Utility functions & helpers
├── styles/              # Global CSS
├── public/              # Static assets
└── config files         # next.config.js, tailwind.config.js, etc.
```

---

## 🔑 Key Technologies Demonstrated

| Feature | Technology | Purpose |
|---------|-----------|---------|
| **Framework** | Next.js 15 | SSR/SSG, API routes, file-based routing |
| **State Management** | React Context | Cart, promotions, wishlists |
| **Database** | MongoDB + Mongoose | Data persistence & relationships |
| **Authentication** | NextAuth.js + Google OAuth | Secure user authentication |
| **Styling** | Tailwind CSS | Responsive design with RTL support |
| **Payments** | Paymob API | Production payment processing |
| **Email** | Nodemailer | Transactional emails |
| **PDF Generation** | React PDF Renderer | Invoice creation |
| **Images** | Multi-CDN support | Performance optimization |

---

## 📊 API Routes

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/forgot-password` - Password recovery
- `POST /api/auth/reset-password` - Password reset

### **Products & Categories**
- `GET /api/products` - List products with filters
- `GET /api/products/[id]` - Product details
- `GET /api/categories` - Category listing
- `GET /api/allcategories` - Full category hierarchy

### **Cart & Checkout**
- `POST /api/cart` - Add/update cart items
- `GET /api/cart` - Fetch user cart
- `POST /api/checkout` - Process checkout
- `POST /api/payment-status` - Check payment status

### **Orders**
- `GET /api/orders` - User orders
- `GET /api/orders/[id]` - Order details
- `POST /api/orders/[id]/cancel` - Request cancellation

### **Promotions**
- `GET /api/promotions` - Available promotions
- `POST /api/promotions/apply` - Apply promotion
- `POST /api/promotions/applycode` - Apply coupon code

### **Payment Webhooks**
- `POST /api/paymob/webhook` - Paymob payment callback

---

## 🎓 Development Highlights

### **Best Practices Implemented:**
- ✅ Error boundary components for fault tolerance
- ✅ Server-side session management with JWT
- ✅ Input validation and sanitization
- ✅ Rate limiting for API security
- ✅ HMAC signature verification for webhooks
- ✅ Responsive and accessible UI components
- ✅ SEO optimization (meta tags, sitemaps)
- ✅ Environment-based configuration
- ✅ Async/await patterns for data fetching
- ✅ Context API for state management

### **Performance Optimizations:**
- Next.js Image optimization with multiple CDN providers
- Lazy loading for components and routes
- React Suspense boundaries
- Skeleton screens during loading
- Optimized database queries with indexing

### **User Experience:**
- Mobile-first responsive design
- RTL language support for Arabic
- Toast notifications for feedback
- Error states with helpful messages
- Loading spinners and animations
- Smooth transitions and animations

---

## 🔐 Security Features

- **NextAuth.js** - Industry-standard authentication
- **HTTPS-only Cookies** - Secure session tokens
- **HMAC Verification** - Payment webhook validation
- **Password Hashing** - bcryptjs for secure storage
- **Email Verification** - OTP confirmation for accounts
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Restricted cross-origin access
- **Environment Variables** - Secrets management

---

## 📈 Future Enhancements

- [ ] Admin dashboard with analytics
- [ ] Advanced search with Elasticsearch
- [ ] Product reviews and ratings
- [ ] Wishlist sharing
- [ ] Email marketing campaigns
- [ ] Inventory alerts
- [ ] Multi-language dashboard
- [ ] Progressive Web App (PWA)
- [ ] Caching layer (Redis)
- [ ] Unit and integration tests

---

## 🤝 Contributing

This is a portfolio project. For improvements or feedback, please open an issue or submit a pull request.

---

## 📝 License

Private portfolio project.

---

## 📧 Contact

For inquiries or to discuss this project:
- **Website:** [venusoutlet.net](https://venusoutlet.net)
- **Email:** [contact information]

---

## 🎯 Project Statistics

- **Frontend Pages:** 15+
- **API Endpoints:** 40+
- **Database Models:** 10+
- **React Components:** 30+
- **Lines of Code:** 5000+
- **Technologies Used:** 20+

---

**Built with ❤️ as a full-stack e-commerce solution demonstrating modern web development practices.**
