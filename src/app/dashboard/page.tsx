'use client';

import { useReportStore } from '@/lib/store';
import { MapPin, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Copy } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const reports = useReportStore((state) => state.reports);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyToClipboard = (id: string) => {
  navigator.clipboard.writeText(id);
  setCopiedId(id);

  setTimeout(() => setCopiedId(null), 1500);
};

  const stats = useMemo(() => {
    return {
      total: reports.length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
      pending: reports.filter((r) => ['submitted', 'triaged'].includes(r.status)).length,
      avg: reports.length > 0
        ? (reports.reduce((s, r) => s + r.severity, 0) / reports.length).toFixed(1)
        : '0',
    };
  }, [reports]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-16">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Citizen Dashboard</h1>
          <p className="text-slate-500">Track your reported issues</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total', value: stats.total, icon: MapPin },
            { label: 'Resolved', value: stats.resolved, icon: CheckCircle },
            { label: 'Pending', value: stats.pending, icon: Clock },
            { label: 'Avg Severity', value: stats.avg, icon: TrendingUp },
          ].map((s, i) => (
            <div key={i} className="card card-hover flex justify-between">
              <div>
                <p className="text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <s.icon className="w-6 h-6 text-slate-400" />
            </div>
          ))}
        </div>

        {/* Reports */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Recent Reports</h2>

          {reports.length === 0 ? (
            <p className="text-slate-500">No reports yet</p>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="border rounded-xl p-4 hover:bg-slate-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{r.issueType}</h3>
                      <p className="text-sm text-slate-500">{r.address}</p>
                       <div className="flex items-center gap-2 mt-1">
  <span className="text-xs text-blue-600 font-medium">
    ID: {r.id}
  </span>

  <Copy
    className="w-4 h-4 text-slate-500 cursor-pointer hover:text-blue-600"
    onClick={() => copyToClipboard(r.id)}
  />

  {copiedId === r.id && (
    <span className="text-xs text-green-600">Copied!</span>
  )}
</div>
                    </div>
                    <span className="text-sm font-bold">{r.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}