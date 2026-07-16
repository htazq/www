import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';

export default function AboutPage() {
  usePageMetadata({
    title: 'About',
    description: 'About the AT9 personal browser laboratory.',
    path: '/about',
  });
  return (
    <section className="about-page">
      <header>
        <p>AT9 / ABOUT</p>
        <h1>A PERSONAL BROWSER LABORATORY.</h1>
      </header>
      <div className="about-grid">
        <div className="about-copy">
          <p>AT9 Internet Experiments 是一个个人浏览器实验室。</p>
          <p>这里记录关于系统、网络、数据尺度、计算机历史和人机协作的互动作品。</p>
          <p>它不是技术课程，也不是产品目录。</p>
          <p>每个实验都试图把一个抽象概念，变成可以点击、拖动、破坏、组合和观察的东西。</p>
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
