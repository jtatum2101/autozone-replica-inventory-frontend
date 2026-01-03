# AutoZone Inventory Management - Frontend Dashboard

Interactive React dashboard for real-time inventory monitoring and intelligent reorder management.

> **Part of the AutoZone Inventory Management System**
> Backend Repository: [autozone-replica-inventory-system](https://github.com/jtatum2101/autozone-replica-inventory-system)

---

## 🎯 Overview

This is the frontend interface for a full-stack inventory management system built to demonstrate enterprise-level software development skills. The dashboard provides real-time monitoring of automotive parts inventory across multiple AutoZone store locations with intelligent reorder recommendations.

**Built for**: AutoZone Summer 2025 Internship Interview
**Tech Stack**: React 18, Vite, Tailwind CSS, Axios

---

## ✨ Features

### 📊 Real-Time Monitoring
- Live inventory levels across all stores
- Color-coded alerts for low stock items
- Visual progress bars showing stock capacity

### 🔍 Advanced Search & Filtering
- Search parts by name or SKU
- Filter inventory by store location
- Active filter badges with quick clear options

### 🛒 Interactive Order Management
- Click-to-order functionality with detailed modal
- Adjustable order quantities (+10/-10 buttons)
- Cost calculations with supplier information
- Recommended order quantities based on algorithm

### 📈 Smart Reorder Alerts
- Algorithm-driven reorder recommendations
- Sales velocity analysis integration
- Lead time and safety stock considerations

### 🏪 Multi-Store Support
- Filter by specific store locations
- View all Memphis-area AutoZone stores
- Store type indicators (HUB, STANDARD, COMMERCIAL)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Backend running** on `http://localhost:8080`
  - See [backend setup instructions](https://github.com/jtatum2101/autozone-replica-inventory-system#-getting-started)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jtatum2101/autozone-replica-inventory-frontend.git
cd autozone-replica-inventory-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:5173
```

You should see the dashboard with live data from the backend!

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling framework |
| **Axios** | HTTP client for API communication |
| **React Hooks** | Modern state management (useState, useEffect) |

---

## 📁 Project Structure
```
inventory-frontend/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx      # Main dashboard component
│   ├── services/
│   │   └── api.js             # API service layer (Axios)
│   ├── App.jsx                # Root component
│   ├── index.css              # Global styles + Tailwind
│   └── main.jsx               # Entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

---

## 🔧 Configuration

### API Endpoint

The backend API endpoint is configured in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

For production deployment, update this to your deployed backend URL.

### Available API Endpoints

The dashboard connects to these backend endpoints:

- `GET /api/inventory` - All inventory items
- `GET /api/inventory/reorder` - Items needing reorder
- `GET /api/inventory/low-stock` - Low stock alerts
- `GET /api/inventory/store/{id}` - Store-specific inventory
- `GET /api/stores` - All store locations
- `GET /api/parts` - All parts catalog

---

## 🎨 UI Components

### Dashboard Stats Cards
- Total stores count
- Items needing reorder (orange badge)
- Low stock alerts (red badge)

### Filter Controls
- Store selector dropdown
- Part search input
- Active filter badges with clear buttons

### Reorder Alerts Table
- Part details (name, SKU)
- Store location
- Current stock vs reorder point
- Action buttons for ordering

### Low Stock Cards
- Visual stock level indicators
- Progress bars showing capacity
- Click-to-order functionality

### Order Modal
- Comprehensive part information
- Delivery location details
- Adjustable quantity controls
- Supplier and cost breakdown
- Confirm/cancel actions

### Store Location Cards
- Store type badges (HUB/STANDARD/COMMERCIAL)
- Address and contact information
- Click to filter by store

---

## 🎯 User Interactions

### Search Functionality
Type in the search bar to filter parts by:
- Part name (e.g., "battery", "oil")
- SKU code (e.g., "DU-48AGM")

### Store Filtering
- Select a store from the dropdown to view only that location's inventory
- Click any store card to quickly filter by that store
- Clear filters individually or all at once

### Placing Orders
1. Click **"Order Now"** on any reorder item
2. Review part and store details in the modal
3. Adjust quantity using +10/-10 buttons or type directly
4. Click **"Use Recommended"** for algorithm-calculated quantity
5. Review total cost calculation
6. Click **"Confirm Order"** to place (simulated)

---

## 🚧 Roadmap

### Planned Features
- [ ] **Sales Trend Charts** - Visualize sales velocity with Chart.js
- [ ] **JWT Authentication** - Login system with role-based access
- [ ] **Mobile Optimization** - Improved responsive design for phones
- [ ] **Export Functionality** - Download reports as CSV/PDF
- [ ] **Dark Mode** - Toggle between light and dark themes
- [ ] **Real-time Updates** - WebSocket integration for live data
- [ ] **Advanced Analytics** - Sales forecasting and trend analysis
- [ ] **Notifications** - Email alerts for critical low stock

---

## 🔗 Related Repositories

**Backend API**: [autozone-replica-inventory-system](https://github.com/jtatum2101/autozone-replica-inventory-system)
- Spring Boot 3.4.12
- PostgreSQL 16
- Intelligent reorder algorithm
- Comprehensive REST APIs

---

## 👤 Author

**Jeremiah Tatum**
- GitHub: [@jtatum2101](https://github.com/jtatum2101)
- Built: December 2024
- Purpose: AutoZone Summer 2025 Internship Interview Project

---

## 📄 License

This project was created for educational and demonstration purposes.

---

## 🙏 Acknowledgments

- AutoZone for the internship opportunity
- React and Vite teams for excellent developer tools
- Tailwind CSS for the utility-first framework

---