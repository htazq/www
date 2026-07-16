import { Link } from 'react-router-dom';
import { usePageMetadata } from './metadata';
import { experiments } from '../data/experiments';

export default function ExperimentsPage() {
  usePageMetadata({
    title: 'Experiments',
    description: 'Index of all seven interactive browser experiments.',
    path: '/experiments',
  });
  return (
    <section className="index-page">
      <header>
        <p>AT9 / COLLECTION</p>
        <h1>ALL EXPERIMENTS</h1>
        <p>Seven independent systems, each built with browser-native primitives.</p>
      </header>
      <ol className="index-list">
        {experiments.map((item) => (
          <li key={item.slug}>
            <Link to={`/experiments/${item.slug}`}>
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <em>{item.type}</em>
              <b>OPEN ↗</b>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
