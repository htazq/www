import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SoundToggle } from './SoundToggle';

class AudioContextMock {
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      frequency: { value: 0 },
      connect: () => this.createGain(),
      start: () => undefined,
      stop: () => undefined,
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => undefined, exponentialRampToValueAtTime: () => undefined },
      connect: () => this.destination,
    };
  }
  close() {
    return Promise.resolve();
  }
}

it('keeps sound off until the user enables it', async () => {
  Object.defineProperty(window, 'AudioContext', { value: AudioContextMock, configurable: true });
  const user = userEvent.setup();
  render(<SoundToggle />);
  const button = screen.getByRole('button', { name: '音效 关' });
  expect(button).toHaveAttribute('aria-pressed', 'false');
  await user.click(button);
  expect(screen.getByRole('button', { name: '音效 开' })).toHaveAttribute('aria-pressed', 'true');
});
