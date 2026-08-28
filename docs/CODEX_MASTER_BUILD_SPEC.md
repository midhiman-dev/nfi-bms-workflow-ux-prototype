# Codex Master Build Specification — NFI BMS Workflow UX Prototype

## 1. Objective

Build a polished but lightweight clickable web prototype for the NFI BMS final workflow UX.

The prototype is for stakeholder validation and portfolio demonstration only. It must not connect to production systems or contain real beneficiary data.

The prototype must look and behave like **the existing NFI BMS application with the workflow corrected and extended**. It must not look like a separate product, generic demo app, or standalone design concept.

The source-of-truth documents in this repository are:

1. `docs/PROTOTYPE_GUARDRAILS.md`
2. `docs/UX_BLUEPRINT.md`
3. `docs/DEMO_JOURNEYS.md`

Read all three before changing code.

If implementation convenience conflicts with those documents, the documents win.

## 2. Mandatory Visual Continuity With Existing NFI BMS

This is a non-negotiable correction requirement.

Preserve the current NFI BMS product identity and interaction model as closely as practical:

- dark teal top bar,
- NFI brand presence,
- `Beneficiary Management System` product identity,
- `Neonates Foundation of India` subtitle/context,
- left sidebar navigation,
- familiar navigation labels such as Dashboard, Cases, New Case, Finance Inputs, Reports and Admin where relevant,
- signed-in user / active-role treatment in the header,
- current operational information density,
- compact cards and table/list patterns,
- existing button hierarchy,
- status chip/badge language,
- typography scale and spacing rhythm,
- teal/green accent vocabulary,
- familiar Case Detail workspace.

The prototype should feel like a future release of NFI BMS, not a replacement application.

### Explicitly prohibited presentation choices

Do not:

- place large `NFI BMS WORKFLOW UX PROTOTYPE` branding in the main production-like header,
- make role/scenario selectors dominate the application header,
- remove the left navigation,
- rename the primary Cases screen to `My Work`,
- make the initial stakeholder experience an empty role-specific screen,
- replace the Cases experience with a generic demo-only queue card,
- substantially reduce information density through oversized whitespace,
- introduce a new visual brand/design system,
- treat prototype controls as real product functionality.

Prototype controls must remain visually secondary and clearly marked as demo-only.

## 3. Non-Negotiable Workflow

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

## 4. Non-Negotiable Role Rules

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

## 5. Technology

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

## 6. Repository Structure

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

## 7. Shared Components

Create/reuse components approximately along these lines:

- `AppShell`
- `PrototypeControls`
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
- `CasesTable` or equivalent role-aware Cases view

Medical, Social and Financial screens should reuse `ReviewStageShell` rather than duplicate full layouts.

## 8. App Shell Requirements

The application shell must visually resemble the existing NFI BMS shell.

Required layout:

```text
Topbar
├── NFI branding
├── Beneficiary Management System
├── language control where represented
└── signed-in user / active role

Left Sidebar
├── Dashboard
├── Cases
├── New Case
├── Finance Inputs
├── Reports
└── Admin where relevant

Main Workspace
└── operational page content
```

The shell should be desktop-oriented and operational rather than marketing-oriented.

Do not copy production secrets/data/assets that are unsafe for a public repository. Use recreated/safe branding treatment and synthetic content only.

## 9. Prototype Controls

Keep role/scenario controls because they are useful for stakeholder review, but make them **secondary and unmistakably prototype-only**.

Preferred forms:

- small `Demo controls` button,
- collapsible drawer/panel,
- subtle utility strip outside the primary product navigation.

Do not present large always-visible selectors in the primary header.

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

A subtle persistent label should indicate:

> Prototype — Synthetic demonstration data only

## 10. Required Screens

Implement all 12 blueprint surfaces:

1. Cases / Role-Aware Work Queue
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

## 11. Cases Page — Preserve Existing Interaction Model

The primary page remains **Cases**.

Do not make `My Work` the page title.

Preserve the current application pattern:

- Cases heading,
- descriptive subtitle,
- New Case action where applicable,
- search,
- broad status chips,
- filters,
- operational case table/list,
- role-relevant workflow-stage chips/filters,
- role-relevant action per row.

An optional `My Work | All Cases` sub-view is acceptable, but it must remain inside the Cases experience.

### Table/list information

Retain established case information such as:

- Case Ref,
- Baby/Beneficiary,
- Hospital,
- broad Status,
- Checklist/progress where useful,
- Last Updated,
- Actions.

Add **Detailed Workflow Stage** rather than replacing the established operational fields.

### Initial stakeholder view

Do not show an empty state on first load.

Seed multiple synthetic cases across useful workflow stages so reviewers can immediately understand the redesign.

Representative rows should include cases such as:

- Awaiting Initial Verification,
- Awaiting Medical Review,
- Financial Review Pending,
- Ready for Sponsor Quantification,
- Awaiting Director Approval,
- Revision Requested by Director,
- Approved.

Role switching may filter/reorder the list and change actions, but should not make the product feel empty or broken.

## 12. Workflow Progress

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

