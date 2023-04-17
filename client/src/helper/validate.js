import toast from 'react-hot-toast';

/* validate login page username */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

/* validate username */
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error('Username required...!');
  } else if (values.username.includes(' ')) {
    error.username = toast.error('Invalid Username...!');
  }
  return error;
}

/* validate password */
function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error('Password required...!');
  } else if (values.password.includes(' ')) {
    error.password = toast.error('Invalid password...!');
  } else if (values.password.length < 4) {
    error.password = toast.error('Password must be more than 4 character');
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error('Password must have special character');
  }
  return error;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

/* validate reset password  */
export async function resetPasswordValidation(values) {
  const error = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    error.exist = toast.error('Password not match...!');
  }
  return error;
}

/* validate register form */
export async function registerValidation(values) {
  const error = usernameVerify({}, values);
  passwordVerify(error, values);
  emailVerify(error, values);
  return error;
}

/* validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error('Email Required...!');
  } else if (values.email.includes(' ')) {
    error.email = toast.error('Wrong email');
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error('Invalid email address');
  }
  return error;
}

/* validate profile page */

export async function profileValidation(values) {
  const error = emailVerify({}, values);
  return error;
}
