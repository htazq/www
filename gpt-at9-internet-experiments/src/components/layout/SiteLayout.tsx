import { Outlet } from 'react-router-dom';
import { SkipLink } from '../accessibility/SkipLink';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteLayout() {
  return (
    <div className="site-shell">
      <SkipLink />
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
