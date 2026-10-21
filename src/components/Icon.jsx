import {
  Activity, BookOpen, Combine, Compass, Lightbulb, ListChecks, MessageCircle,
  Search, ShieldCheck, Stethoscope, Wrench, GitCommitHorizontal,
} from 'lucide-react'

const ICONS = {
  Activity, BookOpen, Combine, Compass, Lightbulb, ListChecks, MessageCircle,
  Search, ShieldCheck, Stethoscope, Wrench, GitCommitHorizontal,
}

export default function Icon({ name, ...props }) {
  const C = ICONS[name] ?? Activity
  return <C {...props} />
}
