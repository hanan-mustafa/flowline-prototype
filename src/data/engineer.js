// L2/L3 engineer content for the TR-4471 story. Figures are illustrative sample data.

export const INCIDENT = {
  id: 'O2C-0187',
  title: 'E-invoices rejected after transport TR-4471',
  priority: 'P1',
  priorityWhy: 'Set by business impact: invoices for 100+ customers blocked on a working weekend',
  opened: 'Sat 22:09',
}

export const PAGE = {
  at: 'Sat 22:31',
  line: 'Order to cash · E-invoice stage · 380 invoices waiting',
  cause: 'Probable cause: transport TR-4471 changed the e-invoice mapping (high confidence)',
  done: [
    { agent: 'flow-health', text: 'Spotted the drop in invoices accepted, 20 minutes after it began' },
    { agent: 'triage', text: 'Folded 43 alerts and 6 user tickets into this one incident' },
    { agent: 'service-desk', text: 'Told the 6 users who raised tickets that it is being worked on' },
    { agent: 'investigation', text: 'Built the case file below; took no action in production' },
  ],
}

export const CASE = {
  summary:
    'Since 21:45 every outbound e-invoice IDoc has failed with status 51. The failures began five minutes after TR-4471 was imported, and every failing IDoc goes through the one mapping TR-4471 changed.',
  timeline: [
    { at: '21:40', text: 'TR-4471 imported to production (weekend change window, owner: finance IT)' },
    { at: '21:45', text: 'First e-invoice IDoc fails with status 51', key: true },
    { at: '22:05', text: 'Flow-health agent flags e-invoice acceptance near zero' },
    { at: '22:09', text: 'Triage agent opens O2C-0187; 43 alerts and 6 tickets linked' },
    { at: '22:31', text: 'Case file ready; on-call engineer paged' },
  ],
  diff: {
    object: 'E-invoice output mapping · field Buyer tax ID',
    before: 'BuyerTaxId  ←  KNA1-STCD3   (customer tax number 3)',
    after: 'BuyerTaxId  ←  KNA1-STCD1   (customer tax number 1)',
    note: 'STCD1 is empty for most domestic customers, so the portal rejects the invoice for a missing buyer tax ID.',
  },
  idocs: [
    { no: '0000048213907', customer: 'Northwind Retail', status: '51', msg: 'Portal rejected: buyer tax ID missing' },
    { no: '0000048213911', customer: 'Contoso Foods', status: '51', msg: 'Portal rejected: buyer tax ID missing' },
    { no: '0000048213918', customer: 'Fabrikam Stores', status: '51', msg: 'Portal rejected: buyer tax ID missing' },
  ],
  idocTotal: 380,
  hypotheses: [
    { text: 'TR-4471 mapping change sends an empty buyer tax ID', confidence: 92, verdict: 'probable' },
    { text: 'Tax portal outage or slowdown', confidence: 3, verdict: 'ruled out', why: 'Portal status is normal and a test call from QA was accepted at 22:24' },
    { text: 'Expired signing certificate', confidence: 2, verdict: 'ruled out', why: 'Certificate is valid until March 2027' },
    { text: 'Bad customer master data', confidence: 3, verdict: 'ruled out', why: 'No master data changes since Friday; the same customers invoiced fine at 21:30' },
  ],
  similar: {
    id: 'O2C-0112',
    when: 'March',
    text: 'A mapping change in TR-3920 broke credit-note e-invoices. Fixed by reverting the transport in 40 minutes.',
  },
}

export const FIXES = [
  {
    id: 'revert',
    name: 'Revert TR-4471',
    recommended: true,
    how: 'Import TR-4472, which restores the mapping as it was, then reprocess the failed IDocs.',
    rows: {
      'Time to recover': 'About 1 hour, including reprocessing',
      Risk: 'Low: returns to a version that ran for months',
      Reversible: 'Yes, re-import TR-4471 in about 5 minutes',
      'Side effects': 'Also undoes the pricing tweak bundled in TR-4471',
      'Needs approval': 'Level 3: app owner',
    },
  },
  {
    id: 'patch',
    name: 'Patch the mapping in production',
    how: 'Point Buyer tax ID back to STCD3 directly in production, keeping the rest of TR-4471.',
    rows: {
      'Time to recover': 'About 2 hours, plus testing',
      Risk: 'Medium: a new, untested change at night',
      Reversible: 'Partly; needs a second emergency change',
      'Side effects': 'None known',
      'Needs approval': 'Level 3: app owner and change board',
    },
  },
]

export const KB = {
  title: 'E-invoices rejected for missing buyer tax ID after a mapping change',
  symptoms: 'E-invoice IDocs fail with status 51; the portal rejects them for a missing buyer tax ID; billing keeps posting normally.',
  check: 'Compare the e-invoice output mapping with the last version that worked. Look for a recent transport that touches it.',
  fix: 'Revert the transport (or restore the mapping), reprocess the failed IDocs in batches, and confirm acceptance at the portal.',
  learnedFrom: 'O2C-0187',
}

export const PROBLEM = {
  id: 'PRB-0044',
  rootCause: 'TR-4471 pointed Buyer tax ID at a field that is empty for most domestic customers.',
  whyMissed: 'QA tests for the transport checked the invoice layout but did not send a test invoice to the tax portal sandbox.',
  actions: [
    { text: 'Pre-release check: send one test invoice to the portal sandbox for any transport that touches e-invoice mappings', owner: 'Change-risk agent, approved by the app owner' },
    { text: 'Re-raise the pricing tweak from TR-4471 as its own transport', owner: 'Finance IT' },
  ],
}
