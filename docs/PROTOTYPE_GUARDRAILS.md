# Prototype Guardrails

## 1. Purpose

These guardrails keep the public NFI BMS workflow UX prototype safely separated from the production system and prevent prototype work from silently changing the agreed workflow.

## 2. Public Repository Safety

The repository must contain only synthetic demonstration data.

Never add:

- real beneficiary names or identifying details,
- Aadhaar/KYC documents or screenshots,
- real phone numbers, addresses or hospital submissions,
- production database exports,
- production API endpoints or secrets,
- Azure credentials, storage keys or connection strings,
- environment files containing real configuration,
- internal NFI credentials,
- production logs containing beneficiary information.

All sample names, hospitals, dates, amounts and documents must be fictional and obviously demonstrative.

A persistent UI footer or equivalent visible label should state:

> Prototype — Synthetic demonstration data only

## 3. Product Boundary

This repository is a UX validation artifact, not the production frontend.

It must not:

- connect to the NFI production/UAT backend,
- implement real authentication,
- implement a real database,
- upload or retrieve real documents,
- duplicate production secrets/configuration,
- become an alternate production implementation.

Prototype state may live entirely in static TypeScript/JSON objects and in-memory React state.

## 4. Frozen Workflow

The prototype must represent this workflow without reinterpretation:

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
        ↓
Settlement & Closure
```

Rules that must not change during prototype construction:

- Verifier acts at Initial Verification and later Sponsor Quantification.
- Medical approval gates Social and Financial Review.
- Social and Financial are parallel siblings.
- Both Social and Financial must be approved before Sponsor Quantification.
- Verifier proposes the sponsorship amount but cannot finally approve it.
- Director is the sole normal-path final sponsorship authority.
- Director outcomes are Approve, Reject and Revise.
- Revise returns the proposal to Verifier and leaves the case under review.
- Panel/Committee is recommendation/history context only.

## 5. Role Guardrails

Prototype roles:

- Hospital SPOC
- Verifier
- Medical Reviewer
- Social Reviewer
- Financial Reviewer
- Director
- Panel / Committee Member

Admin/Leadership may be represented only if needed for oversight demonstration, but must never inherit Director final-approval actions merely for convenience.

## 6. UX Guardrails

The prototype should optimize for stakeholder validation, not visual experimentation.

Required principles:

- role-focused My Work views,
- clear current stage and next action,
- concise blocker guidance,
- progressive disclosure,
- consistent Medical/Social/Financial review pattern,
- explicit Social/Financial parallelism,
- final-action confirmation,
- hidden irrelevant actions by default,
- no frontend-invented workflow states.

## 7. Scope Guardrails

Prototype the changed workflow surfaces only.

Do not expand into:

- a full dashboard redesign,
- reports redesign,
- finance module redesign,
- admin/master-data redesign,
- new notifications,
- mobile-native UX,
- new workflow roles/stages,
- generic workflow-engine concepts,
- production RBAC implementation,
- document OCR/AI features.

## 8. Build Guardrails

Preferred implementation:

- React + TypeScript + Vite,
- React Router,
- lightweight CSS,
- optional Lucide icons,
- no backend,
- no database,
- no external API calls,
- no paid UI library,
- no paid hosting dependency.

The prototype should remain simple enough to deploy as a static site on Netlify.

## 9. Change Control

If a stakeholder request changes role ownership, stage sequence, approval authority, or required workflow behavior, do not silently implement it in the prototype.

Record it as feedback requiring product/architecture review first.

Cosmetic changes, wording improvements and layout refinements may be made without reopening the workflow contract.