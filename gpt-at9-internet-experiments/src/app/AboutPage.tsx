import { usePageMetadata } from './metadata';
import { siteConfig } from './siteConfig';

const paragraphs = [
  'AT9 互联网实验室是一个个人的浏览器实验室。',
  '这里记录关于系统、网络、数据尺度、计算机历史与人机协作的互动作品。',
  '它不是技术课程，也不是产品目录。',
  '每个实验都试图把一个抽象概念，变成可以点击、拖动、破坏、组合和观察的东西。',
];

const principles = ['浏览器原生', '无需账号', '不做跟踪', '不伪造实时数据', '不依赖 AI 接口'];

export default function AboutPage() {
  usePageMetadata({
    title: '关于',
    description: '关于 AT9 个人浏览器实验室。',
    path: '/experiments/about',
  });
  return (
    <section className="about-page">
      <header>
        <p>AT9 / 关于</p>
        <h1>一个人的浏览器实验室。</h1>
      </header>
      <div className="about-grid">
        <div className="about-copy">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="principles">
          {principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <nav className="external-links" aria-label="外部链接">
        <a href={siteConfig.links.notes}>博客 ↗</a>
        <a href={siteConfig.links.ipTool}>IP 工具 ↗</a>
        <a href={siteConfig.links.github}>GITHUB ↗</a>
      </nav>
    </section>
  );
}
