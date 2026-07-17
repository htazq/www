import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { getSiteLanguage } from './language';
import { AppRoutes } from './routes';

export default function App() {
  useEffect(() => {
    document.documentElement.lang = getSiteLanguage() === 'zh' ? 'zh-CN' : 'en';
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
