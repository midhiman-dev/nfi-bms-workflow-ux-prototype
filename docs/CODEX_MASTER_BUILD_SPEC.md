# Codex Master Build Specification — NFI BMS Workflow UX Prototype

## 1. Objective

Build a polished but lightweight clickable web prototype for the NFI BMS final workflow UX.

The prototype is for stakeholder validation and portfolio demonstration only. It must not connect to production systems or contain real beneficiary data.

The source-of-truth documents in this repository are:

1. `docs/PROTOTYPE_GUARDRAILS.md`
2. `docs/UX_BLUEPRINT.md`
3. `docs/DEMO_JOURNEYS.md`

Read all three before changing code.

If implementation convenience conflicts with those documents, the documents win.

## 2. Non-Negotiable Workflow

Implement exactly this conceptual flow:

```text
Hospital Submission
        ↓
Verifier Review
        ↓
Medical Review
        ↓
Social Review + Financial Review
        ↓
Verifier Sponsor Amount Quantification
        ↓
Director Sponsorship Approval
        ↓
Approved / Rejected
```

Settlement & Closure may be shown as downstream guidance after Approved but is not part of the main prototype implementation.

Do not introduce new workflow stages or approval authorities.

## 3. Non-Negotiable Role Rules

- Verifier performs Initial Verification.
- Medical Reviewer acts after Verifier completion.
- Medical approval unlocks both Social and Financial Review.
- Social and Financial Review are parallel siblings.
- Both must be approved before Sponsor Quantification is actionable.
- Verifier performs Sponsor Amount Quantification.
- Verifier proposes an amount and cannot finally approve sponsorship.
- Director is the sole normal-path final sponsorship authority.
- Director actions: Approve, Reject, Revise.
- Revise returns the proposal to Verifier while keeping the case under review.
- Panel/Committee is recommendation/history context only and must not finalize the case or authoritative amount.

## 4. Technology

Use:

- React
- TypeScript
- Vite
- React Router
- plain CSS or CSS modules
- optional `lucide-react` for icons

Avoid:

- backend frameworks,
- databases,
- authentication providers,
- external APIs,
- paid libraries,
- heavyweight state-management frameworks,
- unnecessary design-system dependencies.

The app must build as a static site suitable for Netlify.

## 5. Repository Structure

A suggested structure is:

```text
src/
  app/
  components/
  screens/
  mock-data/
  models/
  styles/
```

Do not create one large monolithic component.

## 6. Shared Components

Create reusable components approximately along these lines:

- `AppShell`
- `PrototypeToolbar`
- `CaseIdentityStrip`
- `WorkflowProgress`
- `StatusBadge`
- `AttentionBanner`
- `BlockerBanner`
- `CaseSummaryCard`
- `ReviewStageShell`
- `OutcomeSelector`
- `CommentsPanel`
- `SponsorQuantificationForm`
- `DirectorDecisionPanel`
- `ConfirmationDialog`
- `MyWorkQueue`

Medical, Social and Financial screens should reuse `ReviewStageShell` rather than duplicate full layouts.

## 7. Prototype Toolbar

Include a visible prototype-only toolbar.

### Role selector

Options:

- Hospital SPOC
- Verifier
- Medical Reviewer
- Social Reviewer
- Financial Reviewer
- Director
- Panel Member

### Scenario selector

Options:

- Normal Approval
- Financial Review Pending
- Medical Needs More Information
- Director Revision
- Director Rejection
- Approved Case

Changing scenario should reset mock state to a known representative point.

This toolbar is intentionally not production UX.

## 8. Required Screens

Implement all 12 blueprint surfaces:

1. Case List / My Work
2. Case Detail + Workflow Progress
3. Verifier — Initial Verification
4. Medical Review
5. Social Review
6. Financial Review
7. Verifier — Sponsor Amount Quantification
8. Sponsor Quantification — Revision Requested by Director
9. Director Sponsorship Approval
10. Panel / Committee Recommendation or History
11. Final Approved state
12. Final Rejected state

Follow `docs/UX_BLUEPRINT.md` for each screen's content hierarchy and actions.

## 9. Workflow Progress

This is one of the most important components.

It must visibly represent:

```text
Hospital → Verifier → Medical → [Social + Financial] → Sponsor → Director → Approved/Rejected
```

Social and Financial must appear side-by-side at equal hierarchy.

Support visual states:

- completed,
- current/action required,
- in progress,
- waiting,
- blocked,
- revision requested,
- approved,
- rejected.

Do not show raw enum names.

## 10. Queue Behavior

`My Work` must be role-aware.

### Verifier

Show categories for:

- Awaiting Initial Verification
- Ready for Sponsor Quantification
- Revision Requested by Director

### Medical Reviewer

- Assigned to Me
- Awaiting Medical Review

### Social Reviewer

- Assigned to Me
- Awaiting Social Review

### Financial Reviewer

- Assigned to Me
- Awaiting Financial Review

### Director

- Pending Sponsorship Approval

Use mock readiness/stage data, not broad case status alone, to determine the visible task label.

