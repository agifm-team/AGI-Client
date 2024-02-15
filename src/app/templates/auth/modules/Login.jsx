import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';

import PropTypes from 'prop-types';

import Text from '../../../atoms/text/Text';
import * as auth from '../../../../client/action/auth';
import { getBaseUrl } from '../../../../util/matrixUtil';
import Button from '../../../atoms/button/Button';
import IconButton from '../../../atoms/button/IconButton';
import Input from '../../../atoms/input/Input';
import ContextMenu, { MenuItem } from '../../../atoms/context-menu/ContextMenu';

import LoadingScreen from './LoadingScreen';

import { EMAIL_REGEX, BAD_EMAIL_ERROR } from './regex';
import { normalizeUsername, isValidInput } from './validator';
import Register from './Register';

import SSOButtons from '../../../molecules/sso-buttons/SSOButtons';

function Login({ hsConfig, loginFlow, baseUrl }) {
  const ssoProviders = loginFlow?.filter((flow) => flow.type === 'm.login.sso')[0];
  const [typeIndex, setTypeIndex] = useState(0);
  const [passVisible, setPassVisible] = useState(false);
  const loginTypes = ['Username', 'Email'];
  const isPassword = loginFlow?.filter((flow) => flow.type === 'm.login.password')[0];

  const [isVisible, setIsVisible] = useState(false);
  const requestClose = () => setIsVisible(false);
  const [type, setType] = useState('login');

  const initialValues = {
    username: '',
    password: '',
    email: '',
    other: '',
  };

  const validator = (values) => {
    const errors = {};
    if (typeIndex === 1 && values.email.length > 0 && !isValidInput(values.email, EMAIL_REGEX)) {
      errors.email = BAD_EMAIL_ERROR;
    }
    return errors;
  };
  const submitter = async (values, actions) => {
    let userBaseUrl = baseUrl;
    let { username } = values;
    const mxIdMatch = username.match(/^@(.+):(.+\..+)$/);
    if (typeIndex === 0 && mxIdMatch) {
      [, username, userBaseUrl] = mxIdMatch;
      userBaseUrl = await getBaseUrl(userBaseUrl);
    }

    return auth
      .login(
        userBaseUrl,
        typeIndex === 0 ? normalizeUsername(username) : undefined,
        typeIndex === 1 ? values.email : undefined,
        values.password,
      )
      .then(() => {
        actions.setSubmitting(true);
        window.location.reload();
      })
      .catch((error) => {
        let msg = error.message;
        if (msg === 'Unknown message') msg = 'Please check your credentials';
        actions.setErrors({
          password: msg === 'Invalid password' ? msg : undefined,
          other: msg !== 'Invalid password' ? msg : undefined,
        });
        actions.setSubmitting(false);
      });
  };

  return (
    <>
      <Modal
        show={isVisible}
        dialogClassName="modal-lg modal-dialog-centered modal-dialog-scrollable"
        onHide={requestClose}
      >
        <Modal.Header className="noselect" closeButton>
          <Modal.Title className="h5 emoji-size-fix">
            {type === 'login' ? 'Login' : 'Register'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === 'login' ? (
            <>
              <div className="auth-form__heading m-0 mt-1">
                <h5 className="m-0">Welcome back</h5>
                {isPassword && (
                  <ContextMenu
                    placement="right"
                    content={(hideMenu) =>
                      loginTypes.map((type2, index) => (
                        <MenuItem
                          key={type2}
                          onClick={() => {
                            hideMenu();
                            setTypeIndex(index);
                          }}
                        >
                          {type2}
                        </MenuItem>
                      ))
                    }
                    render={(toggleMenu) => (
                      <Button onClick={toggleMenu} faSrc="fa-solid fa-chevron-down">
                        {loginTypes[typeIndex]}
                      </Button>
                    )}
                  />
                )}
              </div>

              {isPassword && (
                <Formik initialValues={initialValues} onSubmit={submitter} validate={validator}>
                  {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                    <>
                      {isSubmitting && <LoadingScreen message="Login in progress..." />}
                      <form className="auth-form" onSubmit={handleSubmit}>
                        {typeIndex === 0 && (
                          <div>
                            <Input
                              values={values.username}
                              name="username"
                              onChange={handleChange}
                              label="Username"
                              type="username"
                              required
                            />
                          </div>
                        )}
                        {errors.username && (
                          <Text className="auth-form__error" variant="b3">
                            {errors.username}
                          </Text>
                        )}
                        {typeIndex === 1 && (
                          <div>
                            <Input
                              values={values.email}
                              name="email"
                              onChange={handleChange}
                              label="Email"
                              type="email"
                              required
                            />
                          </div>
                        )}
                        {errors.email && (
                          <Text className="auth-form__error" variant="b3">
                            {errors.email}
                          </Text>
                        )}

                        <div className="auth-form__pass-eye-wrapper">
                          <div>
                            <Input
                              values={values.password}
                              name="password"
                              onChange={handleChange}
                              label="Password"
                              type={passVisible ? 'text' : 'password'}
                              required
                            />
                          </div>
                          <IconButton
                            onClick={() => setPassVisible(!passVisible)}
                            fa={passVisible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}
                            size="extra-small"
                          />
                        </div>

                        {errors.password && (
                          <Text className="auth-form__error" variant="b3">
                            {errors.password}
                          </Text>
                        )}
                        {errors.other && (
                          <Text className="auth-form__error" variant="b3">
                            {errors.other}
                          </Text>
                        )}
                        <div className="auth-form__btns">
                          <Button variant="primary" type="submit" disabled={isSubmitting}>
                            Login
                          </Button>
                        </div>
                      </form>
                    </>
                  )}
                </Formik>
              )}
            </>
          ) : (
            <Register
              registerInfo={hsConfig.register}
              loginFlow={hsConfig.login.flows}
              baseUrl={hsConfig.baseUrl}
            />
          )}

          {hsConfig !== null && (
            <>
              {/* (type === 'login' && <a className="very-small" href="#!">Forgot password?</a>) */}

              <center>
                <p className="small">
                  {`${type === 'login' ? "Don't have" : 'Already have'} an account?`}{' '}
                  <a href="#!" onClick={() => setType(type === 'login' ? 'register' : 'login')}>
                    {type === 'login' ? 'Register here' : 'Login here'}
                  </a>
                </p>

                {type === 'login' ? (
                  <div>
                    <SSOButtons
                      type="sso"
                      identityProviders={ssoProviders.identity_providers}
                      baseUrl={baseUrl}
                    />
                  </div>
                ) : null}
              </center>
            </>
          )}
        </Modal.Body>
      </Modal>
      <a
        onClick={(event) => {
          setIsVisible(!isVisible);
          event.preventDefault();
        }}
        className="nav-link text-bg-force"
        href="#"
      >
        Login
      </a>
    </>
  );
}

Login.propTypes = {
  loginFlow: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  baseUrl: PropTypes.string.isRequired,
};

export default Login;
