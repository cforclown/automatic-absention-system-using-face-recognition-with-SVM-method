import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  ErrorMessage, Field, Form, Formik,
} from 'formik';
import * as yup from 'yup';
import validate from '../../../utils/validate-schema';
import { SetSession } from "../../../reducer/actions";
import './index.scss';
import { login } from '../../../api/api-request';
import { toast } from 'react-toastify';

const LoginSchema = yup.object({
  username: yup.string().required('Username cannot empty!'),
  password: yup.string().required('Password cannot empty!'),
});

function Login({ history }) {
  const dispatch=useDispatch()

  async function onSubmit(values){
    try{
        const tokenData=await login(values.username, values.password);
        dispatch(SetSession(tokenData));

        history.push('/');
    }
    catch(err){
        toast.error(err.message);
    }
  }

  return (
    <div id="cl-login-page">
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validate={validate(LoginSchema)}
        onSubmit={onSubmit}
      >
        <div className="cl-login-form">
          <LoginFormHeader title="Login" />
          <LoginForm />
        </div>
      </Formik>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.any,
};

export default Login;

function LoginFormHeader({ title }) {
  return <h2 className="cl-login-form-header-title">{title}</h2>;
}

LoginFormHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

function LoginForm() {
  return (
    <Form>
      <LoginFormInput type="text" name="username" desc="Username" placeholder="Enter your username" />
      <LoginFormInput type="password" name="password" desc="Password" placeholder="Enter your password" />
      <LoginFormButton title="Log in" />
    </Form>
  );
}

function LoginFormButton({ title }) {
  return (
    <div className="cl-login-form-row cl-login-form-button ">
      <button type="submit">
        {title}
      </button>
    </div>
  );
}

LoginFormButton.propTypes = {
  title: PropTypes.string.isRequired,
};

function LoginFormInput({
  type, name, desc, placeholder,
}) {
  return (
    <div className="cl-login-form-row">
      <label>{desc}</label>
      <Field type={type} name={name} placeholder={placeholder} />
      <ErrorMessage name={name}>
        {
          (msg) => <label className="cl-login-form-error-message">{msg}</label>
        }
      </ErrorMessage>
    </div>
  );
}

LoginFormInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};
