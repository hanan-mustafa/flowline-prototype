import { useCallback, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ROLES } from '../data/scenario'
import Sidebar from '../components/Sidebar'
import AppHeader from '../components/AppHeader'
import ActionBanner from '../components/ActionBanner'
import AuditTrail from '../components/AuditTrail'
import DemoBar from '../components/Timeline'

export default function Shell() {
  const { pathname } = useLocation()
  const role = ROLES.find((r) => pathname.startsWith(r.path)) ?? ROLES[0]
  const [audit, setAudit] = useState(false)
  const close = useCallback(() => setAudit(false), [])

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        <Sidebar role={role} onAudit={() => setAudit(true)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader roleId={role.id} />
          <ActionBanner roleId={role.id} />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <DemoBar />
      <AuditTrail open={audit} onClose={close} />
    </div>
  )
}
