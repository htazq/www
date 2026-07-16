import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import QuorumPage from './QuorumPage';

it('moves the service after Node A shuts down', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <QuorumPage />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole('button', { name: 'SHUT DOWN A' }));
  expect(
    screen.getByText('Failover completed. Node B owns the service and VIP.'),
  ).toBeInTheDocument();
  expect(screen.getAllByText('B').length).toBeGreaterThan(0);
});
