// Globals added by the visitor tracker script loaded in app/layout.tsx.
interface PhyoTrack {
  consent: () => void;
  identify: (lead: { name?: string; email?: string; phone?: string }) => void;
  track: (event: string, props?: Record<string, unknown>) => void;
}

interface Window {
  phyoTrack?: PhyoTrack;
}
