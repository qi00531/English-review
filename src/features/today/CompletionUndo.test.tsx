import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompletionUndo } from './CompletionUndo';

it('offers a five-second undo action for a completed node', async () => {
  const user = userEvent.setup();
  const undo = vi.fn().mockResolvedValue(undefined);
  render(<CompletionUndo nodeId="node-1" onUndo={undo} onDismiss={vi.fn()} />);

  expect(screen.getByRole('status')).toHaveTextContent('本次复习已完成');
  await user.click(screen.getByRole('button', { name: '撤销完成' }));
  expect(undo).toHaveBeenCalledWith('node-1');
});
