import { getSiteLanguage } from '../../app/language';

export function SiteFooter() {
  const isChinese = getSiteLanguage() === 'zh';

  return (
    <footer className="site-footer">
      <div>
        <strong>AT9 INTERNET EXPERIMENTS</strong>
        <p>
          {isChinese
            ? '一组运行在浏览器中的交互实验。'
            : 'A collection of browser-native experiments.'}
        </p>
        <p>
          {isChinese
            ? '不跟踪，无需账号，不生成 AI 答案。'
            : 'No tracking. No account. No AI-generated answers.'}
        </p>
      </div>
      <p className="footer-tags">Systems · Networks · Scale · History</p>
    </footer>
  );
}
