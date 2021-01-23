import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('render application name', () => {
  render(<App />);
  const appname = screen.getByText(/Secure Adaptive Testing for Organized Capability Assessment/i);
  expect(appname).toBeInTheDocument();
});
