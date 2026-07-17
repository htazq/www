import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { siteConfig } from '../../app/siteConfig';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <NavLink className="brand" to="/experiments" onClick={close} aria-label="AT9 experiments">
        AT9
      </NavLink>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        MENU
      </button>
      <nav
        id="site-navigation"
        className={open ? 'site-nav is-open' : 'site-nav'}
        aria-label="Main navigation"
      >
        <NavLink to="/experiments" onClick={close}>
          EXPERIMENTS
        </NavLink>
        <NavLink to="/experiments/about" onClick={close}>
          ABOUT
        </NavLink>
        <a href={siteConfig.links.deck} target="_blank" rel="noreferrer">
          9DECK ↗
        </a>
      </nav>
    </header>
  );
}
