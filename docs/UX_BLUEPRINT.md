# UX Blueprint — NFI BMS Workflow Prototype

## 1. Purpose

This is the prototype-facing screen specification for stakeholder validation. It converts the frozen NFI BMS final workflow into a small, reusable interactive web experience.

The prototype must answer four user questions on every workflow screen:

1. Where is this case now?
2. What needs my attention?
3. What can I do?
4. What happens next?

## 2. Shared Page Anatomy

Use one common shell for workflow pages:

```text
Application header / prototype controls
Breadcrumb / Back to My Work
Case identity strip
Workflow progress
Current-stage summary / blocker guidance
Stage-specific content
Primary and secondary actions
Prototype disclaimer footer
```

### Case identity strip

Show only essential identity:

- case reference,
- beneficiary name,
- hospital,
- broad case status,
- beneficiary number only when it exists.

Do not repeat the full case form on every screen.

## 3. Prototype Controls

The prototype may include controls that do not exist in production because they make stakeholder review faster.

### Viewing as

Allow switching among:

- Hospital SPOC
- Verifier
- Medical Reviewer
- Social Reviewer
- Financial Reviewer
- Director
- Panel Member

### Demo scenario

Allow selecting representative datasets/states such as:

- Normal Approval
- Financial Review Pending
- Medical Needs More Information
- Director Revision
- Director Rejection
- Approved Case

Changing role or scenario should alter visible queues, actions and current workflow state using local mock data only.

## 4. Workflow Progress Component

Render this hierarchy clearly:

```text
Hospital Submission
      ↓
Verifier Review
      ↓
Medical Review
      ↓
┌───────────────┬──────────────────┐
│ Social Review │ Financial Review │
└───────────────┴──────────────────┘
      ↓ both approved
Sponsor Quantification
      ↓
Director Approval
      ↓
Approved / Rejected
```

Social and Financial must visually appear as parallel siblings, never as a sequence.

### Stage presentation states

Support:

- Completed
- Current / Action Required
- In Progress
- Waiting / Not Yet Available
- Blocked
- Returned for Revision
- Final Approved
- Final Rejected

Use human-readable labels, not backend enum names.

### Blocker copy pattern

State the missing prerequisite directly, for example:

> Sponsor Quantification becomes available after Social and Financial Review are both approved.

## 5. Status Treatment

Show both:

### Broad case status

Examples:

- Draft
- Submitted
- Under Review
- Approved
- Rejected
- Closed

### Detailed workflow stage

Examples:

- Awaiting Initial Verification
- Awaiting Medical Review
- Social & Financial Review in Progress
- Ready for Sponsor Quantification
- Awaiting Director Approval
- Revision Requested by Director

Detailed stage is the primary operational label for internal users.

## 6. Shared Review Interaction Family

Medical, Social and Financial Review should feel like one consistent interaction family:

```text
Review Header
- stage name
- assigned reviewer
- review status
- submitted date when complete

Context Panel
- stage-specific summary
- relevant documents/context

Decision Panel
- outcome
- mandatory comments
- Save/Submit actions

Guidance Panel
- blocker or next-step message
```

Supported outcomes:

- Approve
- Reject
- Need More Information

## 7. Screen 1 — Case List / My Work

### Purpose

Immediately surface cases requiring the current role's attention.

### Layout

- title: My Work
- role-specific count chips
- search
- role-relevant filter chips
- case list/table
- optional `My Work | All Cases` switch

### Row hierarchy

- case reference
- beneficiary
- hospital
- detailed workflow stage
- assigned/current owner where useful
- last updated/waiting since
- Open action

### Role examples

Verifier filters:

- Awaiting Initial Verification
- Ready for Sponsor Quantification
- Revision Requested by Director

Medical Reviewer:

- Assigned to Me
- Awaiting Medical Review

Social Reviewer:

- Assigned to Me
- Awaiting Social Review

Financial Reviewer:

- Assigned to Me
- Awaiting Financial Review

Director:

- Pending Sponsorship Approval

## 8. Screen 2 — Case Detail + Workflow Progress

### Purpose

Act as the unified case workspace.

### Layout

- case identity strip
- workflow progress
- current-stage card
- key case summary
- stage navigation
- role-relevant primary-action shortcut

### Current-stage card

Show:

- current stage,
- owner/assigned reviewer,
- status,
- blocker/next step,
- current user's primary action when available.

Representative states:

- Medical pending
- Social approved / Financial pending
- Ready for Sponsor Quantification
- Awaiting Director
- Director revision returned
- Approved

## 9. Screen 3 — Verifier: Initial Verification

### Layout

- case identity + workflow progress
- verification readiness summary
- required document/verification checklist
- comments/observations
- next-step guidance
- actions

### Actions

- Complete Verification
- Return to Hospital / Request Correction where represented

### Completion guidance

> Verification complete. The case will move to Medical Review.

This screen must be visually distinct from Sponsor Quantification.

## 10. Screen 4 — Medical Review

### Layout

