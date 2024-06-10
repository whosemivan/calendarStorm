import React, { useContext } from 'react';
import styles from './style.module.scss';
import { parse } from '../../utils.js';
import { Link } from 'react-router-dom';
import browserHistory from '../../browser-history.js';
import { Ctx } from '../App';

const Header = ({ isAuth, setIsAuth, setIsCopy, setIsFeedbackForm }) => {
  const { socket, access, calendarName, calendarId } = useContext(Ctx);

  // функция выхода
  const logOut = (evt) => {
    evt.preventDefault();
    localStorage.setItem('isAuth', false);
    setIsAuth(parse(localStorage.getItem('isAuth')));
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    browserHistory.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__wrapper}>
        {access ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.querySelector('[name="calendarName"]');
              socket.emit(
                'calendars:put',
                {
                  id: calendarId,
                  title: input.value,
                },
                (data) => console.log(data)
              );
            }}
          >
            <input
              type='text'
              name='calendarName'
              className={[styles.header__title, styles.header__title_input].join(' ')}
              defaultValue={calendarName}
              placeholder='Calendar name'
            />
          </form>
        ) : (
          <p className={styles.header__title}>{calendarName}</p>
        )}
        <div className={styles.header__btn_block}>
          {/* parse чтобы когда беру данные из localstorage (isAuth: boolean), переводить их в нужный тип данных. localstorage строки возвращает. в зависимости авторизован пользователь или нет, отображаются разные кнопки */}
          {parse(isAuth) ? (
            <button
              className={[styles.header__link, styles.header__linkLogout].join(' ')}
              onClick={logOut}
            >
              Выйти
            </button>
          ) : (
            <Link className={[styles.header__link, styles.header__linkSignin].join(' ')} to='/'>
              Войти
            </Link>
          )}

          <button
            className={[styles.header__btn, styles.header__link, styles.header__btnFeedback].join(' ')}
            type='button'
            onClick={() => {
              setIsFeedbackForm(true);
            }}
          >
            Обратная связь
          </button>
          <button
            className={styles.header__btn}
            type='button'
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              setIsCopy(true);
            }}
          >
            <span className='visually-hidden'>Share</span>
            <svg
              className={styles.header__btnIcon}
              width='21'
              height='17'
              viewBox='0 0 21 17'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M21 7.93333L12.8333 0V4.53333C4.66667 5.66667 1.16667 11.3333 0 17C2.91667 13.0333 7 11.22 12.8333 11.22V15.8667L21 7.93333Z'
                fill='#312E2E'
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
