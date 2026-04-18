'use client';

import { useReportStore } from '@/lib/store';
import { MapPin, AlertCircle, TrendingUp, Users, DollarSign, Calendar, Zap, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AdminPage() {
  const reports = useReportStore((state) => state.reports);
  const updateReportStatus = useReportStore((state) => state.updateReportStatus);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const filteredReports = useMemo(() => {
    if (filterStatus === 'all') return reports;
    return reports.filter((r) => r.status === filterStatus);
  }, [reports, filterStatus]);

  const stats = useMemo(() => {
    return {
      totalReports: reports.length,
      criticalIssues: reports.filter((r) => r.severity >= 8).length,
      estimatedCost: (reports.reduce((sum, r) => sum + r.severity * 5000, 0)).toFixed(1),
      averageResolutionTime: '2.4 days',
      departmentRoads: reports.filter((r) => r.issueType === 'pothole').length,
      departmentUtilities: reports.filter((r) =>
        ['pipe', 'drainage'].includes(r.issueType)
      ).length,
    };
  }, [reports]);

  const severityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (severity >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (severity >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'triaged':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Municipal Admin Portal</h1>
          <p className="text-slate-500">
            Real-time infrastructure monitoring and predictive maintenance dashboard
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total Reports', value: stats.totalReports, icon: MapPin, color: 'blue' },
            { label: 'Critical Issues', value: stats.criticalIssues, icon: AlertCircle, color: 'red' },
            { label: 'Est. Repair Cost', 
            value: new Intl.NumberFormat('en-IN',{
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
              }).format(stats.estimatedCost), 
              icon: DollarSign, 
              color: 'emerald'
          },
            { label: 'Avg Resolution', value: stats.averageResolutionTime, icon: Calendar, color: 'orange' },
          ].map((item, i) => (
            <div key={i} className="card card-hover">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                </div>
                <item.icon className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Department + Severity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">

          {/* Department */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Department Workload
            </h2>

            <div className="space-y-4">
              {[
                { name: 'Roads', value: stats.departmentRoads },
                { name: 'Utilities', value: stats.departmentUtilities },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span>{d.name}</span>
                    <span className="font-bold">{d.value}</span>
                  </div>
                  <div className="bg-slate-200 h-2 rounded-full">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" /> Severity Distribution
            </h2>
            <p className="text-slate-500">Visual distribution of issue severity</p>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Reports</h2>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">All</option>
              <option value="resolved">Resolved</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">{r.issueType}</td>
                    <td className="p-3">{r.address}</td>
                    <td className="p-3">{r.severity}</td>
                    <td className="p-3">{r.status}</td>
                    {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                   {/* 🔥 ACTION BUTTON */}
                  <td className="p-4">
                    {r.status !== 'resolved' ? (
                      <button
                        onClick={() =>
                          updateReportStatus(r.id, 'resolved')
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Mark as Solved
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        ✔ Resolved
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                     onClick={() => setSelectedReport(r)}
                     className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    > View Details </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      {selectedReport && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto">

      <h2 className="text-xl font-bold mb-4">Complaint Details</h2>

      <p><strong>ID:</strong> {selectedReport.id}</p>
      <p><strong>Type:</strong> {selectedReport.issueType}</p>
      <p><strong>Address:</strong> {selectedReport.address}</p>
      <p><strong>Description:</strong> {selectedReport.description}</p>
      <p><strong>Severity:</strong> {selectedReport.severity}</p>
      <p><strong>Status:</strong> {selectedReport.status}</p>

      {/* 🔥 IMAGES */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Images:</p>

        {selectedReport.photos?.length === 0 ? (
          <p className="text-sm text-gray-500">No images</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {selectedReport.photos?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt="report"
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setSelectedReport(null)}
        className="mt-4 bg-gray-200 px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}