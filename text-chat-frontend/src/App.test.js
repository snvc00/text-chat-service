import React from 'react'
import { screen } from '@testing-library/react'
import { render } from './test-utils'
import App from './App'

test('renders login modal', () => {
  render(<App />)
  const loginModal = screen.getByText(/Text Chat Service/i)
  expect(loginModal).toBeInTheDocument()
})
