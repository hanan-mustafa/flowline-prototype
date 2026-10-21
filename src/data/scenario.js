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

export const ROLES = [
  {
    id: 'owner',
    path: '/owner',
    label: 'Application owner',
    short: 'App owner',
    icon: 'Compass',
    promise: 'My flow is healthy, and I decide the risk',
    shiftFrom: 'Chasing updates',
    shiftTo: 'Governing the flow',
    home: 'Flow map',
    buildStep: 2,
    screens: [
      { title: 'Flow map', text: 'Order-to-cash end to end, with impact in business terms.' },
      { title: 'Approval card', text: 'The revert plan, its evidence, blast radius, rollback and track record.' },
      { title: 'Recovery', text: 'The stage turns green as invoices reach the tax portal.' },
      { title: 'Autonomy policy', text: 'What agents may do alone, per action, and the new pre-release check.' },
    ],
  },
  {
    id: 'engineer',
    path: '/engineer',
    label: 'L2/L3 engineer',
    short: 'L2/L3',
    icon: 'Stethoscope',
    promise: 'The diagnosis is already done',
    shiftFrom: 'Searching for clues',
    shiftTo: 'Deciding from evidence',
    home: 'Case file',
    buildStep: 3,
    screens: [
      { title: 'Notification', text: 'One line: which flow, which stage, impact, probable cause.' },
      { title: 'Case file', text: 'Timeline, evidence, probable cause and what was ruled out.' },
      { title: 'Fix options', text: 'Revert the transport or patch the mapping, compared side by side.' },
      { title: 'Sign-off', text: 'The knowledge article and problem record the agents drafted.' },
    ],
  },
  {
    id: 'l1',
    path: '/l1',
    label: 'L1 analyst',
    short: 'L1',
    icon: 'ListChecks',
    promise: 'Monday: the night shift was handled',
    shiftFrom: 'Routing tickets',
    shiftTo: 'Supervising agents',
    home: 'Supervision queue',
    buildStep: 4,
    screens: [
      { title: 'Supervision queue', text: '“Resolved overnight” and “Needs you”, grouped by business flow.' },
      { title: 'Agent review', text: 'Accept or correct what an agent did and said to a user.' },
      { title: 'Exception', text: 'Work the one item an agent handed off, with its suggested next step.' },
      { title: 'Level-2 approval', text: 'Approve an action the agent may not yet take alone.' },
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
    title: 'Transport imported',
    narration: 'Transport TR-4471 is imported to production during the weekend change window. It updates the field mapping used for outbound e-invoices.',
    stages: healthy,
    metrics: { invoicesWaiting: 0, valueOnHold: 0 },
  },
  {
    id: 'detect',
    day: 'Sat',
    time: '22:05',
    actor: { kind: 'agent', id: 'flow-health' },
    title: 'Spots the dip',
    narration: 'E-invoice acceptance fell to almost nothing in twenty minutes, while billing kept posting as usual. Invoices are piling up before the tax portal.',
    stages: degraded,
    metrics: { invoicesWaiting: 140, valueOnHold: 0.6 },
  },
  {
    id: 'correlate',
    day: 'Sat',
    time: '22:09',
    actor: { kind: 'agent', id: 'triage' },
    title: 'One incident',
    narration: 'I linked 43 alerts and 6 user tickets to one incident on order-to-cash, and set its priority from business impact rather than alert severity.',
    stages: degraded,
    metrics: { invoicesWaiting: 210, valueOnHold: 0.9 },
  },
  {
    id: 'investigate',
    day: 'Sat',
    time: '22:31',
    actor: { kind: 'agent', id: 'investigation' },
    title: 'Case file ready',
    narration: 'Every failing IDoc (status 51) uses the mapping that TR-4471 changed 25 minutes before the failures began. Probable cause, high confidence. I paged the on-call engineer.',
    stages: degraded,
    metrics: { invoicesWaiting: 380, valueOnHold: 1.6 },
  },
  {
    id: 'confirm',
    day: 'Sat',
    time: '22:48',
    actor: { kind: 'role', id: 'engineer' },
    title: 'Confirms cause',
    narration: 'The engineer read the case file, confirmed the cause and backed reverting the transport. A production change is level 3, so the plan goes to the app owner.',
    stages: degraded,
    metrics: { invoicesWaiting: 460, valueOnHold: 1.9 },
  },
  {
    id: 'approve',
    day: 'Sat',
    time: '23:02',
    actor: { kind: 'role', id: 'owner' },
    title: 'Approves revert',
    narration: 'The app owner reviewed the plan, its blast radius and the rollback, and approved the revert.',
    stages: degraded,
    metrics: { invoicesWaiting: 500, valueOnHold: 2.1 },
  },
  {
    id: 'fix',
    day: 'Sun',
    time: '00:20',
    actor: { kind: 'agent', id: 'remediation' },
    title: 'Fix and verify',
    narration: 'I reverted TR-4471, reprocessed the 512 failed IDocs and checked that each invoice reached the tax portal. The flow is back to its normal rate.',
    stages: recovering,
    metrics: { invoicesWaiting: 0, valueOnHold: 0 },
  },
  {
    id: 'monday',
    day: 'Mon',
    time: '09:00',
    actor: { kind: 'role', id: 'l1' },
    title: 'Clears the queue',
    narration: 'The L1 analyst reviews what the agents closed overnight. A knowledge article and problem record are drafted, and a pre-release check on similar transports waits for the app owner.',
    stages: healthy,
    metrics: { invoicesWaiting: 0, valueOnHold: 0 },
  },
]
