import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { siteConfig } from '../../app/siteConfig';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <NavLink className="brand" to="/experiments" onClick={close} aria-label="AT9 实验室">
        AT9 LAB
      </NavLink>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        菜单
      </button>
      <nav
        id="site-navigation"
        className={open ? 'site-nav is-open' : 'site-nav'}
        aria-label="主导航"
      >
        <NavLink to="/experiments" onClick={close}>
          实验
        </NavLink>
        <NavLink to="/experiments/about" onClick={close}>
          关于
        </NavLink>
        <a href={siteConfig.links.notes} target="_blank" rel="noreferrer">
          博客 ↗
        </a>
      </nav>
    </header>
  );
}
