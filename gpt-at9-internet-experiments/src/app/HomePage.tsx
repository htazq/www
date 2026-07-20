import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';
import { experiments } from '../data/experiments';

export default function HomePage() {
  usePageMetadata({
    title: 'AT9 实验室',
    description: '关于系统、网络、尺度与计算机历史的可交互实验。',
    path: '/experiments',
  });

  return (
    <>
      <section className="home-hero">
        <div className="hero-glow g1" />
        <div className="hero-glow g2" />
        <div className="hero-index">AT9 / 实验室 / 2026</div>
        <h1>
          <span className="accent">互联网</span>
          <span className="outline">实验室</span>
        </h1>
        <div className="hero-copy">
          <p>
            七个运行在浏览器里的交互实验——关于系统、网络、数据尺度，以及计算机的历史。
            每一个都可以点击、拖动、破坏与观察。
          </p>
        </div>
        <div className="hero-actions">
          <a className="button-primary" href="#experiments-heading">
            浏览实验 ↓
          </a>
          <a href={siteConfig.links.deck} target="_blank" rel="noreferrer">
            9DECK ↗
          </a>
          <a href={siteConfig.links.notes} target="_blank" rel="noreferrer">
            博客 ↗
          </a>
        </div>
      </section>
      <section className="exhibit-list" aria-labelledby="experiments-heading">
        <div className="section-heading">
          <p>实验集合 / THE COLLECTION</p>
          <h2 id="experiments-heading">七个可运行的展品</h2>
        </div>
        {experiments.map((experiment) => (
          <article
            className="exhibit"
            key={experiment.slug}
            style={{ '--accent': experiment.color } as React.CSSProperties}
          >
            <div className="exhibit-meta">
              <span>{experiment.number}</span>
              <span>{experiment.type}</span>
              <span>在线实验</span>
            </div>
            <div className="exhibit-title">
              <h3>
                {experiment.title}
                <span className="en-name">{experiment.enTitle}</span>
              </h3>
              <p>{experiment.description}</p>
            </div>
            <div className="exhibit-preview" aria-hidden="true">
              {experiment.preview}
            </div>
            <Link className="exhibit-link" to={`/experiments/${experiment.slug}`}>
              进入实验 <span>↗</span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
