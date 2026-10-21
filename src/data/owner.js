// Application owner content for the TR-4471 story. Figures are illustrative sample data.

export const OWNER = {
  name: 'Application owner, Finance systems',
  flows: [
    { id: 'o2c', name: 'Order to cash', live: true },
    { id: 'p2p', name: 'Procure to pay', note: 'Normal' },
    { id: 'r2r', name: 'Record to report', note: 'Normal · month-end in 9 days' },
  ],
}

export const STAGE_DETAIL = {
  einvoice: {
    what: 'Invoices are created in billing, signed, and sent to the government tax portal. Customers can only be invoiced once the portal accepts them.',
    watching: ['Acceptance rate at the tax portal', 'Time from billing to acceptance', 'IDoc errors on the e-invoice interface'],
  },
}

export const APPROVAL = {
  title: 'Revert transport TR-4471',
  level: 3,
  levelName: 'Act with approval',
  requestedBy: { role: 'engineer', at: 'Sat 22:48' },
  preparedBy: 'remediation',
  why: 'TR-4471 changed the field mapping for outbound e-invoices. Since then, every e-invoice IDoc has failed (status 51) and nothing has reached the tax portal.',
  plan: [
    'Import TR-4472, which restores the mapping as it was before TR-4471',
    'Reprocess the failed e-invoice IDocs in batches of 50',
    'Check that each invoice is accepted by the tax portal',
    'Watch the flow for 30 minutes, then close the incident',
  ],
  evidence: [
    { text: 'All failing IDocs use the field TR-4471 changed; none of the earlier IDocs do', strength: 'strong' },
    { text: 'Failures began 5 minutes after the import, with no other change in that window', strength: 'strong' },
    { text: 'Same pattern as a mapping incident in March, fixed the same way', strength: 'supporting' },
    { text: 'The on-call engineer reviewed the case file and agrees', strength: 'supporting' },
  ],
  blast: [
    { label: 'Changes', text: 'One mapping on the e-invoice interface' },
    { label: 'Does not touch', text: 'Orders, deliveries, billing documents or postings' },
    { label: 'Side effect', text: 'The pricing tweak bundled in TR-4471 is also undone; finance can re-raise it on Monday' },
    { label: 'Timing', text: 'Saturday night, low order volume' },
  ],
  rollback: {
    text: 'Re-import TR-4471 to return to the current state.',
    time: 'About 5 minutes',
    tested: 'Dry run passed in QA at 22:44',
  },
  record: { action: 'Transport revert', runs: 14, success: 14, lastIssue: 'no failures in 12 months' },
  options: [
    { name: 'Revert TR-4471', chosen: true, note: 'Fastest and fully reversible' },
    { name: 'Patch the mapping in production', note: 'Keeps the pricing tweak, but is an untested change at night' },
  ],
}

export const RECOVERY = {
  // e-invoice acceptance at the tax portal, invoices per 15 minutes
  series: [
    ['21:00', 46], ['21:15', 44], ['21:30', 41], ['21:45', 9], ['22:00', 0], ['22:15', 0],
    ['22:30', 0], ['22:45', 0], ['23:00', 0], ['23:15', 0], ['23:30', 118], ['23:45', 196],
    ['00:00', 172], ['00:15', 74], ['00:30', 39], ['00:45', 37], ['01:00', 36],
  ],
  markers: { change: '21:40', fix: '23:15', approve: '23:02' },
  checks: [
    { text: 'TR-4472 imported; mapping matches the version before TR-4471', agent: 'remediation' },
    { text: '512 of 512 failed IDocs reprocessed', agent: 'remediation' },
    { text: '512 of 512 invoices accepted by the tax portal', agent: 'remediation' },
    { text: 'New invoices flowing at the normal Saturday rate for 30 minutes', agent: 'flow-health' },
    { text: 'Customers who raised tickets told it is fixed', agent: 'service-desk' },
  ],
  summary: [
    { label: 'Time to spot', value: '20 min', note: 'from first failure' },
    { label: 'Time to fix', value: '2 h 35 m', note: 'first failure to recovery' },
    { label: 'Invoices recovered', value: '512', note: 'none lost' },
    { label: 'People woken', value: '2', note: 'engineer and you' },
  ],
}

export const LEVELS = [
  { id: 1, name: 'Inform', text: 'Agent tells people; never acts' },
  { id: 2, name: 'Recommend', text: 'Agent proposes; a person acts' },
  { id: 3, name: 'Act with approval', text: 'Agent acts after a named approver says yes' },
  { id: 4, name: 'Act and tell', text: 'Agent acts alone and reports after' },
]

export const POLICY = [
  { action: 'Restart a stuck interface channel', agent: 'remediation', level: 4, max: 4, record: '38 runs, all clean', reversible: true },
  { action: 'Rerun a failed batch job', agent: 'remediation', level: 4, max: 4, record: '41 runs, all clean', reversible: true },
  { action: 'Reprocess failed IDocs', agent: 'remediation', level: 3, max: 4, record: '23 runs, all clean', reversible: true, promote: true },
  { action: 'Revert a transport in production', agent: 'remediation', level: 3, max: 3, record: '14 runs, all clean', reversible: true, note: 'Production change: always needs a named approver' },
  { action: 'Patch configuration in production', agent: 'remediation', level: 2, max: 3, record: '3 runs, 1 rolled back', reversible: true },
  { action: 'Correct posted invoice data', agent: 'remediation', level: 1, max: 2, record: 'Not attempted', reversible: false, note: 'Financial data: agents never change it alone' },
  { action: 'Reply to users about a known incident', agent: 'service-desk', level: 4, max: 4, record: '212 replies, 3 corrected', reversible: true },
]

export const PROPOSAL = {
  agent: 'change-risk',
  title: 'Add a pre-release check for e-invoice mappings',
  text: 'Before any transport that touches an e-invoice mapping is imported, send one test invoice through QA to the tax portal sandbox. If it is rejected, hold the import and tell the change owner.',
  from: 'Drafted from the TR-4471 problem record',
  effect: 'Would have stopped TR-4471 before it reached production.',
}
