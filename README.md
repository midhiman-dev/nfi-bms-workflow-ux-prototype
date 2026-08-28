# NFI BMS Workflow UX Prototype

Interactive workflow UX prototype for the **Neonates Foundation India (NFI) Beneficiary Management System**.

This repository exists to validate the final case-management workflow, role responsibilities, information hierarchy, screen behavior and user actions with stakeholders before production UI implementation.

> **Prototype only — synthetic demonstration data.** This repository does not contain production beneficiary data, KYC documents, credentials, secrets, production configuration, or production backend connectivity.

## Purpose

The prototype demonstrates the agreed workflow:

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

The prototype focuses on the workflow-changing screens only. It is not intended to reproduce every feature of the production NFI BMS application.

## Prototype Scope

The interactive prototype covers these 12 surfaces:

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

## Design Principles

- Low-friction interaction for volunteer-heavy operational users.
- Role-focused screens: what needs attention, what action is available, what is blocking the case, and what happens next.
- Progressive disclosure rather than large editable dossiers.
- Medical, Social and Financial Review use a consistent interaction family.
- Social and Financial Review are parallel sibling stages.
- Verifier proposal and Director final approval are clearly separated.
- Panel/Committee information is recommendation/history context only.
- Detailed workflow position is readiness-driven; broad case status alone does not determine the current task.

## Demo Journeys

The prototype is designed around four stakeholder-review journeys:

- **Normal Approval** — Verifier → Medical → Social + Financial → Sponsor Quantification → Director Approve → Approved.
- **Director Revision** — Director returns proposal → Verifier revises/resubmits → Director decides.
- **Blocked Workflow** — one prerequisite review remains pending or requires more information.
- **Director Rejection** — Director rejects → final Rejected state.

See [`docs/DEMO_JOURNEYS.md`](docs/DEMO_JOURNEYS.md).

## Documentation

- [`docs/PROTOTYPE_GUARDRAILS.md`](docs/PROTOTYPE_GUARDRAILS.md) — public repository and synthetic-data guardrails.
- [`docs/UX_BLUEPRINT.md`](docs/UX_BLUEPRINT.md) — screen-by-screen interaction specification.
- [`docs/DEMO_JOURNEYS.md`](docs/DEMO_JOURNEYS.md) — clickable stakeholder-review journeys.
- [`docs/CODEX_MASTER_BUILD_SPEC.md`](docs/CODEX_MASTER_BUILD_SPEC.md) — authoritative build instructions for the coding agent.

## Planned Prototype Stack

- React
- TypeScript
- Vite
- React Router
- Lightweight CSS
- Optional Lucide icons
- Static synthetic data only
- Netlify hosting

There is no backend, database, authentication provider, object storage or external API dependency in this prototype.

## Relationship to the Production System

This prototype is deliberately isolated from the production NFI BMS implementation. It is a UX validation artifact, not a deployable production module and not a source-code fork of the production frontend.

Once stakeholders approve the workflow UX, the approved interaction contract can guide production Angular implementation.

## Public / Portfolio Use

This repository demonstrates the product and architecture process of translating an agreed business workflow into a role-aware interactive UX prototype. All demonstration cases, names, hospitals, amounts and documents must be synthetic.

The NFI name identifies the project context. No license or repository content grants rights to NFI trademarks, branding, confidential information or beneficiary data.

## License

Code in this repository is licensed under the [MIT License](LICENSE).