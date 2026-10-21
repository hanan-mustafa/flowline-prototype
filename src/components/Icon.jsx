import {
  Activity, BadgeCheck, BellRing, BookOpen, Combine, Compass, FileCheck2, GitCommitHorizontal, Inbox,
  LayoutDashboard, Lightbulb, ListChecks, MessageCircle, Search, ShieldCheck, Siren, SlidersHorizontal,
  Stethoscope, Wrench,
} from 'lucide-react'

const ICONS = {
  Activity, BadgeCheck, BellRing, BookOpen, Combine, Compass, FileCheck2, GitCommitHorizontal, Inbox,
  LayoutDashboard, Lightbulb, ListChecks, MessageCircle, Search, ShieldCheck, Siren, SlidersHorizontal,
  Stethoscope, Wrench,
}

export default function Icon({ name, ...props }) {
  const C = ICONS[name] ?? Activity
  return <C {...props} />
}
