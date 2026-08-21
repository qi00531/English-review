import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { EnrichmentResult } from '../../../server/enrichment/schema';
import { CapturePage } from './CapturePage';

const ready: EnrichmentResult = {
  status: 'ready', english: 'retain', usIpa: '/rɪˈteɪn/', ukIpa: null,
  usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['保持', '保留'],
  exampleEn: 'We retain more through review.', exampleZh: '通过复习，我们记住更多。',
  audioFallback: 'speech-synthesis',
};

it('generates partial preview, allows editing, retries one error, and saves ready terms', async () => {
  const user = userEvent.setup();
  const enrich = vi.fn()
    .mockResolvedValueOnce([ready, {
      status: 'error', english: 'subtle', code: 'AI_UNAVAILABLE', message: '请重试',
    }])
    .mockResolvedValueOnce([{ ...ready, english: 'subtle', meaningsZh: ['细微的'] }]);
  const save = vi.fn().mockResolvedValue(undefined);
  render(<MemoryRouter><CapturePage enrich={enrich} save={save} today="2026-08-21" /></MemoryRouter>);

  await user.type(screen.getByLabelText('今天学到的英文'), 'retain{enter}subtle');
  await user.click(screen.getByRole('button', { name: '生成学习内容' }));

  expect(await screen.findByDisplayValue('保持；保留')).toBeInTheDocument();
  expect(screen.getByText('请重试')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '重试 subtle' }));
  expect(await screen.findByDisplayValue('细微的')).toBeInTheDocument();

  await user.clear(screen.getByDisplayValue('保持；保留'));
  fireEvent.change(screen.getByLabelText('retain 的中文义项'), {
    target: { value: '保持；保留；记住；雇用' },
  });
  await user.click(screen.getByRole('button', { name: '保存到今日 List' }));
  expect(save).toHaveBeenCalledWith('2026-08-21', expect.arrayContaining([
    expect.objectContaining({ english: 'retain', meaningsZh: ['保持', '保留', '记住', '雇用'] }),
  ]));
});
