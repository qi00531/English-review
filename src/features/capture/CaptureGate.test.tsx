import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CaptureGate } from './CaptureGate';

it('prevents direct capture access while review is due', () => {
  render(<MemoryRouter><CaptureGate loading={false} dueCount={2}><p>capture form</p></CaptureGate></MemoryRouter>);

  expect(screen.queryByText('capture form')).not.toBeInTheDocument();
  expect(screen.getByText('先完成今天的复习')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '返回今日任务' })).toHaveAttribute('href', '/');
});
