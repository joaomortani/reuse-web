import type { ReactNode } from 'react';

import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

export const DashboardShell = ({ children }: { children: ReactNode }) => (
  <div className="dashboard-shell">
    <DashboardSidebar />
    <div className="dashboard-shell__main">
      <DashboardHeader />
      <div className="dashboard-shell__content">{children}</div>
    </div>
  </div>
);
