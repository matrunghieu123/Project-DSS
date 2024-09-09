export class Validate {
  static email = (email: string) => {
    let regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexEmail.test(email);
  };
  static password = (password: string) => {
    let regexPassword = /^.{6,}$/;
    return regexPassword.test(password);
  };
}
