import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Action } from './Action';
import { LiveStatus } from './LiveStatus';
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
