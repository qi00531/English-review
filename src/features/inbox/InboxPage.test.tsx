import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { CaptureDraft } from '../../capture/model';
import { InboxPage } from './InboxPage';

const draft: CaptureDraft = { id:'c1', text:'potential', normalizedText:'potential', type:'word', meaningsZh:['潜力'], exampleEn:'She has potential.', exampleZh:'她有潜力。', usIpa:null, ukIpa:null, usAudioUrl:null, ukAudioUrl:null, audioFallback:'speech-synthesis', status:'ready', capturedAt:'2026-08-25T00:00:00.000Z' };

it('blocks List creation while reviews are due', () => {
  render(<InboxPage drafts={[draft]} locked onPromote={vi.fn()} onDelete={vi.fn()} onUpdate={vi.fn()} />);
  expect(screen.getByText('完成今天的复习后即可生成新 List')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '生成新 List' })).toBeDisabled();
});

it('promotes selected drafts when unlocked', async () => {
  const onPromote = vi.fn();
  render(<InboxPage drafts={[draft]} locked={false} onPromote={onPromote} onDelete={vi.fn()} onUpdate={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: '生成新 List' }));
  expect(onPromote).toHaveBeenCalledWith(['c1']);
});
