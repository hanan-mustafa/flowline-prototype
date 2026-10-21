import { INCIDENT } from '../../data/engineer'
import { useStory } from '../../state/story'
import { INCIDENT_STATUS } from '../../components/incident'
import PageHeader, { StatusChip } from '../../components/PageHeader'

const TABS = [
  { to: '/engineer/case', label: 'Investigation' },
  { to: '/engineer/fix', label: 'Remediation' },
  { to: '/engineer/signoff', label: 'Post-incident' },
]

export default function IncidentHeader() {
  const { index } = useStory()
  const status = INCIDENT_STATUS[Math.max(index, 1)]
  return (
    <PageHeader
      crumbs={['Incidents', INCIDENT.id]}
      title={`${INCIDENT.id} · ${INCIDENT.title}`}
      meta={<>
        <StatusChip tone={status[1]}>{status[0]}</StatusChip>
        <span>{INCIDENT.priority} · Order to cash · E-invoice</span>
        <span>Opened {INCIDENT.opened}</span>
        <span>Assigned: you</span>
      </>}
      tabs={TABS}
    />
  )
}
