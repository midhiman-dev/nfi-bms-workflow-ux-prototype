import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Case, Role } from '../models/workflow';
import { StatusBadge } from './common';
import { actionForRole, canSeeCase, canViewAllCases, needsRoleAction } from '../utils/rbac';
import './MyWorkQueue.css';

type QueueStage = 'Awaiting Verification' | 'Medical Review' | 'Social Review' | 'Financial Review' | 'Sponsor Quantification' | 'Director Approval' | 'Revision Requested' | 'Approved' | 'Rejected';
const queueStages: QueueStage[] = ['Awaiting Verification', 'Medical Review', 'Social Review', 'Financial Review', 'Sponsor Quantification', 'Director Approval', 'Revision Requested', 'Approved', 'Rejected'];

function stageForCase(c: Case): QueueStage {
  if (c.director.state === 'approved') return 'Approved';
  if (c.director.state === 'rejected') return 'Rejected';
  if (c.sponsor.state === 'revision requested') return 'Revision Requested';
  if (c.sponsor.state === 'pending director') return 'Director Approval';
  if (c.sponsor.state === 'ready' || c.sponsor.state === 'draft') return 'Sponsor Quantification';
  if (c.verification === 'pending') return 'Awaiting Verification';
  if (c.medical.outcome !== 'approved') return 'Medical Review';
  if (c.social.outcome !== 'approved') return 'Social Review';
  return 'Financial Review';
}

function stageLabel(stage: QueueStage): string {
  return ({ 'Awaiting Verification': 'Awaiting Verifier Review', 'Medical Review': 'Medical Review', 'Social Review': 'Social Review', 'Financial Review': 'Financial Review', 'Sponsor Quantification': 'Sponsor Quantification', 'Director Approval': 'Pending Director Approval', 'Revision Requested': 'Revision Requested by Director', Approved: 'Approved', Rejected: 'Rejected' })[stage];
}

function checklistProgress(stage: QueueStage): { completed: number; total: number } {
  const total = 24;
  if (stage === 'Approved' || stage === 'Rejected') return { completed: total, total };
  if (stage === 'Awaiting Verification') return { completed: 8, total };
  if (stage === 'Medical Review') return { completed: 9, total };
  if (stage === 'Social Review') return { completed: 18, total };
  if (stage === 'Financial Review') return { completed: 14, total };
  if (stage === 'Sponsor Quantification') return { completed: 16, total };
  if (stage === 'Director Approval') return { completed: 20, total };
  if (stage === 'Revision Requested') return { completed: 12, total };
  return { completed: 0, total };
}

