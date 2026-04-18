'use client';

import Link from 'next/link';
import { Mail, Code2, BriefcaseIcon, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-12 mt-16">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <span className="rounded-lg bg-blue-600 p-2"><Code2 className="text-white" size={18} /></span>
            CivicSense
          </span>
          <span className="text-gray-500 text-sm">AI-powered urban infrastructure reporting & repair prediction.</span>
        </div>
        <div className="flex flex-col gap-2 md:items-center">
          <nav className="flex gap-6 text-gray-400 text-sm">
            <Link href="/report" className="hover:text-blue-600 transition">Report</Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex gap-3">
            <a href="#" className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"><BriefcaseIcon size={18} /></a>
            <a href="#" className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"><Share2 size={18} /></a>
            <a href="#" className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"><Mail size={18} /></a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-slate-100 pt-8">
        <span className="text-base font-medium text-slate-400">© {new Date().getFullYear()} CivicSense. Building smarter cities with AI.</span>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-base font-medium text-slate-400">
          <a href="#" className="transition hover:text-blue-600">Privacy</a>
          <a href="#" className="transition hover:text-blue-600">Terms</a>
          <a href="#" className="transition hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
