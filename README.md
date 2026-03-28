# VenusOutlet - Full-Stack E-Commerce Platform

VenusOutlet is a complete, production-grade e-commerce application built with Next.js 15, React 18, and MongoDB. It demonstrates an enterprise-level implementation of front-end, back-end, and operational features suitable for client-facing portfolio presentation.

Live demo: https://venus-demo-hkvl.vercel.app/

---

## Project Overview

This platform provides a full customer lifecycle experience, including product browsing, cart management, checkout, payment processing, and order management. It also includes an administrative and operational backend for product, category, order, promotion, and user management.

---

## Key Features

### E-Commerce
- Product catalog with filters and category navigation
- Inventory management with variant control (size, color, stock)
- Cart system with local storage and server-side persistence
- Wishlist system with user account sync
- Product detail pages with image carousel and variant selection

### Payment and Orders
- Paymob payment gateway integration and Pay on Delivery option
- Order lifecycle management (Pending, Confirmed, Shipped, Delivered)
- Order cancellation request workflow
- Payment webhook handling with HMAC validation
- Invoice PDF generation using React PDF renderer

### Promotions
- Rule-based promotions (auto, min subtotal, min quantity)
- Coupon code functionality with usage limits
- Product and category-specific promotion assignment
- Homepage promotion banners and active offers display

### Authentication and Users
- NextAuth.js with Google OAuth and credentials (email/password)
- JWT session strategy with long-lived session support
- Email verification with OTP for new users
- User profile, address, and order history management
- Password recovery flow and strength validation

### UX and Locale Support
- Responsive UI built with Tailwind CSS
- RTL support for Arabic content and layout
- Error boundary handling for stable UI behavior
- Loading states and skeleton loaders
- Toast-based user notifications

### Admin and Analytics
- Order management interface for admin workflows
- Google Analytics event logging
- Product and category CRUD operations
- User management functions

### Security and Performance
- API rate limiting for key endpoints
- Webhook HMAC verification for Paymob
- Transactional emails via Nodemailer
- Image optimization with multi-host remote patterns
- SEO features: meta tags, Open Graph, canonical, sitemap routes

### UI Components
- Sliders and carousels using Keen Slider
- Reusable modal components for dialogs and forms
- Material-UI component usage for inputs and icons
- Consistent design system with custom components and buttons

---

## Architecture

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

## Getting Started

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

## Project Structure

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

## Key Technologies Demonstrated

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

## API Routes

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

## Development Highlights

### Best Practices Implemented:
- Error boundary components for fault tolerance
- Server-side session management with JWT
- Input validation and sanitization
- Rate limiting for API security
- HMAC signature verification for webhooks
- Responsive and accessible UI components
- SEO optimization (meta tags, sitemaps)
- Environment-based configuration
- Async/await patterns for data fetching
- Context API for state management

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

## Security Features

- **NextAuth.js** - Industry-standard authentication
- **HTTPS-only Cookies** - Secure session tokens
- **HMAC Verification** - Payment webhook validation
- **Password Hashing** - bcryptjs for secure storage
- **Email Verification** - OTP confirmation for accounts
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Restricted cross-origin access
- **Environment Variables** - Secrets management

---

## Future Enhancements

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

## Contributing

This is a portfolio project. For improvements or feedback, please open an issue or submit a pull request.

---

## License

Private portfolio project.

---

## Contact

For inquiries or to discuss this project:
- **WhatsApp:** [+20 10 1209 7264](https://wa.me/+201012097264)
- **Email:** [ibrahim10ashraf@outlook.com]

---

## Screenshots

![Hero section screenshot](https://venus-demo-hkvl.vercel.app/hero.png)

![Categories screenshot](https://venus-demo-hkvl.vercel.app/categories.png)

![Product details screenshot](https://venus-demo-hkvl.vercel.app/product.png)

![Product slider screenshot](https://venus-demo-hkvl.vercel.app/productsslider.png)

![Cart screenshot](https://venus-demo-hkvl.vercel.app/cart.png)

---

## Project Statistics

- **Frontend Pages:** 15+
- **API Endpoints:** 40+
- **Database Models:** 10+
- **React Components:** 30+
- **Lines of Code:** 5000+
- **Technologies Used:** 20+

---

Built as a full-stack e-commerce solution demonstrating modern web development practices.
