'use client';

import { useState } from 'react';
import { Camera, MapPin, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useReportStore } from '@/lib/store';
import type { Report } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { isWrappedReportResponse, submitReport } from '@/lib/api-client';

type AiSummary = {
  id: string;
  severity: string;
  risk: 'High' | 'Medium' | 'Low';
  cost: number;
  urgency: 'Immediate' | 'Normal';
  confidence: number;
};

export default function ReportPage() {
  const [step, setStep] = useState<'location' | 'details' | 'photo' | 'confirm'>('location');
  const [formData, setFormData] = useState({
    location: { lat: 0, lng: 0 },
    address: '',
    issueType: 'pothole' as const,
    description: '',
    photos: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [aiResult, setAiResult] = useState<AiSummary | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addReport = useReportStore((state) => state.addReport);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: { lat: latitude, lng: longitude },
        }));
        setFormData((prev) => ({
          ...prev,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        setStep('details');
      });
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, event.target?.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await submitReport({
        location: formData.location,
        address: formData.address,
        issue_type: formData.issueType,
        description: formData.description || undefined,
        photos: formData.photos,
      });

      const apiPayload = isWrappedReportResponse(response) ? response.report : response;
      const aiPayload = isWrappedReportResponse(response) ? response.ai : undefined;

      const generatedId =
        apiPayload?.id ?? `CS-${Math.floor(1000 + Math.random() * 9000)}`;


      const severityValue =
        apiPayload?.severity_score ??
        aiPayload?.severity_score ??
        0;
      const confidenceValue =
        apiPayload?.severity_confidence ??
        aiPayload?.severity_confidence ??
        0;

      const report = {
        id: generatedId ?? uuidv4(),
        location: apiPayload?.location ?? formData.location,
        address: apiPayload?.address ?? formData.address,
        issueType: apiPayload?.issue_type ?? formData.issueType,
        severity: severityValue,
        confidence: confidenceValue,
        description: apiPayload?.description ?? formData.description,
        photos: apiPayload?.photos ?? formData.photos,
        status: (apiPayload?.status as Report['status']) ?? 'submitted',
        department: apiPayload?.department ?? 'roads',
        createdAt: apiPayload?.created_at ?? new Date().toISOString(),
      };

      addReport(report);
      setReportId(generatedId);

      setAiResult({
        id: generatedId,
        severity: severityValue ? severityValue.toFixed(1) : '0.0',
        risk: severityValue > 7 ? 'High' : severityValue > 5 ? 'Medium' : 'Low',
        cost: Math.floor((aiPayload?.estimated_cost_usd ?? severityValue * 5000) || 0),
        urgency: severityValue > 7 ? 'Immediate' : 'Normal',
        confidence: Math.floor(confidenceValue * 100) || 0,
      });

      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const issueTypes = [
    { id: 'pothole', label: 'Pothole', icon: '🕳️' },
    { id: 'streetlight', label: 'Streetlight', icon: '💡' },
    { id: 'sidewalk', label: 'Sidewalk', icon: '🚶' },
    { id: 'pipe', label: 'Pipe', icon: '🚰' },
    { id: 'drainage', label: 'Drainage', icon: '🌊' },
    { id: 'other', label: 'Other', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <div className="py-10 text-center sm:py-14">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-emerald-50 shadow-md">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">Report Submitted!</h2>
            <p className="mt-4 text-lg font-semibold text-blue-600">
            Report ID: {reportId || aiResult?.id || 'Processing...'}
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
              Your issue has been recorded and will be analyzed by our AI system. 
              You&apos;ll receive updates on the status of this report.
            </p>
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 text-left shadow-sm">
              <p className="text-base text-slate-600 mb-3">
                <strong className="text-slate-900">Issue Type:</strong> {issueTypes.find((t) => t.id === formData.issueType)?.label}
              </p>
              <p className="text-base text-slate-600">
                <strong className="text-slate-900">Location:</strong> {formData.address}
              </p>
            </div>
             {/* 🔥 AI ANALYSIS BLOCK */}
            {aiResult && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  🤖 AI Analysis Result
                </h3>

                <div className="space-y-2 text-sm text-slate-700">
                  <p><strong>Severity Score:</strong> {aiResult.severity}/10</p>
                  <p><strong>Risk Level:</strong> {aiResult.risk}</p>
                  <p><strong>Estimated Repair Cost:</strong> ₹{aiResult.cost}</p>
                  <p><strong>Urgency:</strong> {aiResult.urgency}</p>
                  <p><strong>AI Confidence:</strong> {aiResult.confidence}%</p>
                </div>
              </div>
            )}
            <button
  onClick={() => {
    setStep('location');
    setFormData({
      location: { lat: 0, lng: 0 },
      address: '',
      issueType: 'pothole',
      description: '',
      photos: [],
    });
    setSubmitted(false);
    setAiResult(null);
    setReportId('');
  }}
  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
>
  Report Another Issue
</button>
          </div>
        ) : (
          <>
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:mb-10 sm:px-8 sm:py-6">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Report an Infrastructure Issue</h1>
              <p className="mt-2 text-slate-600">A quick 4-step flow to report, attach photos, and submit for AI triage.</p>
            </div>

            {/* Progress */}
            <div className="mb-10 sm:mb-14">
              <div className="flex justify-between items-center">
                {['location', 'details', 'photo', 'confirm'].map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center ${i < 3 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold shadow-sm transition sm:h-12 sm:w-12 sm:text-base ${
                        step === s
                          ? 'bg-blue-600 text-white'
                          : ['location', 'details', 'photo', 'confirm'].indexOf(step) > i
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </div>
                    {i < 3 && (
                      <div
                        className={`mx-2 h-1 flex-1 rounded-full transition sm:mx-3 ${
                          ['location', 'details', 'photo', 'confirm'].indexOf(step) > i
                            ? 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              {/* Step 1: Location */}
              {step === 'location' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Where is the issue?</h2>
                  <p className="text-lg text-slate-600">
                    We&apos;ll use your current location to report this infrastructure issue.
                  </p>
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7 text-center transition hover:shadow-sm sm:p-10">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white">
                      <MapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-lg text-slate-700 font-semibold mb-6">
                      {formData.address || 'Location not set'}
                    </p>
                    <button
                      onClick={handleGetLocation}
                      className="rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Get My Location
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 'details' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What&apos;s the issue?</h2>

                  <div>
                    <label className="block text-base font-semibold text-slate-900 mb-4">
                      Issue Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {issueTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              issueType: type.id as typeof formData.issueType,
                            }))
                          }
                          className={`rounded-xl border p-5 text-center transition ${
                            formData.issueType === type.id
                              ? 'border-blue-300 bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="text-3xl mb-2">{type.icon}</div>
                          <div className="text-sm font-semibold text-slate-900">
                            {type.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-slate-900 mb-3">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe the issue in detail..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('location')}
                      className="flex-1 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('photo')}
                      className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Photo */}
              {step === 'photo' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Add Photo(s)</h2>
                  <p className="text-lg text-slate-600">
                    Upload photos of the infrastructure issue. Our AI will analyze them for severity and damage.
                  </p>

                  <div className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-blue-300 hover:bg-blue-50 sm:p-12">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoCapture}
                      className="hidden"
                      id="photo-input"
                    />
                    <label htmlFor="photo-input" className="cursor-pointer">
                      <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="font-bold text-slate-900 mb-2 text-lg">Click to upload or drag and drop</p>
                      <p className="text-base text-slate-600">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {formData.photos.length > 0 && (
                    <div>
                      <p className="text-base font-semibold text-slate-900 mb-4">
                        {formData.photos.length} photo(s) uploaded
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {formData.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Photo ${i + 1}`}
                            className="h-40 w-full rounded-xl border border-slate-200 object-cover shadow-sm transition hover:shadow-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('details')}
                      className="flex-1 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                      Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 'confirm' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Review Your Report</h2>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Location</p>
                      <p className="text-lg text-slate-900 font-medium">{formData.address}</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Issue Type</p>
                      <p className="text-lg text-slate-900 font-medium">
                        {issueTypes.find((t) => t.id === formData.issueType)?.label}
                      </p>
                    </div>

                    {formData.description && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm text-slate-600 font-semibold mb-2">Description</p>
                        <p className="text-base text-slate-600">{formData.description}</p>
                      </div>
                    )}

                    {formData.photos.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-sm text-slate-600 font-semibold mb-3">Photos</p>
                        <p className="text-lg text-slate-900 font-medium">
                          {formData.photos.length} image(s) attached
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50 p-6">
                    <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
                    <p className="text-base text-blue-900">
                      Our AI will analyze your submission within minutes and provide severity scoring and repair recommendations to the city.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep('photo')}
                      className="flex-1 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      <Upload size={20} />
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>

                  {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
