/** Minimal inline SVG icon set — monochrome by default (currentColor). */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ children, size, width, height, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={width ?? size ?? 16}
      height={height ?? size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

export const LinkIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  });

export const ChartIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15v3" />
        <path d="M12 10v8" />
        <path d="M17 6v12" />
      </>
    ),
  });

export const CopyIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
  });

export const CheckIcon = (p: P) =>
  base({ ...p, children: <path d="M20 6 9 17l-5-5" /> });

export const TrashIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </>
    ),
  });

export const ArrowUpRightIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </>
    ),
  });

export const ArrowLeftIcon = (p: P) =>
  base({ ...p, children: <path d="M19 12H5m7 7-7-7 7-7" /> });

export const SunIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
      </>
    ),
  });

export const MoonIcon = (p: P) =>
  base({ ...p, children: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> });

export const MailIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </>
    ),
  });

export const UserIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  });

export const LogoutIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
  });

export const ShieldIcon = (p: P) =>
  base({
    ...p,
    children: <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" />,
  });

export const GlobeIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  });

export const BoltIcon = (p: P) =>
  base({
    ...p,
    children: <path d="M13 2 3 14h7l-1 8 11-14h-8l1-6z" />,
  });

export const PenIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
      </>
    ),
  });

export const PlusIcon = (p: P) =>
  base({ ...p, children: <path d="M12 5v14m-7-7h14" /> });

export const RefreshIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
        <path d="M3 21v-5h5" />
      </>
    ),
  });

export const MenuIcon = (p: P) =>
  base({ ...p, children: <path d="M4 6h16M4 12h16M4 18h16" /> });

export const CloseIcon = (p: P) =>
  base({ ...p, children: <path d="M18 6 6 18M6 6l12 12" /> });

export const SearchIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
  });

export const BookIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  });

export const SparkIcon = (p: P) =>
  base({
    ...p,
    children: <path d="M12 3v4m0 10v4m9-9h-4M7 12H3m13.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m0-11 2.8 2.8m5.4 5.4 2.8 2.8" />,
  });

/** Brand marks (kept in brand colors where recognition requires it). */
export const GoogleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#4285F4"
      d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.76c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.09C6.22 6.87 8.87 4.76 12 4.76z"
    />
  </svg>
);

export const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

export const MicrosoftIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
    <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
    <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
    <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
  </svg>
);

export const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
  </svg>
);

export const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path
      fill="#fff"
      d="M16.5 12.5h-3v8h-3.5v-8h-2v-2.8h2V7.9c0-2 1.2-3.1 3-3.1h2.8v2.8h-1.8c-.8 0-1 .4-1 1v1.1h2.9z"
    />
  </svg>
);

export const YahooIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="11" fill="#6001D2" />
    <path
      fill="#fff"
      d="M6 6h3l2.1 5.4L13.2 6h3l-4.2 9.5V19h-3v-3.5z"
    />
    <circle cx="17.2" cy="16.8" r="1.7" fill="#fff" />
  </svg>
);

export const GuestIcon = (p: P) =>
  base({
    ...p,
    children: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  });
