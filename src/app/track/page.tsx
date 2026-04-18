'use client';

import { useState } from 'react';
import { useReportStore } from '@/lib/store';

export default function TrackPage() {
  const [id, setId] = useState('');
  const reports = useReportStore((state) => state.reports);

  const report = reports.find((r) => r.id === id);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h1 className="text-3xl font-bold mb-6">Track Your Report</h1>

      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter Report ID (CS-1234)"
        className="border px-4 py-2 rounded-lg mb-4"
      />

      {report ? (
        <div className="bg-white p-6 rounded-xl shadow w-80">
          <p><strong>Issue:</strong> {report.issueType}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Location:</strong> {report.address}</p>
        </div>
      ) : (
        id && <p className="text-red-500">Report not found</p>
      )}
    </div>
  );
}