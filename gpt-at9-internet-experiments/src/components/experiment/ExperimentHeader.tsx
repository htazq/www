import { Link } from 'react-router-dom';
import { SoundToggle } from '../ui/SoundToggle';

interface ExperimentHeaderProps {
  number: string;
  title: string;
  description: string;
  label?: string;
}

export function ExperimentHeader({
  number,
  title,
  description,
  label = 'LIVE EXPERIMENT',
}: ExperimentHeaderProps) {
  return (
    <header className="experiment-header">
      <div className="experiment-kicker">
        <Link to="/experiments">← ALL EXPERIMENTS</Link>
        <span>{label}</span>
        <SoundToggle />
      </div>
      <p className="experiment-number">{number}</p>
      <h1>{title}</h1>
      <p className="experiment-description">{description}</p>
    </header>
  );
}