export function MyWorkQueue({ cases, role }: { cases: Case[]; role: Role }) {
  const [view, setView] = useState<'my' | 'all'>('my'); const [search, setSearch] = useState(''); const [stageFilter, setStageFilter] = useState<QueueStage | ''>(''); const [statusFilter, setStatusFilter] = useState<Case['broadStatus'] | ''>(''); const [hospitalFilter, setHospitalFilter] = useState(''); const [page, setPage] = useState(1);
  const canViewAll = canViewAllCases(role);
  useEffect(() => { setView('my'); setSearch(''); setStageFilter(''); setStatusFilter(''); setHospitalFilter(''); setPage(1); }, [role]);
  const roleVisible = useMemo(() => cases.filter(c => canSeeCase(role, c)), [cases, role]);
  const myWork = useMemo(() => role === 'Hospital SPOC' ? roleVisible : roleVisible.filter(c => needsRoleAction(role, c)), [role, roleVisible]);
  const baseRows = view === 'all' && canViewAll ? roleVisible : myWork;
  const hospitals = useMemo(() => [...new Set(roleVisible.map(c => c.hospital))].sort(), [roleVisible]);
  const stageCounts = useMemo(() => Object.fromEntries(queueStages.map(stage => [stage, baseRows.filter(c => stageForCase(c) === stage).length])) as Record<QueueStage, number>, [baseRows]);
  const filtered = useMemo(() => baseRows.filter(c => {
    const q = search.trim().toLowerCase(); const matchesSearch = !q || [c.caseRef, c.beneficiaryNumber || '', c.beneficiaryName, c.hospital].some(value => value.toLowerCase().includes(q));
    return matchesSearch && (!stageFilter || stageForCase(c) === stageFilter) && (!statusFilter || c.broadStatus === statusFilter) && (!hospitalFilter || c.hospital === hospitalFilter);
  }), [baseRows, search, stageFilter, statusFilter, hospitalFilter]);
  const pageSize = 10; const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); const activePage = Math.min(page, pageCount); const pagedRows = filtered.slice((activePage - 1) * pageSize, activePage * pageSize);
  const resetPage = () => setPage(1);
  return <section className="queue cases-queue">
    <div className="queue-search"><label htmlFor="case-search">Search</label><input id="case-search" value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} placeholder="Search by case ref, beneficiary no, baby name, or hospital..." /></div>
    <div className="case-tabs" aria-label="Cases view"><button className={view === 'my' ? 'selected' : ''} onClick={() => { setView('my'); resetPage(); }}>My Work <span>{myWork.length}</span></button>{canViewAll && <button className={view === 'all' ? 'selected' : ''} onClick={() => { setView('all'); resetPage(); }}>All Cases <span>{roleVisible.length}</span></button>}</div>
    <span className="eyebrow">Workflow Stage</span><div className="workflow-filters workflow-stage-chips" aria-label="Workflow stage filter">{queueStages.map(stage => <button key={stage} className={stageFilter === stage ? 'active-filter' : ''} onClick={() => { setStageFilter(stage); resetPage(); }}>{stage} <b>{stageCounts[stage]}</b></button>)}<button className={!stageFilter ? 'active-filter' : ''} onClick={() => { setStageFilter(''); resetPage(); }}>All Stages <b>{baseRows.length}</b></button></div>
    <div className="case-select-filters"><label>Status<select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as Case['broadStatus'] | ''); resetPage(); }}><option value="">All Status</option>{(['Submitted', 'Under Review', 'Approved', 'Rejected'] as const).map(status => <option key={status}>{status}</option>)}</select></label><label>Hospital<select value={hospitalFilter} onChange={e => { setHospitalFilter(e.target.value); resetPage(); }}><option value="">All Hospitals</option>{hospitals.map(hospital => <option key={hospital}>{hospital}</option>)}</select></label></div>
    {pagedRows.length === 0 ? <div className="empty"><strong>No matching cases are available.</strong><p>Adjust the search or filters to view cases visible to your selected role.</p></div> : <div className="cases-table-wrap"><table><thead><tr><th>Case Ref</th><th>Beneficiary No</th><th>Baby Name</th><th>Hospital</th><th>Status</th><th>Workflow Stage</th><th>Checklist</th><th>Last Updated</th><th>Actions</th></tr></thead><tbody>{pagedRows.map((c, index) => { const stage = stageForCase(c); const action = actionForRole(role, c); const checklist = checklistProgress(stage); const percentage = Math.round((checklist.completed / checklist.total) * 100); const path = action.path ? `/cases/${c.id}/${action.path}` : `/cases/${c.id}`; return <tr key={c.id}><td className="case-ref"><strong>{c.caseRef}</strong></td><td>{c.beneficiaryNumber || '—'}</td><td className="baby-name">Baby of<br/><strong>{c.beneficiaryName.replace(/^Baby /, '')}</strong></td><td className="hospital-name"><strong>{c.hospital}</strong><small>BRP · Beneficiary Review Panel</small></td><td><StatusBadge tone={c.broadStatus.toLowerCase()}>{c.broadStatus}</StatusBadge></td><td><span className={`stage-cell ${stage.toLowerCase().replaceAll(' ', '-')}`}><i aria-hidden="true" />{stageLabel(stage)}</span></td><td><span className="checklist-meter"><i style={{ width: `${percentage}%` }} /></span><span className="progress-text">{checklist.completed}/{checklist.total} ({percentage}%)</span></td><td>{`${String(28 - index).padStart(2, '0')}-08-2026`}</td><td><Link className="row-action" to={path}>{action.label}</Link></td></tr>; })}</tbody></table></div>}
    {filtered.length > 0 && <div className="pagination"><span>Showing {(activePage - 1) * pageSize + 1} to {Math.min(activePage * pageSize, filtered.length)} of {filtered.length} cases</span><div><button aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage(activePage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index + 1} className={activePage === index + 1 ? 'selected' : ''} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button aria-label="Next page" disabled={activePage === pageCount} onClick={() => setPage(activePage + 1)}>›</button></div></div>}
  </section>;
}
