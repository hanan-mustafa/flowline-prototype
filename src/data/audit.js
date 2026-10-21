// Append-only audit trail for incident O2C-0187. `m` is the story step at which an entry exists.

export const AUDIT = [
  { m: 0, at: 'Sat 21:40', actor: { kind: 'change' }, text: 'Transport TR-4471 imported to production', meta: 'Change CHG-2291 · owner: finance IT' },
  { m: 1, at: 'Sat 22:05', actor: { kind: 'agent', id: 'flow-health' }, text: 'Flagged e-invoice acceptance near zero', meta: 'Level 1 · Inform' },
  { m: 2, at: 'Sat 22:09', actor: { kind: 'agent', id: 'triage' }, text: 'Opened O2C-0187 (P1) and linked 43 alerts and 6 tickets', meta: 'Level 4 · Act and tell' },
  { m: 2, at: 'Sat 22:11', actor: { kind: 'agent', id: 'service-desk' }, text: 'Told 6 users the incident is being worked on', meta: 'Level 4 · Act and tell' },
  { m: 3, at: 'Sat 22:31', actor: { kind: 'agent', id: 'investigation' }, text: 'Published case file: probable cause TR-4471 (92%)', meta: 'Read-only · no production access' },
  { m: 3, at: 'Sat 22:31', actor: { kind: 'agent', id: 'triage' }, text: 'Paged the on-call L2/L3 engineer', meta: 'Level 4 · Act and tell' },
  { m: 4, at: 'Sat 22:44', actor: { kind: 'agent', id: 'remediation' }, text: 'Dry run of the revert and its rollback passed in QA', meta: 'Level 4 · QA only' },
  { m: 4, at: 'Sat 22:48', actor: { kind: 'role', id: 'engineer' }, text: 'Confirmed the cause and backed the revert', meta: 'Decision', tag: 'decision' },
  { m: 4, at: 'Sat 22:48', actor: { kind: 'agent', id: 'remediation' }, text: 'Requested approval to revert TR-4471', meta: 'Level 3 · needs a named approver', tag: 'approval' },
  { m: 5, at: 'Sat 23:02', actor: { kind: 'role', id: 'owner' }, text: 'Approved the revert, to run now', meta: 'Named approver', tag: 'decision' },
  { m: 5, at: 'Sat 23:04', actor: { kind: 'agent', id: 'remediation' }, text: 'Imported TR-4472 (restores the mapping)', meta: 'Approved by app owner · rollback: re-import TR-4471', tag: 'rollback' },
  { m: 6, at: 'Sat 23:15', actor: { kind: 'agent', id: 'remediation' }, text: 'Reprocessed 512 failed IDocs in 11 batches', meta: 'Within the approved plan' },
  { m: 6, at: 'Sun 00:20', actor: { kind: 'agent', id: 'remediation' }, text: 'Verified 512 of 512 invoices accepted; flow back to normal', meta: 'Verification' },
  { m: 6, at: 'Sun 00:50', actor: { kind: 'agent', id: 'remediation' }, text: 'Closed O2C-0187 after a 30-minute watch; rollback released', meta: 'Level 4 · Act and tell' },
  { m: 6, at: 'Sun 00:52', actor: { kind: 'agent', id: 'knowledge' }, text: 'Drafted knowledge article from the fix', meta: 'Waiting for engineer sign-off' },
  { m: 6, at: 'Sun 00:55', actor: { kind: 'agent', id: 'problem' }, text: 'Opened problem record PRB-0044', meta: 'Waiting for engineer sign-off' },
  { m: 7, at: 'Mon 08:30', actor: { kind: 'agent', id: 'change-risk' }, text: 'Proposed a pre-release check for e-invoice mappings', meta: 'Waiting for app owner', tag: 'approval' },
]
