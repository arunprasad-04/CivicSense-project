export type ApiReportCreatePayload = {
  location: { lat: number; lng: number };
  address: string;
  issue_type: 'pothole' | 'streetlight' | 'sidewalk' | 'pipe' | 'drainage' | 'other';
  description?: string;
  photos: string[];
};

type ApiErrorPayload = {
  message?: string;
  detail?: string;
};

type ApiAiResult = {
  severity_score?: number;
  severity_confidence?: number;
  damage_metadata?: Record<string, unknown>;
  estimated_cost_usd?: number;
};

type ApiReport = {
  id?: string;
  location?: { lat: number; lng: number };
  address?: string;
  issue_type?: ApiReportCreatePayload['issue_type'];
  description?: string;
  photos?: string[];
  status?: string;
  department?: string;
  severity_score?: number;
  severity_confidence?: number;
  created_at?: string;
};

type ApiReportCreateResponse = {
  report?: ApiReport;
  ai?: ApiAiResult;
};

export type SubmitReportResponse = ApiReportCreateResponse | ApiReport;

export const isWrappedReportResponse = (
  payload: SubmitReportResponse
): payload is ApiReportCreateResponse => {
  return typeof payload === 'object' && payload !== null && 'report' in payload;
};

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    // Local default so frontend can work without env setup in development.
    return 'http://127.0.0.1:8000';
  }
  return baseUrl.replace(/\/$/, '');
};

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return payload.message || payload.detail || 'Request failed';
  } catch {
    return 'Request failed';
  }
};

export const submitReport = async (payload: ApiReportCreatePayload) => {
  const baseUrl = getApiBaseUrl();
  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Cannot reach API server at ${baseUrl}. Start the backend and try again.`
    );
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  return (await response.json()) as SubmitReportResponse;
};
