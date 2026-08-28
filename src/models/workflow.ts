export type Role = 'Hospital SPOC' | 'Verifier' | 'Medical Reviewer' | 'Social Reviewer' | 'Financial Reviewer' | 'Director' | 'Panel Member';
export type ReviewOutcome = 'not assigned' | 'in progress' | 'approved' | 'rejected' | 'need more information';
export type SponsorState = 'unavailable' | 'ready' | 'draft' | 'pending director' | 'revision requested';
export type DirectorState = 'not ready' | 'pending' | 'approved' | 'rejected' | 'revised';
export type Scenario = 'Normal Approval' | 'Financial Review Pending' | 'Medical Needs More Information' | 'Director Revision' | 'Director Rejection' | 'Approved Case';
export interface Review { outcome: ReviewOutcome; comments: string; assignee: string; }
export interface Case { id: string; caseRef: string; beneficiaryName: string; hospital: string; broadStatus: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'; beneficiaryNumber?: string; verification: 'pending' | 'complete'; medical: Review; social: Review; financial: Review; sponsor: { state: SponsorState; amount: string; notes: string }; director: { state: DirectorState; comments: string; suggestedAmount?: string; date?: string }; panelRecommendation?: string; }
