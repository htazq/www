import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StackCraftPage from './StackCraftPage';

describe('Stack Craft page', () => {
  beforeEach(() => localStorage.clear());
  it('combines two foundational elements', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <StackCraftPage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: 'Linux' }));
    await user.click(screen.getByRole('button', { name: 'Disk' }));
    expect(screen.getByRole('status')).toHaveTextContent('DISCOVERED: File System');
    expect(screen.getByRole('button', { name: 'File System' })).toBeInTheDocument();
  });
});
