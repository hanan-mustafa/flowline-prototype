// The scripted TR-4471 order-to-cash incident. Every view reads from here,
// so all three roles always agree on what happened and when.
// Business figures are illustrative sample data, not from a real system.

export const FLOW = {
  name: 'Order to cash',
  system: 'SAP S/4HANA',
  stages: [
    { id: 'order', label: 'Order' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'billing', label: 'Billing' },
    { id: 'einvoice', label: 'E-invoice' },
    { id: 'payment', label: 'Payment' },
  ],
}

export const AGENTS = {
  'flow-health': { name: 'Flow-health agent', short: 'Flow health', icon: 'Activity', tint: '#2b7a9b' },
  triage: { name: 'Triage agent', short: 'Triage', icon: 'Combine', tint: '#6a4fc7' },
  'service-desk': { name: 'Service desk agent', short: 'Service desk', icon: 'MessageCircle', tint: '#c2577a' },
  investigation: { name: 'Investigation agent', short: 'Investigation', icon: 'Search', tint: '#2b2370' },
  remediation: { name: 'Remediation agent', short: 'Remediation', icon: 'Wrench', tint: '#2e7d1f' },
  knowledge: { name: 'Knowledge agent', short: 'Knowledge', icon: 'BookOpen', tint: '#a56a12' },
  problem: { name: 'Problem agent', short: 'Problem', icon: 'Lightbulb', tint: '#8b5a9e' },
  'change-risk': { name: 'Change-risk agent', short: 'Change risk', icon: 'ShieldCheck', tint: '#3c6e71' },
}

export const WORKSPACE = { org: 'Contoso', name: 'Finance applications' }

// Product navigation per role. `badge(index)` returns a count to show at a story step.
export const ROLES = [
  {
    id: 'owner',
    path: '/owner',
    label: 'Application owner',
    short: 'App owner',
    icon: 'Compass',
    desc: 'Business flow health, approvals for risky changes, and agent autonomy',
    user: { initials: 'AO', title: 'Finance applications' },
    nav: [
      { to: '/owner', end: true, label: 'Overview', icon: 'LayoutDashboard' },
      { to: '/owner/approval', label: 'Approvals', icon: 'BadgeCheck', badge: (i) => (i === 4 ? 1 : 0) },
      { to: '/owner/recovery', label: 'Incidents', icon: 'Siren', badge: (i) => (i >= 1 && i <= 5 ? 1 : 0) },
      { to: '/owner/policy', label: 'Autonomy policy', icon: 'SlidersHorizontal', badge: (i) => (i === 7 ? 1 : 0) },
    ],
  },
  {
    id: 'engineer',
    path: '/engineer',
    label: 'L2/L3 engineer',
    short: 'L2/L3',
    icon: 'Stethoscope',
    desc: 'On-call pages, investigations and fix decisions',
    user: { initials: 'SE', title: 'SAP integration · On call' },
    nav: [
      { to: '/engineer', end: true, label: 'On-call', icon: 'BellRing', badge: (i) => (i === 3 ? 1 : 0) },
      { to: '/engineer/case', label: 'Incidents', icon: 'Siren', match: ['/engineer/case', '/engineer/fix'] },
      { to: '/engineer/signoff', label: 'Reviews', icon: 'FileCheck2', badge: (i) => (i >= 6 ? 2 : 0) },
    ],
  },
  {
    id: 'l1',
    path: '/l1',
    label: 'L1 analyst',
    short: 'L1 analyst',
    icon: 'ListChecks',
    desc: 'Supervision of agent work and items handed off by agents',
    user: { initials: 'SA', title: 'Service desk' },
    nav: [
      { to: '/l1', end: true, label: 'Queue', icon: 'Inbox', badge: (i) => (i === 7 ? 3 : 0) },
    ],
  },
]

export const roleById = Object.fromEntries(ROLES.map((r) => [r.id, r]))

// stage state per moment: healthy | degraded | recovering
const healthy = { order: 'healthy', delivery: 'healthy', billing: 'healthy', einvoice: 'healthy', payment: 'healthy' }
const degraded = { ...healthy, einvoice: 'degraded' }
const recovering = { ...healthy, einvoice: 'recovering' }

