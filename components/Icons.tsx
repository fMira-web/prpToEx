/**
 * Inline SVG icons, ported 1:1 from the legacy app.js SKILL_ICONS map and
 * the various hand-written <svg> strings scattered through the markup
 * builders. Kept as tiny components so JSX call sites read the same way
 * the original innerHTML template literals did.
 */
import type { SVGProps } from 'react';

function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function GrammarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </Svg>
  );
}
export function ListeningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </Svg>
  );
}
export function ReadingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </Svg>
  );
}
export function WritingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </Svg>
  );
}
export function SpeakingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path>
    </Svg>
  );
}
export function FullMockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M12 8v4l3 3"></path>
      <circle cx={12} cy={12} r={10}></circle>
    </Svg>
  );
}
export function RestReviewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M20.24 12.24a8 8 0 1 0-11.31 11.31"></path>
      <path d="M18 12a6 6 0 1 1-6-6"></path>
    </Svg>
  );
}

export const SKILL_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  Grammar: GrammarIcon,
  Listening: ListeningIcon,
  Reading: ReadingIcon,
  Writing: WritingIcon,
  Speaking: SpeakingIcon,
  'Full Mock': FullMockIcon,
  'Rest & Review': RestReviewIcon,
};

export function SkillIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SKILL_ICONS[name];
  if (!Icon) return null;
  return <Icon className={className || 'w-3.5 h-3.5'} />;
}

export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="chev shrink-0 w-4 h-4 text-slate-500 rotate-open" {...props}>
      <path d="m9 18 6-6-6-6"></path>
    </Svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx={11} cy={11} r={8}></circle>
      <path d="m21 21-4.3-4.3"></path>
    </Svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z"></path>
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z"></path>
    </svg>
  );
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx={12} cy={12} r={3}></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </Svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx={12} cy={13} r={8}></circle>
      <path d="M12 9v4l2.5 2.5"></path>
      <path d="M9 2h6"></path>
    </Svg>
  );
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <path d="M7 10l5 5 5-5"></path>
      <path d="M12 15V3"></path>
    </Svg>
  );
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path>
      <path d="M3 3v5h5"></path>
    </Svg>
  );
}

export function SkipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="m5 4 12 8-12 8V4z"></path>
      <path d="M19 5v14"></path>
    </Svg>
  );
}

export function PlugIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3.5 h-3.5" {...props}>
      <path d="M4 12a8 8 0 0 1 14.93-4M20 4v5h-5M20 12a8 8 0 0 1-14.93 4M4 20v-5h5"></path>
    </Svg>
  );
}

export function ClipboardCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </Svg>
  );
}

export function ComingSoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg className="w-3 h-3 shrink-0" {...props}>
      <circle cx={12} cy={12} r={9}></circle>
      <path d="M12 7v5l3.5 2"></path>
    </Svg>
  );
}

export function StartExerciseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z"></path>
    </svg>
  );
}
