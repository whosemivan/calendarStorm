import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { Ctx } from '../App';
import { Link } from 'react-router-dom';
import browserHistory from '../../browser-history.js';

const SignIn = ({ setIsAuth, isAuth, authRedirectPath }) => {
  const [login, setLogin] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);

  const { api, setRefToken, setAccToken } = useContext(Ctx);

  console.log(authRedirectPath);

  // если юзер уже авторизован, не получится попасть на страницу авторизации
  useEffect(() => {
    if (isAuth && authRedirectPath !== '') {
      browserHistory.push(authRedirectPath);
    } else if (isAuth) {
      browserHistory.push('/calendar/');
    }
  }, [isAuth]);

  // функция делает запрос на авторизацию
  const handler = (e) => {
    e.preventDefault();
    api
      .logIn({ login: login, password: pwd })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Пользователь найден.') {
          localStorage.setItem('isAuth', true);
          setIsAuth(true);
          setErr(false);

          setAccToken(data.data.accessToken);
          localStorage.setItem('accessToken', data.data.accessToken);

          setRefToken(data.data.refreshToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
        } else {
          setErr(true);
          console.log('Err');
        }
        setLogin('');
        setPwd('');
      });
  };

  return (
    <section className='signin'>
      <h1 className='signin__title'>Sign In</h1>
      <form onSubmit={handler} className='signin__form'>
        <input
          className='signin__input'
          id='login'
          name='login'
          type='text'
          placeholder='Login'
          onChange={(e) => {
            setLogin(e.target.value);
            setErr(false);
          }}
          value={login}
        />
        <input
          className='signin__input'
          id='password'
          name='password'
          type='password'
          placeholder='Your password'
          onChange={(e) => {
            setPwd(e.target.value);
            setErr(false);
          }}
          value={pwd}
        />
        <button className='signin__btn' type='submit'>
          Submit
        </button>
        {/* ошибки */}
        {err && (
          <p className='signin__info-err'>
            Something go wrong, please try again
          </p>
        )}
      </form>
      <Link className='signin__link' to='/signup'>
        Sign Up
      </Link>
    </section>
  );
};

export default SignIn;
