import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Role, Scenario } from '../models/workflow';
import { sidebarItems } from '../utils/rbac';

export function AppShell({ role, scenario, onRoleChange, onScenarioChange, children }: {
  role: Role;
  scenario: Scenario;
  onRoleChange: (role: Role) => void;
  onScenarioChange: (scenario: Scenario) => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const roles: Role[] = ['Hospital SPOC', 'Verifier', 'Medical Reviewer', 'Social Reviewer', 'Financial Reviewer', 'Director', 'Panel Member'];
  const scenarios: Scenario[] = ['Normal Approval', 'Financial Review Pending', 'Medical Needs More Information', 'Director Revision', 'Director Rejection', 'Approved Case'];
  const navItems = sidebarItems(role);

  return <div className="bms-shell">
    <header className="bms-topbar">
      <Link to="/dashboard" className="bms-brand"><b>NFI</b><span>Neonates Foundation of India</span></Link>
      <div className="product-name">Beneficiary Management System</div>
      <div className="topbar-actions">
        <details className="demo-menu">
          <summary>Demo controls</summary>
          <div className="demo-popover">
            <strong>Prototype-only</strong>
            <label>Acting role
              <select value={role} onChange={e => onRoleChange(e.target.value as Role)}>{roles.map(item => <option key={item}>{item}</option>)}</select>
            </label>
            <label>Demo scenario
              <select value={scenario} onChange={e => onScenarioChange(e.target.value as Scenario)}>{scenarios.map(item => <option key={item}>{item}</option>)}</select>
            </label>
            <button className="secondary" onClick={() => onScenarioChange(scenario)}>Reset demo</button>
          </div>
        </details>
        <span className="language">EN</span>
        <div className="user-chip"><span className="avatar">{role[0]}</span><span><b>{role}</b><small>Signed in · Demo</small></span></div>
      </div>
    </header>

    <aside className="sidebar">
      <nav>{navItems.map(item => {
        const active = item.path === '/cases' ? location.pathname.startsWith('/cases') : location.pathname === item.path;
        return <Link key={item.path} className={active ? 'active' : ''} to={item.path}>{item.icon} {item.label}</Link>;
      })}</nav>
      <div className="sidebar-note">Workflow enhancements<br/><span>FGR prototype view</span></div>
    </aside>

    <div className="workspace">{children}</div>
    <footer>Prototype — Synthetic demonstration data only</footer>
  </div>;
}
