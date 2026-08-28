import type { Case, Role } from '../models/workflow';

export type WorkflowScreen =
  | 'detail'
  | 'verification'
  | 'medical-review'
  | 'social-review'
  | 'financial-review'
  | 'sponsor-quantification'
  | 'revision'
  | 'director-approval'
  | 'panel'
  | 'approved'
  | 'rejected';

export const DEMO_HOSPITAL = 'Sunrise Children’s Hospital (Demo)';

export function canSeeCase(role: Role, c: Case): boolean {
  switch (role) {
    case 'Hospital SPOC':
      return c.hospital === DEMO_HOSPITAL;
    case 'Verifier':
      return true;
    case 'Medical Reviewer':
      return c.verification === 'complete' && c.medical.outcome !== 'approved';
    case 'Social Reviewer':
      return c.medical.outcome === 'approved' && c.social.outcome !== 'approved';
    case 'Financial Reviewer':
      return c.medical.outcome === 'approved' && c.financial.outcome !== 'approved';
    case 'Director':
      return ['pending', 'approved', 'rejected', 'revised'].includes(c.director.state);
    case 'Panel Member':
      return Boolean(c.panelRecommendation);
  }
}

export function needsRoleAction(role: Role, c: Case): boolean {
  if (!canSeeCase(role, c)) return false;
  switch (role) {
    case 'Hospital SPOC':
      return false;
    case 'Verifier':
      return c.verification === 'pending' || ['ready', 'draft', 'revision requested'].includes(c.sponsor.state);
    case 'Medical Reviewer':
      return ['not assigned', 'in progress', 'need more information'].includes(c.medical.outcome);
    case 'Social Reviewer':
      return c.medical.outcome === 'approved' && ['in progress', 'need more information'].includes(c.social.outcome);
    case 'Financial Reviewer':
      return c.medical.outcome === 'approved' && ['in progress', 'need more information'].includes(c.financial.outcome);
    case 'Director':
      return c.director.state === 'pending';
    case 'Panel Member':
      return Boolean(c.panelRecommendation) && c.director.state !== 'approved' && c.director.state !== 'rejected';
  }
}

export function canViewAllCases(role: Role): boolean {
  return role === 'Verifier';
}

export function taskLabelForRole(role: Role, c: Case): string | undefined {
  if (role === 'Hospital SPOC' && canSeeCase(role, c)) return c.verification === 'pending' ? 'Submitted — Awaiting Verification' : c.broadStatus;
  if (!needsRoleAction(role, c)) return undefined;
  switch (role) {
    case 'Hospital SPOC': return undefined;
    case 'Verifier':
      if (c.verification === 'pending') return 'Awaiting Initial Verification';
      if (c.sponsor.state === 'revision requested') return 'Revision Requested by Director';
      return 'Ready for Sponsor Quantification';
    case 'Medical Reviewer': return 'Awaiting Medical Review';
    case 'Social Reviewer': return 'Awaiting Social Review';
    case 'Financial Reviewer': return 'Awaiting Financial Review';
    case 'Director': return 'Pending Sponsorship Approval';
    case 'Panel Member': return 'Panel / Committee Recommendation';
  }
}

export function actionForRole(role: Role, c: Case): { label: string; path: string } {
  if (role === 'Verifier') {
    if (c.verification === 'pending') return { label: 'Verification', path: 'verification' };
    if (c.sponsor.state === 'revision requested') return { label: 'Revise Proposal', path: 'revision' };
    if (c.sponsor.state === 'ready' || c.sponsor.state === 'draft') return { label: 'Quantify', path: 'sponsor-quantification' };
  }
  if (role === 'Medical Reviewer' && needsRoleAction(role, c)) return { label: 'Medical Review', path: 'medical-review' };
  if (role === 'Social Reviewer' && needsRoleAction(role, c)) return { label: 'Social Review', path: 'social-review' };
  if (role === 'Financial Reviewer' && needsRoleAction(role, c)) return { label: 'Financial Review', path: 'financial-review' };
  if (role === 'Director' && c.director.state === 'pending') return { label: 'Review', path: 'director-approval' };
  if (role === 'Panel Member' && canSeeCase(role, c)) return { label: 'Recommendation', path: 'panel' };
  return { label: 'View', path: '' };
}

export function canOpenScreen(role: Role, c: Case, screen: WorkflowScreen): boolean {
  if (!canSeeCase(role, c)) return false;
  if (screen === 'detail') return true;
  if (screen === 'approved') return c.director.state === 'approved' && c.broadStatus === 'Approved';
  if (screen === 'rejected') return c.director.state === 'rejected' && c.broadStatus === 'Rejected';
  switch (screen) {
    case 'verification': return role === 'Verifier';
    case 'medical-review': return role === 'Medical Reviewer';
    case 'social-review': return role === 'Social Reviewer';
    case 'financial-review': return role === 'Financial Reviewer';
    case 'sponsor-quantification': return role === 'Verifier';
    case 'revision': return role === 'Verifier';
    case 'director-approval': return role === 'Director' && c.director.state === 'pending';
    case 'panel': return role === 'Panel Member';
    default: return false;
  }
}

export function visibleCaseNavigation(role: Role, c: Case): Array<{ label: string; path: string }> {
  const items: Array<{ label: string; path: string; screen: WorkflowScreen }> = [
    { label: 'Initial Verification', path: 'verification', screen: 'verification' },
    { label: 'Medical Review', path: 'medical-review', screen: 'medical-review' },
    { label: 'Social Review', path: 'social-review', screen: 'social-review' },
    { label: 'Financial Review', path: 'financial-review', screen: 'financial-review' },
    { label: 'Sponsor Quantification', path: 'sponsor-quantification', screen: 'sponsor-quantification' },
    { label: 'Director Approval', path: 'director-approval', screen: 'director-approval' },
    { label: 'Panel / Committee', path: 'panel', screen: 'panel' },
  ];
  return items.filter(item => canOpenScreen(role, c, item.screen)).map(({ label, path }) => ({ label, path }));
}

export function sidebarItems(role: Role): Array<{ label: string; path: string; icon: string }> {
  const common = [
    { label: 'Dashboard', path: '/dashboard', icon: '▦' },
    { label: 'Cases', path: '/cases', icon: '▤' },
  ];
  if (role === 'Hospital SPOC') return [...common, { label: 'New Case', path: '/new-case', icon: '＋' }];
  if (role === 'Verifier' || role === 'Director') return [...common, { label: 'Reports', path: '/reports', icon: '▥' }];
  return common;
}
