import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the product identity and today route', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /word journal/i })).toBeInTheDocument();
  expect(
    await screen.findByRole('heading', { name: '今天的复习已经完成。' }),
  ).toBeInTheDocument();
});
