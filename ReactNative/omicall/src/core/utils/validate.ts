export class Validate {
  static email = (email: string) => {
    const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexEmail.test(email);
  };
  static password = (password: string) => {
    const regexPassword = /^.{6,}$/;
    return regexPassword.test(password);
  };

  static vietnamesePhoneNumber = (phoneNumber: string) => {
    const regexPhoneNumber =
      /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g;
    return regexPhoneNumber.test(phoneNumber);
  };
}
