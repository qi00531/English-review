import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Action } from './Action';
import { AppShell } from './AppShell';
import { LiveStatus } from './LiveStatus';
import { Progress } from './Progress';
import { TextTabs } from './TextTabs';

it('exposes view modes as keyboard-navigable tabs', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <TextTabs
      label="复习显示模式"
      value="complete"
      onChange={onChange}
      items={[
        { value: 'complete', label: '完整' },
        { value: 'english', label: '英文' },
        { value: 'chinese', label: '中文' },
      ]}
    />,
  );

  const complete = screen.getByRole('tab', { name: '完整' });
  expect(complete).toHaveAttribute('aria-selected', 'true');
  complete.focus();
  await user.keyboard('{ArrowRight}');
  expect(onChange).toHaveBeenCalledWith('english');
  expect(screen.getByRole('tab', { name: '英文' })).toHaveFocus();
});

it('provides semantic actions and polite live feedback', () => {
  render(
    <>
      <Action>开始复习</Action>
      <LiveStatus>List 1 已完成</LiveStatus>
    </>,
  );

  expect(screen.getByRole('button', { name: '开始复习' })).toHaveClass('action');
  expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
});

it('marks the homepage for the full clipboard composition', () => {
  render(<MemoryRouter initialEntries={['/']}><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByTestId('app-shell')).toHaveClass('app-shell--home');
});

it('marks inner pages for the quiet paper crop', () => {
  render(<MemoryRouter initialEntries={['/history']}><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByTestId('app-shell')).toHaveClass('app-shell--inner');
});

it('separates history and settings without adding a header card', () => {
  render(<MemoryRouter><AppShell><p>Content</p></AppShell></MemoryRouter>);
  expect(screen.getByRole('separator', { name: '导航分隔' })).toBeInTheDocument();
  expect(screen.getByRole('banner')).not.toHaveClass('card');
});

it('renders a compact labeled progress rail with its count', () => {
  render(<Progress value={1} max={3} label="今日进度" />);
  expect(screen.getByText('今日进度')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: '今日进度' })).toHaveAttribute('value', '1');
  expect(screen.getByText('1 / 3')).toBeInTheDocument();
});
