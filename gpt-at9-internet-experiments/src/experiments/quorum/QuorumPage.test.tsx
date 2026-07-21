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
  await user.click(screen.getByRole('button', { name: '关闭 A' }));
  expect(screen.getByText('故障转移完成。节点 B 持有服务与虚拟 IP。')).toBeInTheDocument();
  expect(screen.getAllByText('B').length).toBeGreaterThan(0);
});