## 11. Mock State Model

Create a small explicit TypeScript model for prototype state rather than scattering booleans across components.

Recommended concepts:

```text
Case
- id
- caseRef
- beneficiaryName
- hospital
- broadStatus
- beneficiaryNumber?
- currentStage
- medicalReview
- socialReview
- financialReview
- sponsorProposal
- directorDecision
- panelRecommendation?
```

Review states should support:

- not assigned,
- assigned/in progress,
- approved,
- rejected,
- need more information.

Sponsor states should support:

- unavailable,
- ready,
- draft,
- pending director,
- revision requested.

Director states should support:

- not ready,
- pending,
- approved,
- rejected,
- revised.

Keep this model prototype-oriented; do not recreate the production backend schema.

## 12. Synthetic Data

Use only obvious demo records.

Use examples from `docs/DEMO_JOURNEYS.md` or equivalent synthetic names.

Never add actual NFI beneficiary information, Aadhaar numbers, phone numbers, production screenshots, URLs, credentials or documents.

A persistent footer must say:

> Prototype — Synthetic demonstration data only

## 13. Interaction Requirements

Prototype actions should update local state so the main journeys are genuinely clickable.

At minimum:

- Complete Verification advances to Medical.
- Medical Approve unlocks Social and Financial.
- Social/Financial outcomes update progress independently.
- Sponsor Quantification remains blocked until both are approved.
- Submit to Director moves to pending Director state.
- Director Approve moves to final Approved.
- Director Reject moves to final Rejected.
- Director Revise creates Revision Requested state and returns work to Verifier.
- Resubmit returns the proposal to Director.

Confirmation dialogs are required for:

- Submit to Director,
- Resubmit to Director,
- Director Approve,
- Director Reject,
- Director Revise.

## 14. Action Visibility

Prefer hiding irrelevant actions for the current role.

Show a disabled action only when doing so helps explain a meaningful blocker.

Examples:

- Sponsor Quantification may be visibly disabled with blocker guidance while Financial Review is pending.
- Director controls must not appear for Admin-like/other roles.
- Verifier must never receive Final Approve controls.
- Panel must never receive final sponsorship authority controls.

## 15. Visual Direction

Aim for a calm, modern enterprise/NGO operations interface.

Priorities:

- readability,
- obvious hierarchy,
- clear current task,
- clear workflow progress,
- accessible forms,
- moderate card use,
- restrained visual treatment,
- desktop-first but responsive.

Do not spend time on:

- elaborate animation,
- glossy marketing layouts,
- large dashboard charts,
- a brand redesign,
- mobile-native navigation.

The prototype should feel believable as a future version of an operational case-management application.

## 16. Accessibility

Use semantic HTML and reasonable accessibility defaults:

- labeled inputs,
- visible keyboard focus,
- button elements for actions,
- sufficient contrast,
- accessible dialog behavior,
- no meaning conveyed by color alone.

## 17. Routing

Use understandable routes, for example:

```text
/
/cases
/cases/:caseId
/cases/:caseId/verification
/cases/:caseId/medical-review
/cases/:caseId/social-review
/cases/:caseId/financial-review
/cases/:caseId/sponsor-quantification
/cases/:caseId/director-approval
/cases/:caseId/panel
```

Exact paths can vary, but browser refresh/deep links must work after Netlify deployment.

Add the appropriate Netlify SPA redirect configuration.

## 18. Netlify Readiness

The repository should include everything required for a standard Netlify static deployment.

Expected build characteristics:

- install: `npm install`
- build: `npm run build`
- publish: `dist`

Add `netlify.toml` with SPA fallback if appropriate.

Do not add environment variables because the prototype should not need any.

## 19. Documentation After Build

Update README with:

- local run instructions,
- build instructions,
- prototype controls,
- Netlify deployment note,
- known limitations.

If you make an implementation decision not covered by this spec, record it briefly in `docs/IMPLEMENTATION_NOTES.md` rather than silently changing the workflow contract.

## 20. Acceptance Criteria

Before declaring the prototype ready:

- `npm install` succeeds.
- `npm run build` succeeds with no TypeScript errors.
- all 12 surfaces are reachable.
- all four journeys in `docs/DEMO_JOURNEYS.md` can be demonstrated.
- role selector changes relevant work/action visibility.
- scenario selector resets to deterministic mock states.
- Social and Financial appear as parallel stages.
- Sponsor remains blocked until both are approved.
- Director revision loop works.
- Panel cannot finalize.
- final Approved and Rejected states are clear.
- synthetic-data disclaimer is always visible.
- no external API/network integration is required for normal operation.

## 21. Working Method for Codex

Before coding:

1. Read all docs.
2. Summarize the intended architecture and planned files.
3. Scaffold the application.
4. Build shared components before duplicating screen markup.
5. Implement mock state and demo scenarios.
6. Implement screens and routing.
7. Exercise the four demo journeys.
8. Run the production build.
9. Fix all build/type errors.
10. Update documentation.

Do not ask for workflow clarification unless the repository documents genuinely conflict. Do not invent additional product scope.