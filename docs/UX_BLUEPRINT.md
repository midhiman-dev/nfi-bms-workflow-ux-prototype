# UX Blueprint — NFI BMS Workflow Prototype

## 1. Purpose

This is the prototype-facing screen specification for stakeholder validation. It converts the frozen NFI BMS final workflow into a small, reusable interactive web experience.

The prototype must answer four user questions on every workflow screen:

1. Where is this case now?
2. What needs my attention?
3. What can I do?
4. What happens next?

## 2. Mandatory Visual & Interaction Continuity With Existing NFI BMS

This prototype is a **workflow redesign inside the existing NFI BMS product**, not a redesign of the product itself.

A stakeholder familiar with the current NFI BMS should immediately recognize the prototype as the same application.

The prototype must preserve, as closely as practical, the existing NFI BMS visual and interaction language:

- dark teal top application bar,
- NFI branding and Beneficiary Management System identity,
- left navigation shell,
- existing primary navigation labels such as Dashboard, Cases, New Case, Finance Inputs, Reports and Admin where appropriate,
- signed-in user / active-role treatment in the header,
- current content width and information density,
- compact operational cards,
- existing button hierarchy,
- status badges/chips,
- case-list/table treatment,
- typography hierarchy,
- spacing rhythm,
- teal/green accent vocabulary,
- restrained operational styling.

The redesign must primarily affect workflow-dependent content inside the existing shell.

### Explicitly avoid

Do not make the prototype look like a separate product or design concept.

Do not:

- replace the main header with oversized `WORKFLOW UX PROTOTYPE` branding,
- remove the familiar left navigation,
- replace the normal Cases page with a generic demo-only dashboard,
- make prototype controls look like production navigation or business functionality,
- use large amounts of empty whitespace that materially reduce the current application's information density,
- introduce a new visual brand system,
- radically change established page names without a workflow reason,
- make NFI reviewers learn a new application shell merely to review the workflow changes.

### Prototype-only controls

Role/scenario switching is allowed only as a stakeholder-demo aid.

It must be visually separated from the production-like UI, for example through:

- a small `Demo controls` button,
- a collapsible prototype drawer,
- or a subtle prototype-only utility strip.

It must not dominate the top bar or appear to be a production feature.

A subtle persistent indicator may state:

> Prototype — Synthetic demonstration data only

## 3. Shared Page Anatomy

Use the existing NFI BMS application shell for workflow pages:

```text
Existing NFI BMS topbar
Existing left navigation
Workspace / content area
  Page heading / breadcrumb
  Case identity strip where applicable
  Workflow progress where applicable
  Current-stage summary / blocker guidance
  Stage-specific content
  Primary and secondary actions
Subtle prototype disclaimer
```

### Case identity strip

Show only essential identity:

- case reference,
- beneficiary name,
- hospital,
- broad case status,
- beneficiary number only when it exists.

Do not repeat the full case form on every screen.

## 4. Prototype Controls

The prototype may include controls that do not exist in production because they make stakeholder review faster, but they must remain visually secondary to the real product shell.

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

The preferred presentation is a small prototype-only control panel rather than always-visible large selectors in the production-like header.

## 5. Workflow Progress Component

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

## 6. Status Treatment

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

## 7. Shared Review Interaction Family

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

## 8. Screen 1 — Cases / Role-Aware Work Queue

### Purpose

Preserve the existing **Cases** page while making workflow work easier to find.

Do not rename the primary application page to `My Work`.

### Layout

Retain the familiar Cases-page structure:

- page title: **Cases**,
- existing descriptive subtitle,
- New Case action where applicable,
- search,
- status chips,
- filters,
- case table/list,
- role-relevant workflow-stage filters/chips,
- optional small `My Work | All Cases` view switch where useful.

### Row hierarchy

Preserve the existing operational case-list style and add detailed workflow stage without discarding established fields.

Show approximately:

- case reference,
- beneficiary / baby name,
- hospital,
- broad status,
- detailed workflow stage,
- checklist/progress where useful,
- last updated,
- role-relevant action.

### Synthetic representative records

The initial stakeholder view should not be an empty state.

Seed multiple obvious demo cases across representative stages, for example:

