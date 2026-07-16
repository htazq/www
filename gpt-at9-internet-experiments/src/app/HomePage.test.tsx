import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

it('renders all seven experiment entrances', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole('link', { name: /ENTER EXPERIMENT/i })).toHaveLength(7);
  expect(screen.getByRole('heading', { name: 'STACK CRAFT' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'INTERNET ARCHAEOLOGY' })).toBeInTheDocument();
});
