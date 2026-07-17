import { Link } from 'react-router-dom';
import { localize } from '../../app/language';
import { experiments } from '../../data/experiments';
import { SoundToggle } from '../ui/SoundToggle';

interface ExperimentHeaderProps {
  number: string;
  title: string;
  label?: string;
}

export function ExperimentHeader({
  number,
  title,
  label = 'LIVE EXPERIMENT',
}: ExperimentHeaderProps) {
  const experiment = experiments.find((item) => item.number === number);

  return (
    <header className="experiment-header">
      <div className="experiment-kicker">
        <Link to="/experiments">← ALL EXPERIMENTS</Link>
        <span>{label}</span>
        <SoundToggle />
      </div>
      <p className="experiment-number">{number}</p>
      <h1>{title}</h1>
      {experiment && (
        <p className="experiment-description">{localize(experiment.detailDescription)}</p>
      )}
    </header>
  );
}
