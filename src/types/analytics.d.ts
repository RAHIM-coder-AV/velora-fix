interface Window {
  fbq?: (...args: unknown[]) => void;
  _fbq?: (...args: unknown[]) => void;
  ttq?: {
    track?: (event: string, properties?: Record<string, unknown>) => void;
    page?: () => void;
  };
  __veloraMetaInitialized?: string[];
  __veloraTikTokInitialized?: string[];
  __veloraPendingMetaEvents?: Array<{ event: string; data: Record<string, unknown> }>;
  __veloraPendingTikTokEvents?: Array<{ event: string; data: Record<string, unknown> }>;
}