- Awaiting Initial Verification
- Awaiting Medical Review
- Financial Review Pending
- Ready for Sponsor Quantification
- Awaiting Director Approval
- Revision Requested by Director
- Approved

Role switching may filter/reorder these cases or change available actions, but the app should continue to feel like an operational Cases screen.

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

## 9. Screen 2 — Case Detail + Workflow Progress

### Purpose

Act as the unified case workspace and the principal location where the FGR workflow redesign becomes visible.

### Layout

Keep the familiar case-detail workspace and add:

- case identity strip,
- workflow progress,
- current-stage card,
- key case summary,
- existing-style stage/tab navigation,
- role-relevant primary-action shortcut.

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

The workflow progress component should be a prominent enhancement without making the page feel disconnected from the current NFI BMS case workspace.

## 10. Screen 3 — Verifier: Initial Verification

### Layout

- existing case shell + case identity
- workflow progress
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

## 11. Screen 4 — Medical Review

### Layout

- existing case shell + case identity
- workflow progress
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

## 12. Screen 5 — Social Review

Use the shared review shell inside the familiar Case Detail workspace.

### Representative states

- Locked before Medical approval
- Assigned / In progress
- Approved while Financial pending
- Need More Information
- Submitted / Read-only

### Guidance example

> Social Review is complete. Sponsor Quantification will become available after Financial Review is also approved.

## 13. Screen 6 — Financial Review

Use the same shared review shell with financial-specific summary/context.

### Representative states

- Locked before Medical approval
- Assigned / In progress
- Approved while Social pending
- Need More Information
- Submitted / Read-only

Never imply that Financial waits for Social or vice versa.

## 14. Screen 7 — Verifier: Sponsor Amount Quantification

### Layout

- existing case shell + case identity
- workflow progress
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

## 15. Screen 8 — Sponsor Quantification: Revision Requested

### Layout

- existing case shell + workflow progress showing Revision Requested
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

## 16. Screen 9 — Director Sponsorship Approval

### Purpose

A concise decision workspace inside the familiar application shell, not a giant editable dossier.

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

## 17. Screen 10 — Panel / Committee Recommendation or History

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

## 18. Screen 11 — Final Approved

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

## 19. Screen 12 — Final Rejected

### Layout

- case identity
- workflow progress ending at Rejected
- prominent Rejected state
- Director decision summary
- Director comments/reason
- optional existing appeal/history navigation as non-prototype continuation

No normal-path workflow action remains available.

Do not imply Settlement is the next stage.

## 20. Action Hierarchy

Prefer one primary action per current task.

Examples:

- Complete Verification
- Submit Medical Review
- Submit Social Review
- Submit Financial Review
- Submit to Director
- Resubmit to Director
- Approve on Director screen

Secondary actions include Save Draft, Back to Cases and View Documents.

Final/destructive actions require confirmation.

## 21. Visual Direction

The visual target is **the current NFI BMS application with workflow improvements**, not a new generic enterprise/NGO interface.

Priorities:

1. visual continuity with the current NFI BMS,
2. operational information density,
3. recognizable shell/navigation,
4. obvious current workflow stage,
5. clear role-relevant actions,
6. restrained status emphasis,
7. accessible forms and keyboard behavior.

Use whitespace deliberately, but do not make the UI substantially more sparse than the current application.

Do not spend prototype effort on:

- a new brand system,
- elaborate animation,
- glossy marketing layouts,
- large decorative charts,
- mobile-native navigation,
- broad dashboard redesign unrelated to the FGR workflow.

## 22. Prototype Acceptance

The prototype is acceptable for NFI walkthrough when:

- it is immediately recognizable as NFI BMS,
- stakeholders do not have to learn a new shell/navigation model,
- the Cases page remains familiar while exposing role-aware workflow stages,
- Case Detail clearly shows the new workflow progress and current stage,
- stakeholders can understand where each case is,
- stakeholders can understand who acts next,
- each role sees the correct actions,
- blocker reasons are clear,
- Social and Financial are visibly parallel,
- Verifier proposes but Director decides,
- Director revision clearly returns to Verifier,
- Approved/Rejected are clear terminal states,
- prototype-only controls do not appear to be production features.