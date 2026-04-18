import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Report {
  id: string;
  location: { lat: number; lng: number };
  address: string;
  issueType: 'pothole' | 'streetlight' | 'sidewalk' | 'pipe' | 'drainage' | 'other';
  severity: number;
  confidence: number;
  description: string;
  photos: string[];
  status: 'submitted' | 'triaged' | 'scheduled' | 'in_progress' | 'resolved';
  createdAt: string;
  clusterId?: string;
  department: string;
}

export interface Cluster {
  id: string;
  centroid: { lat: number; lng: number };
  reportIds: string[];
  aggregateSeverity: number;
  failureRiskScore: number;
  predictedRepairDate: string;
  estimatedCost: number;
}

interface ReportStore {
  reports: Report[];
  clusters: Cluster[];
  userLocation: { lat: number; lng: number } | null;
  addReport: (report: Report) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  getNearbyReports: (lat: number, lng: number, radius: number) => Report[];
}

export const useReportStore = create<ReportStore>()(
  persist(
    (set, get) => ({
      reports: [],
      clusters: [],
      userLocation: null,
      
      addReport: (report) => {
        set((state) => ({
          reports: [report, ...state.reports],
        }));
      },
      
      updateReportStatus: (id, status) => {
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
      },
      
      setUserLocation: (location) => {
        set({ userLocation: location });
      },
      
      getNearbyReports: (lat, lng, radius) => {
        const { reports } = get();
        return reports.filter((report) => {
          const dx = report.location.lat - lat;
          const dy = report.location.lng - lng;
          const distance = Math.sqrt(dx * dx + dy * dy) * 111; // rough km conversion
          return distance <= radius;
        });
      },
    }),
    {
      name: 'civic-sense-store',
    }
  )
);
