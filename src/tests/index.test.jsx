import { render, screen, fireEvent } from "@testing-library/react"
import * as reactRedux from "react-redux"
import * as reactRouterDom from "react-router-dom"
import { describe, it, vi, expect, beforeEach } from "vitest"

import * as toastModule from "@/components/ui/use-toast"
import Login from "@/pages/auth"

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
}))
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}))
vi.mock("@/components/ui/use-toast", () => ({
  toast: vi.fn(),
}))
vi.mock("@constants/", () => ({
  default: { route: { ROOT: "/" } },
}))
vi.mock("@store/slices/user.slice", () => ({
  login: vi.fn((payload) => ({ type: "LOGIN", payload })),
}))

describe("Login Page", () => {
  let dispatchMock, navigateMock, toastMock

  beforeEach(() => {
    dispatchMock = vi.fn()
    navigateMock = vi.fn()
    toastMock = vi.fn()
    reactRedux.useDispatch.mockReturnValue(dispatchMock)
    reactRouterDom.useNavigate.mockReturnValue(navigateMock)
    toastModule.toast.mockImplementation(toastMock)
  })

  it("renders login form", () => {
    render(<Login />)
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
  })

  it("validates email and submits form", async () => {
    render(<Login />)
    const emailInput = screen.getByPlaceholderText("you@email.com")
    const submitButton = screen.getByRole("button", { name: /Sign In/i })

    // Try submitting with empty email
    fireEvent.click(submitButton)
    expect(dispatchMock).not.toHaveBeenCalled()

    const userEmail = "test@example.com"

    // Enter valid email and submit
    fireEvent.change(emailInput, { target: { value: userEmail } })
    fireEvent.click(submitButton)

    // Wait for async actions
    await screen.findByText(/Welcome Back/i)

    expect(dispatchMock).toHaveBeenCalledWith({
      type: "LOGIN",
      payload: { userName: userEmail, userRole: "user" },
    })
    expect(toastMock).toHaveBeenCalledWith({
      title: "Login",
      description: "Login successful",
      variant: "success",
    })
    expect(navigateMock).toHaveBeenCalledWith("/")
  })
})
