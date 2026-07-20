import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';

export default function NotFoundPage() {
  usePageMetadata({
    title: '路由不存在',
    description: '这个数据包到达了一个不存在的网络。',
    path: '/404',
  });
  return (
    <section className="not-found">
      <p>404 / 空路由</p>
      <h1>路由不存在</h1>
      <p>这个数据包到达了一个不存在的网络。</p>
      <Link className="button-primary" to="/experiments">
        返回实验室
      </Link>
    </section>
  );
}
