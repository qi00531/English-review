import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the product identity and today route', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /word journal/i })).toBeInTheDocument();
  expect(screen.getByText('今日复习')).toBeInTheDocument();
});