The component belongs primarily inside Case Detail and workflow stage pages, not as a standalone novelty dashboard.

## 13. Role-Aware Work Behavior

Role awareness should enhance the familiar Cases experience rather than replace it.

### Verifier

Surface:

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

Use mock readiness/stage data, not broad case status alone, to determine the detailed task label and row action.

## 14. Case Detail Is the Main Redesign Surface

The strongest visible FGR enhancement should appear inside the familiar Case Detail workspace.

Case Detail must clearly show:

- case identity,
- broad case status,
- workflow progress,
- current detailed stage,
- current owner/assigned reviewer,
- blocker or next step,
- role-relevant primary action,
- familiar navigation/tabs for supporting information.

New Medical/Social/Financial/Sponsor/Director experiences should feel like parts of the existing case workspace, not separate mini-apps.

## 15. Mock State Model

Create/retain a small explicit TypeScript model for prototype state rather than scattering booleans across components.

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

## 16. Synthetic Data

Use only obvious demo records.

Use examples from `docs/DEMO_JOURNEYS.md` or equivalent synthetic names.

Never add actual NFI beneficiary information, Aadhaar numbers, phone numbers, production screenshots, URLs, credentials or documents.

A persistent subtle footer/indicator must say:

> Prototype — Synthetic demonstration data only

## 17. Interaction Requirements

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

## 18. Action Visibility

Prefer hiding irrelevant actions for the current role.

Show a disabled action only when doing so helps explain a meaningful blocker.

Examples:

- Sponsor Quantification may be visibly disabled with blocker guidance while Financial Review is pending.
- Director controls must not appear for other roles.
- Verifier must never receive Final Approve controls.
- Panel must never receive final sponsorship authority controls.

## 19. Visual Direction

The visual target is **the current NFI BMS with the final workflow incorporated**.

Priorities, in order:

1. recognizability as NFI BMS,
2. continuity of shell/navigation,
3. operational information density,
4. clear workflow progress,
5. clear current task,
6. accessible forms,
7. restrained visual treatment,
8. desktop-first responsiveness.

Do not spend time on:

- a brand redesign,
- elaborate animation,
- glossy marketing layouts,
- large decorative dashboard charts,
- mobile-native navigation,
- unrelated dashboard redesign.

Use whitespace deliberately, but do not make the prototype materially more sparse than the current application.

## 20. Accessibility

Use semantic HTML and reasonable accessibility defaults:

- labeled inputs,
- visible keyboard focus,
- button elements for actions,
- sufficient contrast,
- accessible dialog behavior,
- no meaning conveyed by color alone.

## 21. Routing

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

## 22. Netlify Readiness

The repository should include everything required for a standard Netlify static deployment.

Expected build characteristics:

- install: `npm install`
- build: `npm run build`
- publish: `dist`

Add `netlify.toml` with SPA fallback if appropriate.

Do not add environment variables because the prototype should not need any.

## 23. Documentation After Build

Update README with:

- local run instructions,
- build instructions,
- prototype controls,
- Netlify deployment note,
- known limitations.

If you make an implementation decision not covered by this spec, record it briefly in `docs/IMPLEMENTATION_NOTES.md` rather than silently changing the workflow contract.

## 24. Acceptance Criteria

Before declaring the corrected prototype ready:

- `npm install` succeeds.
- `npm run build` succeeds with no TypeScript errors.
- all 12 surfaces are reachable.
- all four journeys in `docs/DEMO_JOURNEYS.md` can be demonstrated.
- the shell is immediately recognizable as NFI BMS.
- the left navigation is present and familiar.
- the Cases page remains Cases, not a replacement My Work page.
- first load contains useful synthetic cases rather than an empty queue.
- prototype controls are visually secondary and unmistakably demo-only.
- role selector changes relevant work/action visibility.
- scenario selector resets to deterministic mock states.
- Social and Financial appear as parallel stages.
- Sponsor remains blocked until both are approved.
- Director revision loop works.
- Panel cannot finalize.
- final Approved and Rejected states are clear.
- synthetic-data disclaimer is always visible but unobtrusive.
- no external API/network integration is required for normal operation.

## 25. Correction Pass Working Method for Codex

This repository may already contain a first-pass prototype whose workflow/state logic is usable but whose visual presentation diverges from the existing NFI BMS.

For the correction pass:

1. Read all source-of-truth docs again.
2. Preserve working mock workflow/state logic where it already satisfies the contract.
3. Refactor the presentation layer rather than rebuilding correct workflow behavior unnecessarily.
4. Rebuild `AppShell` to match the existing NFI BMS shell and navigation.
5. Convert the current `My Work` experience back into a familiar **Cases** page with role-aware enhancements.
6. Move role/scenario controls into secondary prototype-only UI.
7. Seed useful representative synthetic cases for first load.
8. Make Case Detail + Workflow Progress the centerpiece of the redesign.
9. Ensure all workflow pages inherit the same familiar case/application shell.
10. Run all journeys and the production build.
11. Fix all visual/interaction regressions that make the prototype feel like a different application.

Do not ask for workflow clarification unless the repository documents genuinely conflict. Do not invent additional product scope.