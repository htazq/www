import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';
import { getSiteLanguage } from './language';

const aboutCopy = {
  zh: {
    title: '个人浏览器实验室。',
    description: '关于 AT9 个人浏览器实验室。',
    paragraphs: [
      'AT9 Internet Experiments 是一个个人浏览器实验室。',
      '这里记录关于系统、网络、数据尺度、计算机历史和人机协作的互动作品。',
      '它不是技术课程，也不是产品目录。',
      '每个实验都试图把一个抽象概念，变成可以点击、拖动、破坏、组合和观察的东西。',
    ],
  },
  en: {
    title: 'A PERSONAL BROWSER LABORATORY.',
    description: 'About the AT9 personal browser laboratory.',
    paragraphs: [
      'AT9 Internet Experiments is a personal browser laboratory.',
      'It collects interactive work about systems, networks, data scale, computing history, and human-computer collaboration.',
      'It is neither a technical course nor a product catalog.',
      'Each experiment turns an abstract concept into something you can click, drag, break, combine, and observe.',
    ],
  },
} as const;

export default function AboutPage() {
  const copy = aboutCopy[getSiteLanguage()];

  usePageMetadata({
    title: 'About',
    description: copy.description,
    path: '/experiments/about',
  });
  return (
    <section className="about-page">
      <header>
        <p>AT9 / ABOUT</p>
        <h1>{copy.title}</h1>
      </header>
      <div className="about-grid">
        <div className="about-copy">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="principles">
          <li>Browser native</li>
          <li>No account</li>
          <li>No tracking</li>
          <li>No fake real-time data</li>
          <li>No AI API dependency</li>
        </ul>
      </div>
      <nav className="external-links" aria-label="External links">
        <a href={siteConfig.links.notes}>BLOG ↗</a>
        <a href={siteConfig.links.deck}>9DECK ↗</a>
        <a href={siteConfig.links.ipTool}>IP TOOL ↗</a>
        <a href={siteConfig.links.github}>GITHUB ↗</a>
      </nav>
    </section>
  );
}