- case identity + workflow progress
- review status/assignment
- essential medical summary
- relevant medical documents/context
- outcome selector
- mandatory comments
- actions

### Representative states

- Not assigned
- Assigned / In progress
- Approved
- Need More Information
- Submitted / Read-only

### Approved guidance

> Medical Review approved. Social and Financial Review can now proceed in parallel.

## 11. Screen 5 — Social Review

Use the shared review shell.

### Representative states

- Locked before Medical approval
- Assigned / In progress
- Approved while Financial pending
- Need More Information
- Submitted / Read-only

### Guidance example

> Social Review is complete. Sponsor Quantification will become available after Financial Review is also approved.

## 12. Screen 6 — Financial Review

Use the same shared review shell with financial-specific summary/context.

### Representative states

- Locked before Medical approval
- Assigned / In progress
- Approved while Social pending
- Need More Information
- Submitted / Read-only

Never imply that Financial waits for Social or vice versa.

## 13. Screen 7 — Verifier: Sponsor Amount Quantification

### Layout

- case identity + workflow progress
- prerequisite review outcome summary
- relevant financial/supporting summary
- proposed sponsorship amount
- quantification notes / justification
- actions

### Actions

- Save Draft
- Submit to Director

### Representative states

- Blocked because prerequisite review pending
- Ready
- Draft saved
- Submitted / locked awaiting Director

### Submit confirmation

> Submit this sponsorship proposal to the Director for final decision?

Verifier must never see a Final Approve action.

## 14. Screen 8 — Sponsor Quantification: Revision Requested

### Layout

- workflow progress showing Revision Requested
- high-visibility Director Revision card
  - Director comments
  - suggested/revised amount if present
  - decision date
- previous Verifier proposal
- editable proposed amount
- editable justification
- actions

### Actions

- Save Revised Draft
- Resubmit to Director

### Guidance

> The Director has requested a revision. Update the sponsorship proposal and resubmit it for approval.

## 15. Screen 9 — Director Sponsorship Approval

### Purpose

A concise decision workspace, not a giant editable dossier.

### Layout

- case identity + workflow progress
- beneficiary/case summary
- Medical outcome
- Social outcome
- Financial outcome
- Verifier proposal card
  - proposed amount
  - quantification notes
- optional Panel/Committee recommendation context
- Director decision section
- mandatory comments
- actions

### Actions

- Approve
- Reject
- Revise

When Revise is chosen, show a suggested/revised amount field and explain that the case returns to Verifier.

### Confirmations

Approve:

> Approve this sponsorship proposal and finalize the case as Approved?

Reject:

> Reject this sponsorship request and finalize the case as Rejected?

Revise:

> Return this proposal to the Verifier for revision?

## 16. Screen 10 — Panel / Committee Recommendation or History

### Layout

- case identity + workflow progress
- explanatory Panel/Committee Recommendation banner
- recommendation/history content
- funding recommendation context if used
- audit/history metadata

If active recommendation is represented, the only actions are recommendation-oriented, such as Save Recommendation or Submit Recommendation.

Never show:

- Final Approve
- Final Reject
- Generate Beneficiary Number
- authoritative final approved amount controls

Guidance:

> Panel/Committee information is supporting recommendation context. Final sponsorship approval is completed by the Director.

## 17. Screen 11 — Final Approved

### Layout

- case identity
- workflow progress completed through Director → Approved
- prominent Approved state
- final approval summary
  - Director decision
  - authoritative approved amount
  - decision date
  - beneficiary number if present
- next-step card

Guidance:

> Sponsorship approved. The case can now proceed to Settlement & Closure.

No review-stage action remains available.

## 18. Screen 12 — Final Rejected

### Layout

- case identity
- workflow progress ending at Rejected
- prominent Rejected state
- Director decision summary
- Director comments/reason
- optional existing appeal/history navigation as non-prototype continuation

No normal-path workflow action remains available.

Do not imply Settlement is the next stage.

## 19. Action Hierarchy

Prefer one primary action per current task.

Examples:

- Complete Verification
- Submit Medical Review
- Submit Social Review
- Submit Financial Review
- Submit to Director
- Resubmit to Director
- Approve on Director screen

Secondary actions include Save Draft, Back to My Work and View Documents.

Final/destructive actions require confirmation.

## 20. Visual Direction

Keep the visual language calm, operational and accessible.

Use:

- generous whitespace,
- readable typography,
- clear cards/sections,
- restrained status emphasis,
- obvious primary action,
- desktop-first responsive layout,
- accessible focus and keyboard behavior.

Do not spend prototype effort on a new brand system, elaborate animation or decorative dashboard visuals.

## 21. Prototype Acceptance

The prototype is acceptable for NFI walkthrough when stakeholders can clearly understand:

- where each case is,
- who acts next,
- what each role can do,
- why an action is blocked,
- that Social and Financial happen in parallel,
- that Verifier proposes but Director decides,
- how Director revision returns to Verifier,
- and what Approved/Rejected look like as terminal states.