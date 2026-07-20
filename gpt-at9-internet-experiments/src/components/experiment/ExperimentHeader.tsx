import { Link } from 'react-router-dom';
import { experiments } from '../../data/experiments';
import { SoundToggle } from '../ui/SoundToggle';

interface ExperimentHeaderProps {
  number: string;
  title: string;
  label?: string;
}

export function ExperimentHeader({ number, title, label = '在线实验' }: ExperimentHeaderProps) {
  const experiment = experiments.find((item) => item.number === number);

  return (
    <header
      className="experiment-header"
      style={experiment ? ({ '--accent': experiment.color } as React.CSSProperties) : undefined}
    >
      <div className="experiment-kicker">
        <Link to="/experiments">← 全部实验</Link>
        <span>{label}</span>
        <SoundToggle />
      </div>
      <p className="experiment-number">实验 {number}</p>
      <h1>
        {title}
        {experiment && <span className="en-sub">{experiment.enTitle}</span>}
      </h1>
      {experiment && <p className="experiment-description">{experiment.detailDescription}</p>}
    </header>
  );
}
