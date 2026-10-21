import { useState } from 'react'
import { BellRing, FileSearch, GitCompareArrows, FileCheck2 } from 'lucide-react'
import RoleTabs from '../../components/RoleTabs'

const TABS = [
  { to: '/engineer', end: true, label: 'Page', icon: BellRing, badge: (i) => i === 3 },
  { to: '/engineer/case', label: 'Case file', icon: FileSearch },
  { to: '/engineer/fix', label: 'Fix options', icon: GitCompareArrows },
  { to: '/engineer/signoff', label: 'Sign-off', icon: FileCheck2, badge: (i) => i === 7 },
]

export default function EngineerView() {
  // whether the engineer has confirmed the cause in this session
  const [confirmed, setConfirmed] = useState(false)
  return <RoleTabs roleId="engineer" tabs={TABS} context={{ confirmed, setConfirmed }} />
}
