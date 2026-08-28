# Demo Journeys — NFI BMS Workflow UX Prototype

## Purpose

These journeys define the minimum clickable paths needed for stakeholder review. The prototype should make them easy to launch from a scenario selector without requiring setup or data entry.

## Journey 1 — Normal Approval

### Goal

Demonstrate the complete happy path and the separation of role responsibilities.

### Starting state

Case `DEMO-NFI-001` is Submitted and awaiting Initial Verification.

### Steps

1. **Verifier** opens `Awaiting Initial Verification`.
2. Verifier reviews the readiness/checklist and selects **Complete Verification**.
3. Case moves to **Medical Review**.
4. **Medical Reviewer** submits **Approve** with comments.
5. Workflow progress unlocks **Social Review** and **Financial Review** in parallel.
6. **Social Reviewer** submits **Approve**.
7. Workflow shows Social complete while Financial remains in progress.
8. **Financial Reviewer** submits **Approve**.
9. Case becomes **Ready for Sponsor Quantification**.
10. **Verifier** enters proposed sponsorship amount and justification.
11. Verifier selects **Submit to Director** and confirms.
12. **Director** sees the case in `Pending Sponsorship Approval`.
13. Director reviews Medical/Social/Financial outcomes and Verifier proposal.
14. Director selects **Approve**, enters mandatory comments and confirms.
15. Case displays the **Final Approved** state and downstream Settlement & Closure guidance.

### What this validates

- Initial Verification and Sponsor Quantification are distinct Verifier tasks.
- Medical gates Social/Financial.
- Social/Financial are parallel.
- Both approvals are required before Sponsor Quantification.
- Verifier proposes; Director decides.
- Approved is a terminal workflow state before settlement.

---

## Journey 2 — Director Revision

### Goal

Validate the revision loop without reopening earlier review stages.

### Starting state

Case `DEMO-NFI-002` is awaiting Director Sponsorship Approval with all prerequisite reviews approved and a Verifier proposal submitted.

### Steps

1. **Director** opens the pending approval.
2. Director selects **Revise**.
3. Suggested/revised amount and mandatory comments are entered.
4. Director confirms **Return to Verifier for revision**.
5. Workflow displays **Revision Requested by Director**.
6. **Verifier** sees the case in `Revision Requested by Director` queue.
7. Verifier opens the dedicated revision screen.
8. Director comments and suggested amount are prominent.
9. Verifier edits proposed amount/justification.
10. Verifier selects **Resubmit to Director** and confirms.
11. **Director** sees the resubmitted proposal again.
12. Director may Approve to complete the journey.

### What this validates

- Revise is not a rejection.
- Case stays under review.
- Revision returns specifically to Sponsor Quantification.
- Verifier does not need to search generic workflow-extension controls.
- Director feedback remains visible during resubmission.

---

## Journey 3 — Blocked Workflow

### Goal

Validate readiness guidance and parallel review status.

### Starting state

Case `DEMO-NFI-003` has:

- Medical Review: Approved
- Social Review: Approved
- Financial Review: In Progress

### Steps

1. Open Case Detail as **Verifier**.
2. Workflow progress shows Social approved and Financial in progress side-by-side.
3. Sponsor Quantification is visible as waiting/blocked rather than actionable.
4. Blocker copy states:

   > Sponsor Quantification becomes available after Social and Financial Review are both approved.

5. No Submit to Director or final approval action is available.
6. Switch to **Financial Reviewer**.
7. The case appears in the Financial My Work queue and can be opened for review.

### Alternate state

A second blocker scenario may show Medical Review = Need More Information. In that state, Social and Financial remain unavailable.

### What this validates

- Detailed readiness, not broad Under Review status, drives action availability.
- Social/Financial parallelism is visually understandable.
- Blocked states explain what is missing without technical jargon.

---

## Journey 4 — Director Rejection

### Goal

Validate the final negative path and confirmation behavior.

### Starting state

Case `DEMO-NFI-004` is pending Director Sponsorship Approval.

### Steps

1. **Director** opens the case.
2. Director reviews all three review outcomes and Verifier proposal.
3. Director selects **Reject**.
4. Mandatory comments/reason are entered.
5. Confirmation states that the sponsorship request will be finalized as Rejected.
6. Director confirms.
7. Case displays the **Final Rejected** state.
8. No normal-path workflow or settlement action remains available.

### What this validates

- Director owns final rejection.
- Rejection is clearly terminal for the normal sponsorship path.
- Settlement is not presented as the next step.

---

## Scenario Selector

For fast stakeholder review, provide a demo control that can reset/jump to representative states:

- Normal Approval
- Financial Review Pending
- Medical Needs More Information
- Director Revision
- Director Rejection
- Approved Case

Scenario switching is a prototype-only capability and should be visibly identified as such.

## Synthetic Demo Data

All journeys must use obviously synthetic records. Suggested examples:

| Case | Beneficiary | Hospital | Demonstration use |
|---|---|---|---|
| DEMO-NFI-001 | Baby Aarav Demo | Sunrise Children's Hospital (Demo) | Normal approval |
| DEMO-NFI-002 | Baby Meera Demo | Hope Neonatal Centre (Demo) | Director revision |
| DEMO-NFI-003 | Baby Kabir Demo | Greenfield Hospital (Demo) | Financial pending/blocker |
| DEMO-NFI-004 | Baby Tara Demo | CarePoint Hospital (Demo) | Director rejection |

These names are placeholders only. No data from production/UAT may be copied into this repository.