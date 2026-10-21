// L1 analyst content: the Monday-morning supervision queue. Figures are illustrative sample data.

export const BRIEF = {
  resolved: 37,
  needsYou: 3,
  window: 'Fri 18:00 to Mon 09:00',
}

export const NEEDS_YOU = [
  {
    id: 'exception',
    kind: 'Handed off',
    flow: 'Order to cash',
    title: 'Customer asks for a corrected invoice copy',
    agent: 'service-desk',
    confidence: 48,
    why: 'Northwind Retail says the invoice copy they received has no buyer tax ID. Their invoice was resent after Saturday’s fix, and I can’t tell whether they have the old rejected version or the new accepted one, so I handed this to a person.',
    steps: [
      { text: 'Invoice 90031877 was accepted by the tax portal on Sat 23:41', checked: true, by: 'Checked by the agent' },
      { text: 'The copy the customer attached is the rejected 21:52 version', checked: true, by: 'Checked by the agent' },
      { text: 'Send the accepted PDF from the portal record with the reply below', checked: false },
    ],
    draft:
      'Hello Ana, thanks for flagging this. The copy you have is from before Saturday’s fix. Attached is the accepted invoice 90031877, which includes your tax ID. No action is needed on your side. Sorry for the trouble.',
  },
  {
    id: 'approval',
    kind: 'Level 2 approval',
    flow: 'Order to cash',
    title: 'Rerun the Sunday billing due-list job',
    agent: 'remediation',
    confidence: 94,
    why: 'BILL_DUE_SUN failed at Sun 01:00 because IDoc reprocessing still held a lock. The lock is gone and nothing else is running. For this job I may only recommend a rerun, so it needs your yes.',
    facts: [
      ['Effect', 'Creates the 214 billing documents that were due on Sunday'],
      ['Risk', 'Low: the job skips documents that already exist'],
      ['Track record', '9 of 9 recommended reruns approved and clean'],
    ],
    after: 'Rerun complete: 214 billing documents created. This was the 10th clean rerun, so the app owner will be offered to let the agent do it alone.',
  },
  {
    id: 'review',
    kind: 'Spot check',
    flow: 'Order to cash',
    title: 'Reply to sales operations about late invoices',
    agent: 'service-desk',
    confidence: 81,
    why: 'I answered this myself, but my confidence was below 85%, so it was sampled for a person to check.',
    thread: [
      { from: 'user', name: 'Priya, Sales operations', text: 'Several key accounts say they didn’t get invoices on Saturday. Is that still a problem and will it affect payment terms?' },
      { from: 'agent', text: 'Saturday’s e-invoicing issue was fixed on Sunday at 00:20 and all 512 invoices were accepted by the tax portal. Payment terms run from the invoice date, which did not change, so customers have no extra days.' },
    ],
    source: 'Incident O2C-0187 record; payment terms policy FIN-12',
  },
]

export const RESOLVED = [
  {
    flow: 'Order to cash',
    items: [
      {
        id: 'o2c-tickets',
        title: '“Invoices not reaching customers” tickets',
        count: 6,
        agent: 'service-desk',
        confidence: 96,
        level: 'Act and tell',
        summary: 'Linked to incident O2C-0187, kept users updated, and closed once invoices were accepted.',
        thread: [
          { from: 'user', name: 'Mark, Billing team', text: 'E-invoices are failing for all customers since about 22:00. Can someone look?' },
          { from: 'agent', text: 'Thanks Mark. This is a known incident (O2C-0187) and an engineer is working on it. I’ll update you here when it’s fixed.' },
          { from: 'agent', text: 'Fixed at 00:20: all waiting invoices were resent and accepted by the tax portal. Closing this ticket; reply if you still see a problem.' },
        ],
      },
      { id: 'credit', title: 'Credit-limit sync job rerun', count: 1, agent: 'remediation', confidence: 99, level: 'Act and tell', summary: 'Failed on a timeout at 03:10; rerun at 03:12 and verified.' },
    ],
  },
  {
    flow: 'Procure to pay',
    items: [
      { id: 'channel', title: 'Supplier portal channel restarted', count: 1, agent: 'remediation', confidence: 98, level: 'Act and tell', summary: 'Channel stuck after a certificate refresh; restarted and 41 messages delivered.' },
      { id: 'howto', title: 'How-to questions answered', count: 11, agent: 'service-desk', confidence: 93, level: 'Act and tell', summary: 'Goods receipts, invoice holds and supplier lookups, answered from the knowledge base.' },
    ],
  },
  {
    flow: 'Access and accounts',
    items: [
      { id: 'pw', title: 'Password resets and unlocks', count: 17, agent: 'service-desk', confidence: 99, level: 'Act and tell', summary: 'Identity verified with the user’s registered device each time.' },
    ],
  },
  {
    flow: 'Record to report',
    items: [
      { id: 'fx', title: 'Exchange-rate load ran late', count: 1, agent: 'flow-health', confidence: 97, level: 'Inform', summary: 'Ran 40 minutes late, then completed; no reports affected. Noted for the month-end watch.' },
    ],
  },
]
