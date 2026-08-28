import { useState, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { Case, Role, Scenario } from '../models/workflow';
import { scenarioCases } from '../mock-data/cases';
import { Banner, ConfirmationDialog, StatusBadge } from '../components/common';
import { CaseLayout, ReviewStageShell } from '../components/CaseLayout';
import { MyWorkQueue } from '../components/MyWorkQueue';
import { AppShell } from '../components/AppShell';
import { actionForRole, canOpenScreen, canSeeCase, needsRoleAction, visibleCaseNavigation, type WorkflowScreen } from '../utils/rbac';

export function App() {
  const [role, setRole] = useState<Role>('Verifier');
  const [scenario, setScenario] = useState<Scenario>('Normal Approval');
  const [cases, setCases] = useState<Case[]>(scenarioCases('Normal Approval'));
  const reset = (s: Scenario) => { setScenario(s); setCases(scenarioCases(s)); };
  const update = (id: string, fn: (c: Case) => Case) => setCases(all => all.map(c => c.id === id ? fn(c) : c));

  return <AppShell role={role} scenario={scenario} onRoleChange={setRole} onScenarioChange={reset}>
    <main><Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard cases={cases} role={role} />} />
      <Route path="/new-case" element={role === 'Hospital SPOC' ? <PrototypePage title="New Case" text="The production intake form is outside FGR-2 redesign scope. This working placeholder preserves the existing navigation path for the Hospital SPOC demo." /> : <AccessDenied />} />
      <Route path="/reports" element={role === 'Verifier' || role === 'Director' ? <PrototypePage title="Reports" text="Reporting is outside the FGR-2 redesign scope. This placeholder keeps the existing navigation path functional during stakeholder review." /> : <AccessDenied />} />
      <Route path="/cases" element={<CasesPage cases={cases} role={role} />} />
      <Route path="/cases/:id/*" element={<Workspace cases={cases} role={role} update={update} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></main>
  </AppShell>;
}

function Dashboard({ cases, role }: { cases: Case[]; role: Role }) {
  const visible = cases.filter(c => canSeeCase(role, c));
  const work = visible.filter(c => needsRoleAction(role, c));
  const approved = visible.filter(c => c.broadStatus === 'Approved').length;
  const underReview = visible.filter(c => c.broadStatus === 'Under Review' || c.broadStatus === 'Submitted').length;
  return <>
    <section className="dashboard-hero"><div><h1>Dashboard</h1><h2>Welcome back, {role}</h2><p>Track queues, recent updates, and workflow movement from one place.</p></div><div className="actions"><Link className="secondary button-link" to="/cases">Open Cases</Link>{role === 'Hospital SPOC' && <Link className="primary button-link" to="/new-case">New Case</Link>}</div></section>
    <h3 className="section-title">My Queue</h3>
    <section className="dashboard-cards"><article className="metric-card"><strong>{work.length}</strong><span>Requiring My Action</span></article><article className="metric-card"><strong>{underReview}</strong><span>In Workflow</span></article><article className="metric-card success-card"><strong>{approved}</strong><span>Approved</span></article></section>
    <section className="card"><div className="screen-head"><div><h3>Recent Cases</h3><p>Latest synthetic cases visible to your selected role.</p></div><Link className="text-action" to="/cases">View all</Link></div>{visible.slice(0, 5).map(c => <div className="recent-case" key={c.id}><Link to={`/cases/${c.id}`}>{c.caseRef}</Link><span>{c.beneficiaryName} | {c.hospital}</span><StatusBadge tone={c.broadStatus.toLowerCase()}>{c.broadStatus}</StatusBadge></div>)}</section>
  </>;
}

function PrototypePage({ title, text }: { title: string; text: string }) {
  return <><div className="page-title"><div><h1>{title}</h1><p>{text}</p></div></div><section className="card"><Banner>This screen is intentionally not redesigned in the FGR workflow prototype.</Banner><Link className="text-action" to="/cases">Back to Cases</Link></section></>;
}

function CasesPage({ cases, role }: { cases: Case[]; role: Role }) {
  return <><div className="page-title"><div><h1>Cases</h1><p>Search, filter, and open cases relevant to your role.</p></div>{role === 'Hospital SPOC' && <Link className="primary button-link" to="/new-case">New Case</Link>}</div><MyWorkQueue cases={cases} role={role} /></>;
}

function Workspace({ cases, role, update }: { cases: Case[]; role: Role; update: (id: string, fn: (c: Case) => Case) => void }) {
  const { id } = useParams();
  const c = cases.find(x => x.id === id);
  if (!c) return <Navigate to="/cases" />;
  if (!canSeeCase(role, c)) return <AccessDenied />;
  return <Routes>
    <Route index element={<Detail c={c} role={role} />} />
    <Route path="verification" element={<ScreenGuard role={role} c={c} screen="verification"><Verification c={c} update={update} /></ScreenGuard>} />
    <Route path="medical-review" element={<ScreenGuard role={role} c={c} screen="medical-review"><Review c={c} type="medical" update={update} /></ScreenGuard>} />
    <Route path="social-review" element={<ScreenGuard role={role} c={c} screen="social-review"><Review c={c} type="social" update={update} /></ScreenGuard>} />
    <Route path="financial-review" element={<ScreenGuard role={role} c={c} screen="financial-review"><Review c={c} type="financial" update={update} /></ScreenGuard>} />
    <Route path="sponsor-quantification" element={<ScreenGuard role={role} c={c} screen="sponsor-quantification"><Quantification c={c} update={update} /></ScreenGuard>} />
    <Route path="revision" element={<ScreenGuard role={role} c={c} screen="revision"><Revision c={c} update={update} /></ScreenGuard>} />
    <Route path="director-approval" element={<ScreenGuard role={role} c={c} screen="director-approval"><Director c={c} update={update} /></ScreenGuard>} />
    <Route path="panel" element={<ScreenGuard role={role} c={c} screen="panel"><Panel c={c} update={update} /></ScreenGuard>} />
    <Route path="approved" element={<ScreenGuard role={role} c={c} screen="approved"><Final c={c} approved /></ScreenGuard>} />
    <Route path="rejected" element={<ScreenGuard role={role} c={c} screen="rejected"><Final c={c} approved={false} /></ScreenGuard>} />
  </Routes>;
}

function ScreenGuard({ role, c, screen, children }: { role: Role; c: Case; screen: WorkflowScreen; children: ReactNode }) {
  return canOpenScreen(role, c, screen) ? <>{children}</> : <AccessDenied />;
}

function AccessDenied() {
  return <section className="card access-denied"><span className="eyebrow">Role-based access</span><h2>Access restricted</h2><p>The selected demo role is not authorized to use this workflow screen.</p><Link className="primary button-link" to="/cases">Back to Cases</Link></section>;
}

function Detail({ c, role }: { c: Case; role: Role }) {
  const nav = useNavigate();
  const current = c.director.state === 'approved' ? 'Approved' : c.director.state === 'rejected' ? 'Rejected' : c.sponsor.state === 'revision requested' ? 'Revision Requested by Director' : c.sponsor.state === 'pending director' ? 'Awaiting Director Approval' : c.sponsor.state === 'ready' || c.sponsor.state === 'draft' ? 'Ready for Sponsor Quantification' : c.medical.outcome === 'not assigned' || c.medical.outcome === 'need more information' || c.medical.outcome === 'in progress' ? 'Awaiting Medical Review' : c.social.outcome !== 'approved' && c.financial.outcome !== 'approved' ? 'Social & Financial Review in Progress' : c.social.outcome !== 'approved' ? 'Awaiting Social Review' : c.financial.outcome !== 'approved' ? 'Awaiting Financial Review' : c.verification === 'pending' ? 'Awaiting Initial Verification' : 'Under Review';
  const action = actionForRole(role, c);
  const navigation = visibleCaseNavigation(role, c);
  return <CaseLayout c={c}>
    <section className="card current-card"><span className="eyebrow">Current stage</span><h2>{current}</h2><p>{c.sponsor.state === 'unavailable' ? 'Sponsor Quantification becomes available after Social and Financial Review are both approved.' : needsRoleAction(role, c) ? 'This case currently requires action from your selected role.' : 'No action is required from your selected role at this stage.'}</p>{action.path && needsRoleAction(role, c) && <button className="primary" onClick={() => nav(action.path)}>{action.label}</button>}</section>
    <section className="grid"><article className="card"><h3>Case summary</h3><p>Demonstration treatment request with synthetic supporting context.</p><p><strong>Medical:</strong> {c.medical.outcome}<br/><strong>Social:</strong> {c.social.outcome}<br/><strong>Financial:</strong> {c.financial.outcome}</p></article><article className="card"><h3>Available workflow areas for {role}</h3>{navigation.length ? <div className="nav-links">{navigation.map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}</div> : <p className="muted">No internal workflow screens are available to this role.</p>}</article></section>
  </CaseLayout>;
}

function Verification({ c, update }: { c: Case; update: (id: string, fn: (c: Case) => Case) => void }) {
  const nav = useNavigate();
  return <CaseLayout c={c}><section className="screen-head"><div><span className="eyebrow">Verifier task</span><h2>Initial Verification</h2><p>Confirm submission readiness before Medical Review.</p></div><StatusBadge tone={c.verification === 'complete' ? 'approved' : 'current'}>{c.verification === 'complete' ? 'Completed' : 'Action required'}</StatusBadge></section><section className="grid"><article className="card"><h3>Readiness checklist</h3><ul><li>Hospital submission received</li><li>Consent and core documents present</li><li>Identity details verified for demonstration</li></ul></article><article className="card"><label>Observations<textarea placeholder="Add verification observations" /></label></article></section>{c.verification === 'pending' ? <button className="primary" onClick={() => { update(c.id, x => ({ ...x, broadStatus: 'Under Review', verification: 'complete', medical: { ...x.medical, outcome: 'in progress' } })); nav('..'); }}>Complete Verification</button> : <Banner type="success">Verification complete. Medical Review is now the next stage.</Banner>}</CaseLayout>;
}

function Review({ c, type, update }: { c: Case; type: 'medical' | 'social' | 'financial'; update: (id: string, fn: (c: Case) => Case) => void }) {
  const r = c[type];
  const title = `${type[0].toUpperCase() + type.slice(1)} Review`;
  const [comments, setComments] = useState(r.comments);
  const blocked = (type === 'social' || type === 'financial') && c.medical.outcome !== 'approved';
  const submit = (outcome: 'approved' | 'rejected' | 'need more information') => update(c.id, x => {
    const next = { ...x, [type]: { ...x[type], outcome, comments } } as Case;
    if (type === 'medical' && outcome === 'approved') return { ...next, social: { ...x.social, outcome: 'in progress' }, financial: { ...x.financial, outcome: 'in progress' } };
    if (type === 'medical' && outcome !== 'approved') return { ...next, social: { ...x.social, outcome: 'not assigned' }, financial: { ...x.financial, outcome: 'not assigned' }, sponsor: { ...x.sponsor, state: 'unavailable' } };
    if (next.social.outcome === 'approved' && next.financial.outcome === 'approved') return { ...next, sponsor: { ...next.sponsor, state: 'ready' } };
    return { ...next, sponsor: { ...next.sponsor, state: 'unavailable' } };
  });
  return <ReviewStageShell title={title} c={c} kind={type}>{blocked ? <Banner type="warning">{title} is unavailable until Medical Review is approved.</Banner> : <><section className="grid"><article className="card"><h3>{type === 'medical' ? 'Clinical summary' : type === 'social' ? 'Social context' : 'Financial context'}</h3><p>Synthetic demonstration summary and supporting documents are shown here for stakeholder review.</p></article><article className="card"><h3>Decision</h3><label>Mandatory comments<textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Enter review comments" /></label></article></section>{r.outcome === 'approved' ? <Banner type="success">{type === 'medical' ? 'Medical Review approved. Social and Financial Review can now proceed in parallel.' : `${title} is complete. ${type === 'social' ? 'Financial' : 'Social'} Review remains an independent parallel review.`}</Banner> : <div className="actions"><button className="primary" disabled={!comments.trim()} onClick={() => submit('approved')}>Approve</button><button className="secondary" disabled={!comments.trim()} onClick={() => submit('need more information')}>Need More Information</button><button className="danger" disabled={!comments.trim()} onClick={() => submit('rejected')}>Reject</button></div>}</>}</ReviewStageShell>;
}

function Quantification({ c, update }: { c: Case; update: (id: string, fn: (c: Case) => Case) => void }) {
  const nav = useNavigate(); const [amount, setAmount] = useState(c.sponsor.amount); const [notes, setNotes] = useState(c.sponsor.notes); const [confirm, setConfirm] = useState(false); const ready = c.sponsor.state === 'ready' || c.sponsor.state === 'draft';
  return <CaseLayout c={c}><section className="screen-head"><div><span className="eyebrow">Verifier task</span><h2>Sponsor Amount Quantification</h2><p>Propose a sponsorship amount; final approval belongs to the Director.</p></div></section>{!ready ? <Banner type="warning">Sponsor Quantification becomes available after Social and Financial Review are both approved.</Banner> : <><section className="grid"><article className="card"><h3>Prerequisite reviews</h3><p>Medical: {c.medical.outcome}<br/>Social: {c.social.outcome}<br/>Financial: {c.financial.outcome}</p></article><article className="card"><label>Proposed sponsorship amount<input value={amount} onChange={e => setAmount(e.target.value)} /></label><label>Quantification justification<textarea value={notes} onChange={e => setNotes(e.target.value)} /></label></article></section><div className="actions"><button className="secondary" onClick={() => update(c.id, x => ({ ...x, sponsor: { ...x.sponsor, state: 'draft', amount, notes } }))}>Save Draft</button><button className="primary" disabled={!amount || !notes} onClick={() => setConfirm(true)}>Submit to Director</button></div></>}<ConfirmationDialog open={confirm} title="Submit sponsorship proposal" message="Submit this sponsorship proposal to the Director for final decision?" onCancel={() => setConfirm(false)} onConfirm={() => { update(c.id, x => ({ ...x, sponsor: { ...x.sponsor, state: 'pending director', amount, notes }, director: { ...x.director, state: 'pending' } })); setConfirm(false); nav('..'); }} /></CaseLayout>;
}

function Revision({ c, update }: { c: Case; update: (id: string, fn: (c: Case) => Case) => void }) {
  const nav = useNavigate(); const [amount, setAmount] = useState(c.sponsor.amount); const [notes, setNotes] = useState(c.sponsor.notes); const [confirm, setConfirm] = useState(false); const [saved, setSaved] = useState(false);
  return <CaseLayout c={c}><section className="screen-head"><div><span className="eyebrow">Verifier task</span><h2>Revision Requested by Director</h2></div><StatusBadge tone="revision-requested">Revision requested</StatusBadge></section><Banner type="warning"><strong>Director revision:</strong> {c.director.comments} {c.director.suggestedAmount && `Suggested amount: ${c.director.suggestedAmount}`}</Banner><section className="card"><label>Revised proposed amount<input value={amount} onChange={e => setAmount(e.target.value)} /></label><label>Revised justification<textarea value={notes} onChange={e => setNotes(e.target.value)} /></label></section>{saved && <Banner type="success">Revised draft saved locally for this prototype session.</Banner>}<div className="actions"><button className="secondary" onClick={() => { update(c.id, x => ({ ...x, sponsor: { ...x.sponsor, amount, notes } })); setSaved(true); }}>Save Revised Draft</button><button className="primary" disabled={!amount || !notes} onClick={() => setConfirm(true)}>Resubmit to Director</button></div><ConfirmationDialog open={confirm} title="Resubmit sponsorship proposal" message="Resubmit this sponsorship proposal to the Director for final decision?" onCancel={() => setConfirm(false)} onConfirm={() => { update(c.id, x => ({ ...x, sponsor: { ...x.sponsor, state: 'pending director', amount, notes }, director: { ...x.director, state: 'pending' } })); setConfirm(false); nav('..'); }} /></CaseLayout>;
}

function Director({ c, update }: { c: Case; update: (id: string, fn: (c: Case) => Case) => void }) {
  const nav = useNavigate(); const [decision, setDecision] = useState<'Approve' | 'Reject' | 'Revise'>('Approve'); const [comments, setComments] = useState(''); const [suggested, setSuggested] = useState(c.sponsor.amount); const [confirm, setConfirm] = useState(false); const message = decision === 'Approve' ? 'Approve this sponsorship proposal and finalize the case as Approved?' : decision === 'Reject' ? 'Reject this sponsorship request and finalize the case as Rejected?' : 'Return this proposal to the Verifier for revision?';
  return <CaseLayout c={c}><section className="screen-head"><div><span className="eyebrow">Final decision workspace</span><h2>Director Sponsorship Approval</h2><p>All required review outcomes and the Verifier proposal are summarised below.</p></div></section><section className="grid"><article className="card"><h3>Review outcomes</h3><p>Medical — {c.medical.outcome}<br/>Social — {c.social.outcome}<br/>Financial — {c.financial.outcome}</p><h3>Verifier proposal</h3><p><strong>{c.sponsor.amount}</strong><br/>{c.sponsor.notes}</p></article><article className="card"><h3>Director decision</h3><label>Decision<select value={decision} onChange={e => setDecision(e.target.value as 'Approve' | 'Reject' | 'Revise')}><option>Approve</option><option>Reject</option><option>Revise</option></select></label>{decision === 'Revise' && <label>Suggested/revised amount<input value={suggested} onChange={e => setSuggested(e.target.value)} /></label>}<label>Mandatory comments<textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Enter decision comments" /></label><button className={decision === 'Reject' ? 'danger' : 'primary'} disabled={!comments.trim() || (decision === 'Revise' && !suggested.trim())} onClick={() => setConfirm(true)}>{decision}</button></article></section>{c.panelRecommendation && <section className="card muted"><h3>Panel / Committee recommendation</h3><p>{c.panelRecommendation} This is supporting context only; it does not approve the case.</p></section>}<ConfirmationDialog open={confirm} title={`${decision} sponsorship request`} message={message} onCancel={() => setConfirm(false)} onConfirm={() => { update(c.id, x => ({ ...x, broadStatus: decision === 'Approve' ? 'Approved' : decision === 'Reject' ? 'Rejected' : 'Under Review', sponsor: { ...x.sponsor, state: decision === 'Revise' ? 'revision requested' : 'pending director' }, director: { state: decision === 'Approve' ? 'approved' : decision === 'Reject' ? 'rejected' : 'revised', comments, suggestedAmount: decision === 'Revise' ? suggested : undefined, date: '28 Aug 2026' } })); setConfirm(false); nav(decision === 'Approve' ? '../approved' : decision === 'Reject' ? '../rejected' : '..'); }} /></CaseLayout>;
}

function Panel({ c, update }: { c: Case; update: (id: string, fn: (c: Case) => Case) => void }) {
  const [text, setText] = useState(c.panelRecommendation || ''); const [saved, setSaved] = useState(false);
  const save = () => { update(c.id, x => ({ ...x, panelRecommendation: text })); setSaved(true); };
  return <CaseLayout c={c}><section className="screen-head"><div><span className="eyebrow">Recommendation context</span><h2>Panel / Committee Recommendation</h2></div></section><Banner>Panel/Committee information is supporting recommendation context. Final sponsorship approval is completed by the Director.</Banner><section className="card"><h3>Recommendation</h3><label>Recommendation comments<textarea value={text} onChange={e => setText(e.target.value)} /></label>{saved && <Banner type="success">Recommendation saved for this prototype session.</Banner>}<div className="actions"><button className="secondary" disabled={!text.trim()} onClick={save}>Save Recommendation</button><button className="primary" disabled={!text.trim()} onClick={save}>Submit Recommendation</button></div></section></CaseLayout>;
}

function Final({ c, approved }: { c: Case; approved: boolean }) {
  return <CaseLayout c={c}><section className={`final ${approved ? 'approved' : 'rejected'}`}><span className="eyebrow">Final Director decision</span><h2>{approved ? 'Sponsorship Approved' : 'Sponsorship Rejected'}</h2><p>{c.director.comments}</p>{approved && <><p><strong>Approved amount:</strong> {c.sponsor.amount}<br/><strong>Decision date:</strong> {c.director.date}<br/><strong>Beneficiary number:</strong> {c.beneficiaryNumber || 'Generated in downstream settlement process'}</p><Banner type="success">Sponsorship approved. The case can now proceed to Settlement & Closure.</Banner></>}{!approved && <Banner type="danger">The normal sponsorship workflow has ended. Settlement is not a next step for this rejected request.</Banner>}</section></CaseLayout>;
}
