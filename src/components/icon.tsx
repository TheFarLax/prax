import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowsOutSimple,
  BookmarkSimple,
  Browser,
  CaretDown,
  Check,
  CheckCircle,
  Code,
  Copy,
  CursorClick,
  DownloadSimple,
  FileText,
  Info,
  List,
  MagnifyingGlass,
  Microphone,
  Moon,
  Play,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Stack,
  Sun,
  X,
} from "@phosphor-icons/react/dist/ssr";

const icons = {
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  expand: ArrowsOutSimple,
  bookmark: BookmarkSimple,
  browser: Browser,
  chevron: CaretDown,
  check: Check,
  checkCircle: CheckCircle,
  code: Code,
  copy: Copy,
  cursor: CursorClick,
  download: DownloadSimple,
  document: FileText,
  info: Info,
  menu: List,
  search: MagnifyingGlass,
  microphone: Microphone,
  moon: Moon,
  play: Play,
  plus: Plus,
  shield: ShieldCheck,
  settings: SlidersHorizontal,
  sparkle: Sparkle,
  stack: Stack,
  sun: Sun,
  close: X,
};

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      weight="regular"
      className={className}
      aria-hidden="true"
    />
  );
}
