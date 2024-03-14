import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import browserHistory from '../../browser-history.js';
import { Ctx } from '../App';
import { Link } from 'react-router-dom';

const SignUp = ({ setIsAuth, isAuth, authRedirectPath }) => {
  const [login, setLogin] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);

  const { api, setRefToken, setAccToken } = useContext(Ctx);


  // если юзер уже авторизован, не получится попасть на страницу авторизации

  useEffect(() => {
    if (isAuth && authRedirectPath !== '') {
      browserHistory.push(authRedirectPath);
    } else if (isAuth) {
      browserHistory.push('/calendar/');
    }
  }, [isAuth]);

  // функция регистрирует пользователя

  const handler = (e) => {
    e.preventDefault();
    api
      .signUp({ login: login, password: pwd })
      .then((res) => res.json())
      .then((data) => {
        console.log(login);
        console.log(data.message);

        if (data.message === 'Пользователь создан.') {
          console.log(data);
          localStorage.setItem('isAuth', true);
          setIsAuth(true);
          setErr(false);

          setAccToken(data.data.accessToken);
          localStorage.setItem('accessToken', data.data.accessToken);

          setRefToken(data.data.refreshToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);

          // browserHistory.push('/calendar/');
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
      <h1 className='signin__title'>Регистрация</h1>
      <form onSubmit={handler} className='signin__form'>
        <input
          className='signin__input'
          id='login'
          name='login'
          type='text'
          placeholder='Логин'
          onChange={(e) => {
            setLogin(e.target.value);
            setErr(false);
          }}
          value={login}
        />
        <input
          minLength='8'
          className='signin__input'
          id='password'
          name='password'
          type='password'
          placeholder='Пароль'
          onChange={(e) => {
            setPwd(e.target.value);
            setErr(false);
          }}
          value={pwd}
        />
        <button className='signin__btn' type='submit'>
          Отправить
        </button>
        {/* ошибки */}
        {err && (
          <p className='signin__info-err'>
            Что-то пошло не так!
          </p>
        )}
      </form>
      <Link className='signin__link' to='/'>
        У меня уже есть аккаунт
      </Link>
    </section>
  );
};

export default SignUp;
