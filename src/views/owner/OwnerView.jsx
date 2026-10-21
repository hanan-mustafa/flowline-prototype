import { Map, BadgeCheck, HeartPulse, SlidersHorizontal } from 'lucide-react'
import RoleTabs from '../../components/RoleTabs'

const TABS = [
  { to: '/owner', end: true, label: 'Flow map', icon: Map },
  { to: '/owner/approval', label: 'Approval', icon: BadgeCheck, badge: (i) => i === 4 },
  { to: '/owner/recovery', label: 'Recovery', icon: HeartPulse, badge: (i) => i === 6 },
  { to: '/owner/policy', label: 'Autonomy policy', icon: SlidersHorizontal, badge: (i) => i === 7 },
]

export default function OwnerView() {
  return <RoleTabs roleId="owner" tabs={TABS} />
}
