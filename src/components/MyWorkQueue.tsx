import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Case, Role } from '../models/workflow';
import { StatusBadge } from './common';
import { actionForRole, canSeeCase, canViewAllCases, needsRoleAction, taskLabelForRole } from '../utils/rbac';

function generalTask(c: Case): string {
  if (c.director.state === 'approved') return 'Approved';
  if (c.director.state === 'rejected') return 'Rejected';
  if (c.sponsor.state === 'revision requested') return 'Revision Requested by Director';
  if (c.sponsor.state === 'pending director') return 'Awaiting Director Approval';
  if (c.sponsor.state === 'ready' || c.sponsor.state === 'draft') return 'Ready for Sponsor Quantification';
  if (c.verification === 'pending') return 'Awaiting Initial Verification';
  if (c.medical.outcome === 'not assigned' || c.medical.outcome === 'need more information' || c.medical.outcome === 'in progress') return 'Awaiting Medical Review';
  if (c.social.outcome !== 'approved' && c.financial.outcome !== 'approved') return 'Social & Financial Review in Progress';
  if (c.social.outcome !== 'approved') return 'Awaiting Social Review';
  if (c.financial.outcome !== 'approved') return 'Awaiting Financial Review';
  return 'Under Review';
}

const progress = (c: Case) => [
  c.verification === 'complete',
  c.medical.outcome === 'approved',
  c.social.outcome === 'approved',
  c.financial.outcome === 'approved',
].filter(Boolean).length;

export function MyWorkQueue({ cases, role }: { cases: Case[]; role: Role }) {
  const [view, setView] = useState<'my' | 'all'>('my');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  useEffect(() => {
    setView('my');
    setSearch('');
    setStageFilter('');
  }, [role]);

  const roleVisible = useMemo(() => cases.filter(c => canSeeCase(role, c)), [cases, role]);
  const actionable = useMemo(() => roleVisible.filter(c => needsRoleAction(role, c)), [roleVisible, role]);
  const myWork = role === 'Hospital SPOC' ? roleVisible : actionable;
  const baseRows = view === 'all' && canViewAllCases(role) ? roleVisible : myWork;

  const stageOptions = useMemo(() => {
    const source = view === 'all' && canViewAllCases(role) ? roleVisible : myWork;
    return [...new Set(source.map(c => taskLabelForRole(role, c) || generalTask(c)))];
  }, [view, roleVisible, myWork, role]);

  const filtered = baseRows.filter(c => {
    const q = search.trim().toLowerCase();
    const label = taskLabelForRole(role, c) || generalTask(c);
    const matchesSearch = !q || [c.caseRef, c.beneficiaryName, c.hospital, c.broadStatus, label].some(v => v.toLowerCase().includes(q));
    const matchesStage = !stageFilter || label === stageFilter;
    return matchesSearch && matchesStage;
  });

  const countLabel = role === 'Hospital SPOC' ? `${roleVisible.length} case${roleVisible.length === 1 ? '' : 's'} for my hospital` : `${actionable.length} requiring my action`;

  return <section className="queue">
    <div className="case-tabs">
      <button className={view === 'my' ? 'selected' : ''} onClick={() => setView('my')}>{role === 'Hospital SPOC' ? 'My Hospital Cases' : 'My Work'} <span>{myWork.length}</span></button>
      {canViewAllCases(role) && <button className={view === 'all' ? 'selected' : ''} onClick={() => setView('all')}>All Cases <span>{roleVisible.length}</span></button>}
    </div>

    <div className="queue-toolbar">
      <input aria-label="Search cases" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by case ref, beneficiary or hospital" />
      <div className="chips">
        <StatusBadge tone="current">{role}</StatusBadge>
        <StatusBadge>{countLabel}</StatusBadge>
      </div>
    </div>

    {stageOptions.length > 0 && <div className="workflow-filters">
      <button className={!stageFilter ? 'active-filter' : ''} onClick={() => setStageFilter('')}>All work</button>
      {stageOptions.map(stage => <button key={stage} className={stageFilter === stage ? 'active-filter' : ''} onClick={() => setStageFilter(stage)}>{stage}</button>)}
    </div>}

    {filtered.length === 0 ? <div className="empty">
      <strong>{role === 'Hospital SPOC' ? 'No cases are available for this hospital in the selected demo scenario.' : `No cases require action for ${role}`}</strong>
      <p>{canViewAllCases(role) ? 'Switch to All Cases to review cases outside your current work queue.' : 'Choose another demo scenario to see a different role-specific work state.'}</p>
    </div> : <table>
      <thead><tr><th>Case Ref</th><th>Beneficiary / Baby Name</th><th>Hospital</th><th>Status</th><th>Detailed Workflow Stage</th><th>Checklist</th><th>Last Updated</th><th>Action</th></tr></thead>
      <tbody>{filtered.map((c, index) => {
        const workLabel = taskLabelForRole(role, c) || generalTask(c);
        const action = actionForRole(role, c);
        const path = action.path ? `/cases/${c.id}/${action.path}` : `/cases/${c.id}`;
        return <tr key={c.id}>
          <td><strong>{c.caseRef}</strong></td>
          <td>{c.beneficiaryName}</td>
          <td>{c.hospital}</td>
          <td><StatusBadge tone={c.broadStatus.toLowerCase()}>{c.broadStatus}</StatusBadge></td>
          <td><StatusBadge tone={needsRoleAction(role, c) ? 'current' : 'neutral'}>{workLabel}</StatusBadge></td>
          <td><span className="progress-text">{progress(c)}/4 complete</span></td>
          <td>{index < 2 ? 'Today' : '27 Aug 2026'}</td>
          <td><Link className="text-action" to={path}>{action.label}</Link></td>
        </tr>;
      })}</tbody>
    </table>}
  </section>;
}
