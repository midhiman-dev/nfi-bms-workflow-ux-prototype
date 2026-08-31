import type { Case, Role } from '../models/workflow';

export type OverviewStage =
  | 'verification'
  | 'medical'
  | 'parallel'
  | 'sponsor'
  | 'director'
  | 'approved'
  | 'rejected';

export interface CurrentStage { title: string; owner: string; next: string; stage: OverviewStage }

export function currentStage(c: Case): CurrentStage {
  if (c.director.state === 'approved') return { title: 'Sponsorship Approved', owner: 'Workflow complete', next: 'The case can now proceed to Settlement & Closure.', stage: 'approved' };
  if (c.director.state === 'rejected') return { title: 'Sponsorship Rejected', owner: 'Workflow complete', next: 'No normal-path workflow action remains for this request.', stage: 'rejected' };
  if (c.sponsor.state === 'revision requested') return { title: 'Revision Requested by Director', owner: 'Verifier', next: 'Update the sponsorship proposal and resubmit it to the Director.', stage: 'sponsor' };
  if (c.director.state === 'pending' || c.sponsor.state === 'pending director') return { title: 'Awaiting Director Approval', owner: 'Director', next: 'The Director will review the Verifier sponsorship proposal.', stage: 'director' };
  if (c.verification === 'pending') return { title: 'Awaiting Initial Verification', owner: 'Verifier', next: 'Verification completion will route the case to Medical Review.', stage: 'verification' };
  if (c.medical.outcome !== 'approved') return { title: 'Awaiting Medical Review', owner: c.medical.assignee, next: 'Medical approval will unlock Social and Financial Review in parallel.', stage: 'medical' };
  if (c.social.outcome !== 'approved' || c.financial.outcome !== 'approved') {
    const owner = c.social.outcome !== 'approved' && c.financial.outcome !== 'approved' ? 'Social & Financial Review teams' : c.social.outcome !== 'approved' ? c.social.assignee : c.financial.assignee;
    return { title: 'Social & Financial Review in Progress', owner, next: 'Sponsor Quantification becomes available after Social and Financial Review are both approved.', stage: 'parallel' };
  }
  return { title: 'Ready for Sponsor Quantification', owner: 'Verifier', next: 'The Verifier can prepare the sponsorship proposal for Director approval.', stage: 'sponsor' };
}

export function overviewGuidance(role: Role, c: Case): { text: string; actionHint?: string } {
  const stage = currentStage(c);
  if (role === 'Hospital SPOC') return { text: `Current Stage: ${stage.title}. No action is currently required from your hospital.` };
  const ownsStage = (role === 'Verifier' && (stage.stage === 'verification' || stage.stage === 'sponsor')) ||
    (role === 'Medical Reviewer' && stage.stage === 'medical') ||
    (role === 'Social Reviewer' && stage.stage === 'parallel' && c.social.outcome !== 'approved') ||
    (role === 'Financial Reviewer' && stage.stage === 'parallel' && c.financial.outcome !== 'approved') ||
    (role === 'Director' && stage.stage === 'director');
  return ownsStage
    ? { text: `Current Stage: ${stage.title}. ${stage.next}`, actionHint: 'Action is required from your selected role.' }
    : { text: `Current Stage: ${stage.title}. ${stage.next}` };
}

export function progressState(c: Case, key: OverviewStage | 'submission'): string {
  const current = currentStage(c).stage;
  if (key === 'submission') return c.verification === 'pending' ? 'completed' : 'completed';
  if (key === 'verification') return c.verification === 'complete' ? 'completed' : 'current';
  if (key === 'medical') return c.medical.outcome === 'approved' ? 'completed' : current === 'medical' ? 'current' : c.medical.outcome === 'need more information' ? 'revision requested' : 'waiting';
  if (key === 'parallel') {
    if (c.social.outcome === 'approved' && c.financial.outcome === 'approved') return 'completed';
    return current === 'parallel' ? 'in progress' : 'waiting';
  }
  if (key === 'sponsor') return c.sponsor.state === 'revision requested' ? 'revision requested' : current === 'sponsor' ? 'current' : ['director', 'approved', 'rejected'].includes(current) ? 'completed' : 'waiting';
  if (key === 'director') return current === 'director' ? 'current' : ['approved', 'rejected'].includes(current) ? 'completed' : 'waiting';
  if (key === 'approved') return current === 'approved' ? 'approved' : current === 'rejected' ? 'rejected' : 'waiting';
  return 'waiting';
}
