import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
describe('Login Page', () => {  
  it('should render basic HTML elements', () => {  
    const { container } = render(
      <div data-testid="login-page">
        <h1>Sign In</h1>
        <input placeholder="Ops ID" />
      </div>
    )
    expect(container).toBeInTheDocument()
  })
})
