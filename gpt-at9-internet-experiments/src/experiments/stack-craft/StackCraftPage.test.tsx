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
    await user.click(screen.getByRole('button', { name: '磁盘' }));
    expect(screen.getByRole('status')).toHaveTextContent('发现新元素：文件系统');
    expect(screen.getByRole('button', { name: '文件系统' })).toBeInTheDocument();
  });
});
