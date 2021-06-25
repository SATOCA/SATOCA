import { fireEvent, render, screen } from "@testing-library/react";
import TrusteeLogin from "./TrusteeLogin";

test("render trustee login page", () => {
   render(<TrusteeLogin />);

   expect(screen.getByText('Login')).toBeInTheDocument();
   expect(screen.getByText('Password')).toBeInTheDocument();
   // form controls
   expect(screen.getByTestId('input-login')).toBeInTheDocument();
   expect(screen.getByTestId('input-password')).toBeInTheDocument();
   // submit button is switched off by default 
   expect(screen.getByTestId('btn-submit')).toHaveAttribute('disabled', '');
});

test("test input validation", () => {
   render(<TrusteeLogin />);

   const login = screen.getByTestId('input-login');
   const password = screen.getByTestId('input-password');

   fireEvent.change(login, { target: { value: '123' } })
   expect(login).toHaveValue("123");
   // submit button is still disabled
   expect(screen.getByTestId('btn-submit')).toHaveAttribute('disabled', '');

   fireEvent.change(password, { target: { value: '456' } })
   expect(password).toHaveValue("456");

   // submit button is now enabled
   expect(screen.getByTestId('btn-submit').getAttribute('disabled')).toBeFalsy;
});
