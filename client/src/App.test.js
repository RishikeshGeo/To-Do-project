import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app heading', () => {
  render(<App />);
  const heading = screen.getByText(/React To-Do App/i);
  expect(heading).toBeInTheDocument();
});
