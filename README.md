# ⚓ Anchor Point

Anchor Point is a professional-grade tracking link platform designed to capture comprehensive visitor data including precise GPS coordinates (with permission), IP-based geolocation, device information, and browser details.

## 🚀 Features

- **🎯 Precise Tracking**: Captures GPS coordinates directly from the browser for maximum accuracy.
- **🌍 IP Geolocation**: Automatic fallback to IP-based location (Country, Region, City, ISP, Org) if GPS is unavailable.
- **📱 Device Intelligence**: Detailed OS, Browser, and Device Type detection using `ua-parser-js`.
- **📊 Admin Dashboard**: Real-time stats, interactive maps, and detailed visit logs.
- **🔗 Link Management**: Create, manage, and monitor custom tracking slugs.
- **🌓 Modern UI**: Sleek dark-mode interface with a fully responsive mobile sidebar and `rem`-based scalable design.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL with Drizzle ORM
- **Authentication**: NextAuth.js (v4)
- **Visualization**: Leaflet.js for interactive mapping
- **Styling**: Vanilla CSS with a custom design system

## 📦 Setup & Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=mysql://root:password@localhost:3306/anchor_point
   ADMIN_PASSWORD=your_secure_password
   NEXTAUTH_SECRET=a_random_32_character_string
   NEXTAUTH_URL=http://localhost:3000
   ```
4. **Initialize Database**:
   ```bash
   npm run db:push
   ```
5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔒 Security

- Admin routes are protected via JWT-based authentication.
- Sensitive tracking data is stored securely in your private MySQL instance.

---
*Built for educational and security research purposes.*
