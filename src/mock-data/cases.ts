import type { Case, Scenario } from '../models/workflow';

const review = (outcome: Case['medical']['outcome'], assignee: string, comments = '') => ({ outcome, assignee, comments });

const base = (id: string, beneficiaryName: string, hospital: string): Case => ({
  id,
  caseRef: id,
  beneficiaryName,
  hospital,
  broadStatus: 'Under Review',
  verification: 'complete',
  medical: review('approved', 'Dr. N. Shah', 'Medical eligibility confirmed.'),
  social: review('approved', 'R. Das', 'Home situation reviewed.'),
  financial: review('approved', 'K. Iyer', 'Financial need established.'),
  sponsor: { state: 'ready', amount: '₹ 1,25,000', notes: 'Proposed based on demonstrated need and treatment estimate.' },
  director: { state: 'not ready', comments: '' },
});

export const scenarioCases = (scenario: Scenario): Case[] => {
  const normal = base('DEMO-NFI-001', 'Baby Aarav Demo', 'Sunrise Children’s Hospital (Demo)');
  normal.broadStatus = 'Submitted';
  normal.verification = 'pending';
  normal.medical = review('not assigned', 'Medical Review Team');
  normal.social = review('not assigned', 'Social Review Team');
  normal.financial = review('not assigned', 'Financial Review Team');
  normal.sponsor = { state: 'unavailable', amount: '', notes: '' };

  const medical = base('DEMO-NFI-005', 'Baby Diya Demo', 'Willow Care Hospital (Demo)');
  medical.medical = review('need more information', 'Dr. N. Shah', 'Please provide the updated treatment estimate.');
  medical.social = review('not assigned', 'Social Review Team');
  medical.financial = review('not assigned', 'Financial Review Team');
  medical.sponsor = { state: 'unavailable', amount: '', notes: '' };

  const social = base('DEMO-NFI-009', 'Baby Ishaan Demo', 'Lotus Children’s Hospital (Demo)');
  social.social = review('in progress', 'R. Das');
  social.financial = review('approved', 'K. Iyer', 'Financial need established.');
  social.sponsor = { state: 'unavailable', amount: '', notes: '' };

  const financial = base('DEMO-NFI-003', 'Baby Kabir Demo', 'Greenfield Hospital (Demo)');
  financial.financial = review('in progress', 'K. Iyer');
  financial.sponsor = { state: 'unavailable', amount: '', notes: '' };

  const ready = base('DEMO-NFI-004', 'Baby Aria Demo', 'Riverside Children’s Hospital (Demo)');
  ready.panelRecommendation = 'Panel recommends support within the proposed amount.';

  const revision = base('DEMO-NFI-002', 'Baby Meera Demo', 'Hope Neonatal Centre (Demo)');
  revision.sponsor.state = 'revision requested';
  revision.director = { state: 'revised', comments: 'Please revise the proposed amount based on the updated treatment estimate.', suggestedAmount: '₹ 1,10,000', date: '28 Aug 2026' };
  revision.panelRecommendation = 'Panel recommends support, subject to the revised treatment estimate.';

  const pendingDirector = base('DEMO-NFI-007', 'Baby Vihaan Demo', 'City Children’s Hospital (Demo)');
  pendingDirector.sponsor.state = 'pending director';
  pendingDirector.director = { state: 'pending', comments: '' };
  pendingDirector.panelRecommendation = 'Panel recommends sponsorship within the proposed amount.';

  const rejected = base('DEMO-NFI-008', 'Baby Tara Demo', 'CarePoint Hospital (Demo)');
  rejected.broadStatus = 'Rejected';
  rejected.sponsor.state = 'pending director';
  rejected.director = { state: 'rejected', comments: 'The current request does not meet the synthetic demo eligibility criteria.', date: '27 Aug 2026' };

  const approved = base('DEMO-NFI-006', 'Baby Zoya Demo', 'Harmony Children’s Hospital (Demo)');
  approved.broadStatus = 'Approved';
  approved.beneficiaryNumber = 'DEMO-BEN-6201';
  approved.sponsor.state = 'pending director';
  approved.director = { state: 'approved', comments: 'Sponsorship approved for the proposed amount.', date: '28 Aug 2026' };

  [normal, medical, social, financial, ready, revision, pendingDirector, rejected, approved].forEach((c, index) => {
    c.beneficiaryNumber ||= `DEMO-BEN-${String(25001 + index)}`;
  });

  const all = [normal, medical, social, financial, ready, revision, pendingDirector, rejected, approved];
  switch (scenario) {
    case 'Normal Approval': return all;
    case 'Financial Review Pending': return [financial, social, normal, medical, ready, pendingDirector, revision, rejected, approved];
    case 'Medical Needs More Information': return [medical, normal, social, financial, ready, pendingDirector, revision, rejected, approved];
    case 'Director Revision': return [revision, ready, pendingDirector, financial, social, medical, normal, rejected, approved];
    case 'Director Rejection': return [rejected, pendingDirector, revision, ready, financial, social, medical, normal, approved];
    case 'Approved Case': return [approved, pendingDirector, revision, ready, financial, social, medical, normal, rejected];
  }
};
