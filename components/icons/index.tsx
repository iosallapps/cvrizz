import { cn } from "@/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// Document/Resume icon - premium clean style
export function IconDocument({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      {/* Document outline */}
      <path
        d="M6 2h8.5L20 7.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
        fill="currentColor"
      />
      {/* Folded corner */}
      <path
        d="M14 2v4a2 2 0 002 2h4"
        fill="currentColor"
        fillOpacity="0.4"
      />
      {/* Content lines */}
      <path
        d="M8 12h8M8 16h5"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Dashboard/Grid icon
export function IconDashboard({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" fillOpacity="0.7" />
      <rect x="3" y="13" width="8" height="8" rx="2" fillOpacity="0.7" />
      <rect x="13" y="13" width="8" height="8" rx="2" fillOpacity="0.5" />
    </svg>
  );
}

// Settings/Gear icon
export function IconSettings({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.325 2.317a2 2 0 013.35 0l.727 1.122a2 2 0 002.157.74l1.272-.39a2 2 0 012.58 2.134l-.193 1.322a2 2 0 001.143 2.07l1.165.58a2 2 0 01.487 3.241l-.92.987a2 2 0 00-.334 2.196l.545 1.222a2 2 0 01-1.502 2.81l-1.31.207a2 2 0 00-1.593 1.36l-.43 1.27a2 2 0 01-3.063 1.037l-1.087-.788a2 2 0 00-2.34 0l-1.087.788a2 2 0 01-3.063-1.037l-.43-1.27a2 2 0 00-1.593-1.36l-1.31-.207a2 2 0 01-1.502-2.81l.545-1.222a2 2 0 00-.334-2.196l-.92-.987a2 2 0 01.487-3.24l1.165-.581a2 2 0 001.143-2.07l-.193-1.322a2 2 0 012.58-2.134l1.272.39a2 2 0 002.157-.74l.727-1.122z"
        fillOpacity="0.3"
      />
    </svg>
  );
}

// Credit Card/Billing icon
export function IconBilling({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <rect x="2" y="9" width="20" height="4" fillOpacity="0.5" />
      <circle cx="7" cy="16" r="1.5" style={{ fill: 'var(--bg-base, #09090b)' }} />
      <circle cx="11" cy="16" r="1.5" style={{ fill: 'var(--bg-base, #09090b)' }} fillOpacity="0.5" />
    </svg>
  );
}

// Sparkles/AI icon
export function IconSparkles({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
      <circle cx="19" cy="4" r="2" fillOpacity="0.6" />
      <circle cx="5" cy="18" r="1.5" fillOpacity="0.4" />
    </svg>
  );
}

// Logout icon
export function IconLogout({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M5 3h6a2 2 0 012 2v3h-2V5H5v14h6v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path d="M16 8l4 4-4 4M10 12h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// User/Profile icon
export function IconUser({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fillOpacity="0.7" />
    </svg>
  );
}

// Briefcase/Work icon
export function IconBriefcase({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="2" y="7" width="20" height="13" rx="3" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="11" width="20" height="3" fillOpacity="0.3" />
    </svg>
  );
}

// GraduationCap/Education icon
export function IconEducation({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fillOpacity="0.7" />
    </svg>
  );
}

// Wrench/Skills icon
export function IconSkills({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

// Plus icon
export function IconPlus({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 4a1.5 1.5 0 011.5 1.5v5h5a1.5 1.5 0 010 3h-5v5a1.5 1.5 0 01-3 0v-5h-5a1.5 1.5 0 010-3h5v-5A1.5 1.5 0 0112 4z" />
    </svg>
  );
}

// Download icon
export function IconDownload({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 3a1.5 1.5 0 011.5 1.5v8.379l2.44-2.44a1.5 1.5 0 012.12 2.122l-5 5a1.5 1.5 0 01-2.12 0l-5-5a1.5 1.5 0 012.12-2.122l2.44 2.44V4.5A1.5 1.5 0 0112 3z" />
      <path d="M4 17a1.5 1.5 0 011.5 1.5v.5h13v-.5a1.5 1.5 0 013 0V19a2 2 0 01-2 2H4a2 2 0 01-2-2v-.5A1.5 1.5 0 014 17z" fillOpacity="0.7" />
    </svg>
  );
}

// Clock icon
export function IconClock({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
      <circle cx="12" cy="12" r="8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
    </svg>
  );
}

// Globe/Language icon
export function IconGlobe({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <path d="M2 12h20M4 7h16M4 17h16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Check icon
export function IconCheck({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="12" r="10" fillOpacity="0.2" />
    </svg>
  );
}

// Arrow Left icon
export function IconArrowLeft({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M10 6L4 12l6 6M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// More/Menu icon
export function IconMore({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  );
}

// Trash icon
export function IconTrash({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M6 7h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z" />
      <path d="M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Copy/Duplicate icon
export function IconCopy({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" fillOpacity="0.5" />
    </svg>
  );
}

// Eye/Preview icon
export function IconEye({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 5C5.636 5 2 12 2 12s3.636 7 10 7 10-7 10-7-3.636-7-10-7z" fillOpacity="0.3" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" style={{ fill: 'var(--bg-base, #09090b)' }} />
    </svg>
  );
}

// Zoom In icon
export function IconZoomIn({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="10" cy="10" r="7" fillOpacity="0.3" />
      <circle cx="10" cy="10" r="5" />
      <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
      <path d="M15 15l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Zoom Out icon
export function IconZoomOut({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="10" cy="10" r="7" fillOpacity="0.3" />
      <circle cx="10" cy="10" r="5" />
      <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
      <path d="M15 15l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Shield icon
export function IconShield({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
    </svg>
  );
}

// Bell/Notifications icon
export function IconBell({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Sun icon
export function IconSun({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Moon icon
export function IconMoon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

// Monitor/System icon
export function IconMonitor({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Warning/Alert icon
export function IconWarning({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M12 2L1 21h22L12 2z" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
    </svg>
  );
}

// Mail icon
export function IconMail({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" style={{ stroke: 'var(--bg-base, #09090b)' }} />
    </svg>
  );
}

// Play icon
export function IconPlay({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  );
}

// Arrow Right icon
export function IconArrowRight({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M14 6l6 6-6 6M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Loader/Spinner icon
export function IconLoader({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5 animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 019.17 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Google icon
export function IconGoogle({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Close/X icon
export function IconClose({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Menu/Hamburger icon
export function IconMenu({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}

// Templates/Layout icon
export function IconTemplates({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
      {...props}
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" fillOpacity="0.7" />
      <rect x="14" y="11" width="7" height="10" rx="1.5" fillOpacity="0.5" />
      <rect x="3" y="15" width="7" height="6" rx="1.5" fillOpacity="0.7" />
    </svg>
  );
}
