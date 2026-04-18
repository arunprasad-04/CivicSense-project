import Link from 'next/link';
import { ArrowRight, Zap, MapPin, Brain, BarChart3, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50 text-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-7">
          <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
            AI Infrastructure Intelligence
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Smart Cities Start With <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Citizens</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            Report urban infrastructure issues with AI-powered analysis. From potholes to broken lights, CivicSense predicts problems before they become emergencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Report Issue Now <ArrowRight size={20} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              View Dashboard
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Live Issue Feed</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Pothole on 5th Avenue</p>
                    <p className="text-sm text-slate-600">Severity: 7.2/10 • Hazard Risk: High</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Broken Streetlight</p>
                    <p className="text-sm text-slate-600">Severity: 5.1/10 • Cluster Size: 3</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Resolved - Sidewalk Repair</p>
                    <p className="text-sm text-slate-600">Completed: 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-500">Today</p>
                <p className="text-lg font-bold text-slate-900">34</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-medium text-slate-500">Avg. response</p>
                <p className="text-lg font-bold text-slate-900">2.4h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-slate-900">Powered by AI, Built for Cities</h2>
            <p className="mt-3 text-slate-600">Every report is classified, prioritized, and routed with transparent, real-time intelligence.</p>
          </div>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-blue-50 p-3">
                <Brain size={28} className="text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">AI Damage Analysis</h3>
              <p className="text-base leading-relaxed text-slate-600">
                Computer vision instantly analyzes photos to assess severity, estimate hazard radius, and predict repair urgency.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-indigo-50 p-3">
                <MapPin size={28} className="text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Geospatial Clustering</h3>
              <p className="text-base leading-relaxed text-slate-600">
                Detect infrastructure failure patterns across neighborhoods before they escalate into system-wide crises.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-violet-50 p-3">
                <Zap size={28} className="text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Smart Scheduling</h3>
              <p className="text-base leading-relaxed text-slate-600">
                AI predicts repair priorities and optimizes crew routes to maximize efficiency and minimize downtime.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-emerald-50 p-3">
                <BarChart3 size={28} className="text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Real-Time Insights</h3>
              <p className="text-base leading-relaxed text-slate-600">
                Live dashboards show city administrators exact issue locations, risk levels, and predicted costs in real-time.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-orange-50 p-3">
                <Smartphone size={28} className="text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Offline-First PWA</h3>
              <p className="text-base leading-relaxed text-slate-600">
                Report issues even without connectivity. Photos and location data sync automatically when online.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-5 w-fit rounded-xl bg-rose-50 p-3">
                <Zap size={28} className="text-pink-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Work Order Automation</h3>
              <p className="text-base leading-relaxed text-slate-600">
                LLM-generated work orders with materials lists, safety notes, and time estimates automatically delivered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
          {[
            { label: 'Reports Processed', value: '12.4K' },
            { label: 'Issues Resolved', value: '8.9K' },
            { label: 'Cities Using', value: '24' },
            { label: 'Cost Saved', value: '$2.3M' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-600 md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white px-8 py-14 text-center shadow-md">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">Ready to Make Your City Smarter?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Join municipalities that are already preventing infrastructure failures before they happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start Reporting <ArrowRight size={20} />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Explore Admin Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
