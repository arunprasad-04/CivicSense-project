# CivicSense - AI-Powered Urban Infrastructure Reporting

A modern, professional Next.js application for reporting and managing urban infrastructure issues with AI-powered damage analysis, geospatial clustering, and predictive maintenance scheduling.

## 🌟 Features

### For Citizens
- **📍 Offline-First PWA**: Report issues even without internet connectivity
- **📸 Photo Upload**: Attach images for AI analysis
- **🗺️ Location-Based Reporting**: Automatic location detection
- **📊 Status Tracking**: Real-time updates on reported issues
- **🎯 Smart Categorization**: Easy issue type selection (potholes, streetlights, etc.)

### For Municipal Administrators
- **🚀 Real-Time Dashboard**: Live heatmap of all reported issues
- **🧠 AI-Powered Severity Scoring**: Automatic damage assessment
- **🎯 Geospatial Clustering**: Detect infrastructure failure patterns
- **📈 Predictive Analytics**: Forecast repairs and maintenance needs
- **💼 Department Routing**: Auto-assign issues to correct departments
- **💰 Cost Forecasting**: Projected repair budgets

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - App Router with TypeScript
- **Tailwind CSS** - Responsive design
- **Lucide React** - Beautiful icons
- **Zustand** - State management
- **Dexie.js** - Offline IndexedDB support
- **PWA** - Offline-first capabilities

### Backend (Structure)
- **FastAPI (Python)** - REST + WebSocket API
- **PostgreSQL + PostGIS** - Geospatial database
- **Redis** - Caching and task queues
- **Celery** - Async job processing

### AI/ML
- **Claude Vision API** - Photo analysis
- **Fine-tuned ResNet** - Damage classification
- **DBSCAN** - Spatial clustering
- **LightGBM** - Predictive modeling

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Landing page
│   ├── report/
│   │   └── page.tsx       # Report submission flow
│   ├── dashboard/
│   │   └── page.tsx       # Citizen dashboard
│   ├── admin/
│   │   └── page.tsx       # Admin portal
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── navbar.tsx         # Navigation bar
│   └── footer.tsx         # Footer
└── lib/
    └── store.ts           # Zustand store
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Pages

### 🏠 Landing Page (`/`)
- Feature showcase
- Call-to-action buttons
- Statistics and impact metrics
- Responsive hero section

### 📍 Report Issue (`/report`)
- Multi-step form wizard
- Location detection
- Issue type selection
- Photo upload with AI preview
- Comprehensive review before submission

### 📊 Citizen Dashboard (`/dashboard`)
- Overview statistics
- Report history and status
- Severity visualization
- Real-time updates

### 👨‍💼 Admin Portal (`/admin`)
- Real-time KPIs
- Department workload visualization
- Severity distribution charts
- Advanced filtering
- Predictive insights
- Cost forecasting

## 🎨 Design Features

- **Modern Gradient UI**: Blue/Indigo color scheme
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer motion integration
- **Professional Polish**: Hover effects and transitions
- **Dark Mode Ready**: Built for CSS customization

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Run ESLint
```

## 🔐 State Management

Reports are stored with **Zustand** and persisted to **IndexedDB** for offline capability:

```typescript
const { reports, addReport, updateReportStatus } = useReportStore();
```

## 🌐 API Endpoints (Schema)

### Citizen APIs
- `POST /api/reports` - Submit new report
- `GET /api/reports/{id}` - Get report details
- `GET /api/reports/nearby` - Find nearby reports

### AI Pipeline APIs
- `POST /api/ai/analyze-photo` - Vision analysis
- `POST /api/ai/cluster-reports` - Spatial clustering
- `POST /api/ai/predict-failure` - Failure prediction
- `POST /api/ai/generate-work-order` - LLM work orders

### Admin APIs
- `GET /api/admin/heatmap` - GeoJSON heatmap
- `GET /api/admin/clusters` - Active clusters
- `GET /api/admin/work-orders` - Work order tracking
- `PATCH /api/admin/reports/{id}/status` - Status updates
- `GET /api/admin/analytics/cost-forecast` - Cost predictions

## 📊 Data Models

### Report
```typescript
{
  id: string;
  location: { lat: number; lng: number };
  address: string;
  issueType: 'pothole' | 'streetlight' | 'sidewalk' | 'pipe' | 'drainage' | 'other';
  severity: 0-10;
  confidence: 0-1;
  photos: string[];
  status: 'submitted' | 'triaged' | 'scheduled' | 'in_progress' | 'resolved';
  createdAt: string;
}
```

## 🔍 Key Components

### Navbar
Sticky navigation with mobile menu, logo, and quick links to all major sections.

### Report Form
4-step wizard:
1. Location detection
2. Issue details & description
3. Photo upload
4. Final review

### Statistics Cards
Real-time KPI display with performance metrics.

### Reports List
Detailed table view with severity indicators and status badges.

### Heatmap (Admin)
Visual representation of issue distribution across the city.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t civicsense .
docker run -p 3000:3000 civicsense
```

## 🔄 Next Steps

1. **Backend Integration**: Connect FastAPI endpoints
2. **Database Setup**: Configure PostgreSQL + PostGIS
3. **AI Pipeline**: Integrate Claude Vision API
4. **Authentication**: Implement Supabase Auth
5. **Maps Integration**: Add Mapbox GL for geospatial visualization
6. **Push Notifications**: Setup Firebase Cloud Messaging
7. **SMS Alerts**: Integrate Twilio

## 📚 Documentation

Full API documentation and setup guides available in the backend repository.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Project Status

**Status**: MVP Phase 1 ✅ Complete
- Landing page & branding
- Report submission flow
- Citizen dashboard
- Admin portal
- State management

**Next Phases**:
- Phase 2: Backend API + Database
- Phase 3: AI/ML Integration
- Phase 4: Mobile App
- Phase 5: Advanced Analytics

## 📞 Contact & Support

For questions or support, reach out to the CivicSense team.

---

Built with ❤️ for smarter cities

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
