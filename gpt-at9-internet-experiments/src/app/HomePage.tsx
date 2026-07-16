import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';
import { experiments } from '../data/experiments';

export default function HomePage() {
  usePageMetadata({
    title: 'Browser-native systems laboratory',
    description: 'Interactive experiments about systems, networks, scale, and computing history.',
    path: '/',
  });

  return (
    <>
      <section className="home-hero">
        <div className="hero-index">AT9 / LAB / 2026</div>
        <h1>
          <span>AT9</span>INTERNET EXPERIMENTS
        </h1>
        <div className="hero-copy">
          <p>一个工程师持续发布互联网实验的地方。</p>
          <p>关于系统、网络、尺度，以及计算机历史的一些可交互实验。</p>
          <p className="hero-english">
            Small experiments about systems, networks,
            <br />
            scale, and the history of computing.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button-primary" to="/experiments">
            EXPLORE THE LAB
          </Link>
          <a href={siteConfig.links.deck} target="_blank" rel="noreferrer">
            OPEN 9DECK ↗
          </a>
          <a href={siteConfig.links.notes} target="_blank" rel="noreferrer">
            READ NOTES ↗
          </a>
        </div>
      </section>
      <section className="exhibit-list" aria-labelledby="experiments-heading">
        <div className="section-heading">
          <p>THE COLLECTION</p>
          <h2 id="experiments-heading">Seven working exhibits</h2>
        </div>
        {experiments.map((experiment) => (
          <article className="exhibit" key={experiment.slug}>
            <div className="exhibit-meta">
              <span>{experiment.number}</span>
              <span>{experiment.type}</span>
              <span>LIVE EXPERIMENT</span>
            </div>
            <div className="exhibit-title">
              <h3>{experiment.title}</h3>
              <p>{experiment.description}</p>
            </div>
            <div className="exhibit-preview" aria-hidden="true">
              {experiment.preview}
            </div>
            <Link className="exhibit-link" to={`/experiments/${experiment.slug}`}>
              ENTER EXPERIMENT <span>↗</span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
