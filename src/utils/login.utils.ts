const testRegex = (str: string, regex: RegExp) => {
  // skip using rule for empty string
  return regex.test(str);
};

// skip empty strings
const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email ? testRegex(email, regex) : true;
};

const isValidPassword = (password: string) => {
  // 8 characters - 1 uppercase, 1 special character and 1 digit
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}/;
  return password ? testRegex(password, regex) : true;
};

export { isValidEmail, isValidPassword };
