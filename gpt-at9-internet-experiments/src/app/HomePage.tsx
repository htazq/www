import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';
import { experiments } from '../data/experiments';
import { getSiteLanguage, localize } from './language';

const pageCopy = {
  zh: {
    title: '浏览器原生系统实验室',
    description: '关于系统、网络、尺度和计算机历史的可交互实验。',
    intro: '一个工程师持续发布互联网实验的地方。关于系统、网络、尺度，以及计算机历史。',
    explore: '浏览实验',
    collection: '实验集合',
    collectionTitle: '七个可运行的实验',
    enter: '进入实验',
  },
  en: {
    title: 'Browser-native systems laboratory',
    description: 'Interactive experiments about systems, networks, scale, and computing history.',
    intro: 'Small experiments about systems, networks, scale, and the history of computing.',
    explore: 'EXPLORE THE LAB',
    collection: 'THE COLLECTION',
    collectionTitle: 'Seven working exhibits',
    enter: 'ENTER EXPERIMENT',
  },
} as const;

export default function HomePage() {
  const language = getSiteLanguage();
  const copy = pageCopy[language];

  usePageMetadata({
    title: copy.title,
    description: copy.description,
    path: '/experiments',
  });

  return (
    <>
      <section className="home-hero">
        <div className="hero-index">AT9 / LAB / 2026</div>
        <h1>
          <span>AT9</span>INTERNET EXPERIMENTS
        </h1>
        <div className="hero-copy">
          <p>{copy.intro}</p>
        </div>
        <div className="hero-actions">
          <a className="button-primary" href="#experiments-heading">
            {copy.explore}
          </a>
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
          <p>{copy.collection}</p>
          <h2 id="experiments-heading">{copy.collectionTitle}</h2>
        </div>
        {experiments.map((experiment) => (
          <article className="exhibit" key={experiment.slug}>
            <div className="exhibit-meta">
              <span>{experiment.number}</span>
              <span>{experiment.type}</span>
              <span>{language === 'zh' ? '在线实验' : 'LIVE EXPERIMENT'}</span>
            </div>
            <div className="exhibit-title">
              <h3>{experiment.title}</h3>
              <p>{localize(experiment.description)}</p>
            </div>
            <div className="exhibit-preview" aria-hidden="true">
              {experiment.preview}
            </div>
            <Link className="exhibit-link" to={`/experiments/${experiment.slug}`}>
              {copy.enter} <span>↗</span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
