import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

it('renders all seven experiment entrances', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole('link', { name: /进入实验/ })).toHaveLength(7);
  expect(screen.getByRole('heading', { name: /堆栈合成/ })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /互联网考古/ })).toBeInTheDocument();
});
