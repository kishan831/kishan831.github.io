import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenBody from './ScreenBody'

describe('contact screen', () => {
  it('shows the direct channels', () => {
    render(<ScreenBody screenId="contact" />)
    expect(screen.getByText(/jaiswalkishan628@gmail.com/i)).toBeInTheDocument()
  })

  it('requires name, email and message', () => {
    render(<ScreenBody screenId="contact" />)
    expect(screen.getByLabelText(/name/i)).toBeRequired()
    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText(/message/i)).toBeRequired()
  })

  it('shows a validation summary when submitted empty', async () => {
    const user = userEvent.setup()
    render(<ScreenBody screenId="contact" />)
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/name/i)
  })
})

describe('academy screen', () => {
  it('lists the tech stack groups', () => {
    render(<ScreenBody screenId="academy" />)
    expect(screen.getByText(/casino & gameplay/i)).toBeInTheDocument()
  })
})

describe('exit screen', () => {
  it('says mission complete and offers the resume', () => {
    render(<ScreenBody screenId="exit" />)
    expect(screen.getByText(/mission complete/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/assets/resume.pdf',
    )
  })
})