export const MOMENTS = [
  {
    id: 'change',
    day: 'Sat',
    time: '21:40',
    actor: { kind: 'change' },
    title: 'Change imported',
    narration: 'TR-4471 imported to production (change CHG-2291, weekend window). It updates the outbound e-invoice mapping.',
    stages: healthy,
    metrics: { invoicesWaiting: 0, valueOnHold: 0, customers: 0 },
    ownerStatus: 'All stages operating normally.',
  },
  {
    id: 'detect',
    day: 'Sat',
    time: '22:05',
    actor: { kind: 'agent', id: 'flow-health' },
    title: 'Spots the dip',
    narration: 'E-invoice acceptance dropped to 0% within 20 minutes while billing volume stayed normal. Invoices are queuing before the tax portal.',
    stages: degraded,
    metrics: { invoicesWaiting: 140, valueOnHold: 0.6, customers: 38 },
    ownerStatus: 'E-invoices are not being accepted by the tax portal. Investigation in progress; no action needed from you.',
  },
  {
    id: 'correlate',
    day: 'Sat',
    time: '22:09',
    actor: { kind: 'agent', id: 'triage' },
    title: 'One incident',
    narration: 'Opened O2C-0187 (P1) and linked 43 alerts and 6 user tickets. Priority set from business impact.',
    stages: degraded,
    metrics: { invoicesWaiting: 210, valueOnHold: 0.9, customers: 52 },
    ownerStatus: 'Incident O2C-0187 opened (P1). 43 alerts and 6 user tickets linked to it.',
  },
  {
    id: 'investigate',
    // who has a decision waiting at this moment
    awaits: { engineer: { label: 'Confirm the probable cause for O2C-0187', to: '/engineer/case' } },
    day: 'Sat',
    time: '22:31',
    actor: { kind: 'agent', id: 'investigation' },
    title: 'Case file ready',
    narration: 'Investigation complete. All failing IDocs (status 51) use the mapping changed by TR-4471, and failures started 5 minutes after import. Probable cause: 92%. On-call engineer paged.',
    stages: degraded,
    metrics: { invoicesWaiting: 380, valueOnHold: 1.6, customers: 91 },
    ownerStatus: 'Probable cause identified: SAP change package TR-4471. The on-call engineer is reviewing.',
  },
  {
    id: 'confirm',
    // who has a decision waiting at this moment
    awaits: { owner: { label: 'Approval requested: revert SAP change package TR-4471', to: '/owner/approval' } },
    day: 'Sat',
    time: '22:48',
    actor: { kind: 'role', id: 'engineer' },
    title: 'Confirms cause',
    narration: 'Cause confirmed. Revert of TR-4471 recommended. Production change, so app owner approval is required (level 3).',
    stages: degraded,
    metrics: { invoicesWaiting: 460, valueOnHold: 1.9, customers: 104 },
    ownerStatus: 'Revert of TR-4471 recommended. Your approval is required.',
  },
  {
    id: 'approve',
    day: 'Sat',
    time: '23:02',
    actor: { kind: 'role', id: 'owner' },
    title: 'Approves revert',
    narration: 'Revert of TR-4471 approved, to run now.',
    stages: degraded,
    metrics: { invoicesWaiting: 512, valueOnHold: 2.1, customers: 112 },
    ownerStatus: 'Revert approved. Remediation in progress; rollback available.',
  },
  {
    id: 'fix',
    day: 'Sun',
    time: '00:20',
    actor: { kind: 'agent', id: 'remediation' },
    title: 'Fix and verify',
    narration: 'TR-4471 reverted via reversal change package TR-4472. 512 IDocs reprocessed and 512 of 512 accepted by the tax portal. Flow back to baseline.',
    stages: recovering,
    metrics: { invoicesWaiting: 0, valueOnHold: 0, customers: 0 },
    ownerStatus: 'Recovered. 512 of 512 invoices accepted by the tax portal.',
  },
  {
    id: 'monday',
    // who has a decision waiting at this moment
    awaits: { l1: { label: '3 items need review in your queue', to: '/l1' }, engineer: { label: '2 drafts from O2C-0187 waiting for your sign-off', to: '/engineer/signoff' }, owner: { label: 'New policy proposal: pre-release check for e-invoice mappings', to: '/owner/policy' } },
    day: 'Mon',
    time: '09:00',
    actor: { kind: 'role', id: 'l1' },
    title: 'Clears the queue',
    narration: 'Weekend queue ready for review. Knowledge article and problem record drafted. Pre-release check proposed.',
    stages: healthy,
    metrics: { invoicesWaiting: 0, valueOnHold: 0, customers: 0 },
    ownerStatus: 'All stages operating normally. 1 policy proposal awaiting your review.',
  },
]
