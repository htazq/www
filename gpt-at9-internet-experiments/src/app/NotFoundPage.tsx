import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';

export default function NotFoundPage() {
  usePageMetadata({
    title: 'Route not found',
    description: 'The packet reached a network that does not exist.',
    path: '/404',
  });
  return (
    <section className="not-found">
      <p>404 / NULL ROUTE</p>
      <h1>ROUTE NOT FOUND</h1>
      <p>The packet reached a network that does not exist.</p>
      <Link className="button-primary" to="/experiments">
        Return to the lab.
      </Link>
    </section>
  );
}
