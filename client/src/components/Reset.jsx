import React from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate';
const Reset = () => {
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: '',
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto ">
      <Toaster
        position="top-center"
        reverseOrder={false}
      ></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div
          className={styles.glass}
          style={{ width: '50%' }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>
          <form
            action="py-20"
            onSubmit={formik.handleSubmit}
          >
            <div className="profile flex justify-center py-4">
              <img
                className={styles.profile_img}
                src={avatar}
                alt="avatar"
              />
            </div>
            <div className="text-box flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type="password"
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps('confirm_pwd')}
                className={styles.textbox}
                type="password"
                placeholder="Repeat Password"
              />

              <button
                className={styles.btn}
                type="submit"
              >
                Let's Go
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a member
                <Link
                  className="text-red-500"
                  href="/register"
                >
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
