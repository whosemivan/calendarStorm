import React, { useEffect, useState, useContext, useRef } from 'react';
import moment from 'moment';
import './style.css';
import { Ctx } from '../App';
import CardCreator from '../CardCreator';
import CardEditor from '../CardEditor';
import CardHolder from '../CardHolder';
import browserHistory from '../../browser-history';
import Preloader from '../Preloader';
import { notification } from 'antd';

const Calendar = React.memo(({ isAuth }) => {
  const {
    api,
    socket,
    refToken,
    setAccToken,
    setRefToken,
    setIsAuth,
    setCalendarName,
    calendarId,
    setCalendarId,
    access,
    setAccess,
    setSocket
  } = useContext(Ctx);
  const [data, setData] = useState();

  const [isLoad, setIsLoad] = useState(false);
  const [isCalendarLoad, setIsCalendarLoad] = useState(false);
  const [isVisiblePopup, setIsVisiblePopup] = useState(false);
  const [isVisibleDel, setIsVisibleDel] = useState(false);

  const [clickedDate, setClickedDate] = useState([]);
  const [clickedId, setClickedId] = useState();
  const [color, setColor] = useState('C8F9C5');
  const [title, setTitle] = useState('');
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [cardId, setCardId] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');

  const [x, setX] = useState([]);
  const [y, setY] = useState([]);

  const [linesByIdWithCards, setLinesByIdWithCards] = useState([]);

  // для бесконечного скролла
  const containerRef = useRef(null);
  const [isFullRight, setIsFullRight] = useState(false);
  const [isFullLeft, setIsFullLeft] = useState(false);

  const [lastDate, setLastDate] = useState(moment().endOf('month'));
  const [firstDate, setFirstDate] = useState(moment().startOf('month'));

  const [dates, setDates] = useState(() => {
    const daysInMonth = [];
    const today = moment();
    const currentMonthDate = today.startOf('month');

    // Push current month's dates
    for (let i = 0; i < currentMonthDate.daysInMonth(); i++) {
      let newDay = currentMonthDate.clone().add(i, 'days');
      daysInMonth.push(newDay.format('DD.MM.YY'));
    }

    return daysInMonth;
  });

  const [firstDateBeforeEvent, setFirstDateBeforeEvent] = useState(
    moment(dates[0], 'DD.MM.YY')
  );

  const dateRef = useRef(null);
  const [isPreloader, setIsPreloader] = useState(false);

  useEffect(() => {
    if (socket) {
      // получает инфу о календаре: id, название, владелец каленадря, x, y
      socket.on('calendar:get', (data) => {
        // это временная фигня, которая нужна для ссылки на календарь. В будущем она будет получена при выборе календаря из списка.
        browserHistory.push(data.data._id);
        setAccess(data.access);
        setCalendarName(data.data.title);
        setCalendarId(data.data._id);
        setX(data.data.X);
        setY(data.data.Y);
        setIsCalendarLoad(true);
      });

      // получает массив с ивентами

      socket.on('events:get', (data) => {
        console.log(data);
        setData(data.data || []);

        let linesWithCards = {};
        console.log(data);
        data?.data?.forEach((card) => {
          if (linesWithCards[card.beginning.Y]) {
            linesWithCards[card.beginning.Y][card.beginning.X] = card;
          } else {
            linesWithCards[card.beginning.Y] = {};
            linesWithCards[card.beginning.Y][card.beginning.X] = card;
          }
        });
        setLinesByIdWithCards(linesWithCards);

        setIsLoad(true);
      });

      // обновляет токены, если connect_error

      socket.on('connect_error', (err) => {
        console.log(err);
        if (err.data.statusCode !== 200) {
          setAccToken('');

          // if (!refToken) {
          //   localStorage.setItem('isAuth', false);
          //   localStorage.removeItem('accessToken');
          //   localStorage.removeItem('refreshToken');
          //   setIsAuth(false);
          //   setRefToken('');
          //   return;
          // }

          api
            .refresh({ refreshToken: refToken })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.statusCode === 400) {
                localStorage.setItem('isAuth', false);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsAuth(false);
                setRefToken('');
                setAccToken('');
                console.log('ref');
                setSocket(api.socket(null));
              } else {
                console.log(data);
                localStorage.setItem('accessToken', data.data.accessToken);
                setAccToken(data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                setRefToken(data.data.refreshToken);

                socket.auth = { accessToken: data.data.accessToken };
                socket.connect();
              }
            });
        }
      });
    }
  }, [
    api,
    refToken,
    setAccToken,
    setIsAuth,
    setRefToken,
    socket,
    setAccess,
    setCalendarId,
    setCalendarName,
  ]);

  // добавил для корректной работы стейта

  useEffect(() => {
    console.log(`state is `, clickedDate);
  }, [clickedDate]);

  const getDatesNext = (date) => {
    // даты на след. месяц
    const daysInNextMonth = [];
    const monthNextMonthDate = moment(date).add(1, 'months').startOf('month');

    for (let i = 0; i < monthNextMonthDate.daysInMonth(); i++) {
      let newDay = monthNextMonthDate.clone().add(i, 'days');
      daysInNextMonth.push(newDay.format('DD.MM.YY'));
    }

    // const firstMonth = moment(dates[0], "DD.MM.YY").format("MM");
    // console.log(firstMonth);
    // const datesDeletedFirstMonth = dates.filter((item) => {
    //   return moment(item, "DD.MM.YY").format("MM") !== firstMonth;
    // })

    setDates(dates.concat(daysInNextMonth));
  };

  const getDatesLast = (date) => {
    // даты на пред. месяц
    const daysInLastMonth = [];
    const monthLastMonthDate = moment(date).add(-1, 'months').startOf('month');

    for (let i = 0; i < monthLastMonthDate.daysInMonth(); i++) {
      let newDay = monthLastMonthDate.clone().add(i, 'days');
      daysInLastMonth.push(newDay.format('DD.MM.YY'));
    }

    setDates([...daysInLastMonth, ...dates]);
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      // скролл достиг конца справа
      const isFullRightScroll =
        container.scrollLeft === container.scrollWidth - container.clientWidth;
      setIsFullRight(isFullRightScroll);

      // скролл достиг конца слева
      const isFullLeftScroll = container.scrollLeft === 0;
      setIsFullLeft(isFullLeftScroll);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isFullRight) {
      getDatesNext(lastDate);
    } else if (isFullLeft) {
      getDatesLast(firstDate);
    }
  }, [isFullLeft, isFullRight]);

  useEffect(() => {
    // сохраняет последнюю дату справа
    setLastDate(moment(dates[dates.length - 1], 'DD.MM.YY'));
  }, [dates]);

  useEffect(() => {
    // сохраняет первую дату справа
    setFirstDate(moment(dates[0], 'DD.MM.YY'));
  }, [dates]);

  useEffect(() => {
    console.log(dates);
    console.log(firstDateBeforeEvent);

    if (dateRef.current !== null && isFullLeft) {
      setIsPreloader(true);
      setTimeout(() => {
        containerRef.current.scrollLeft =
          dateRef.current.getBoundingClientRect().left;
        console.log(dateRef);
        console.log(dateRef.current.getBoundingClientRect().left);
        setFirstDateBeforeEvent(moment(dates[0], 'DD.MM.YY'));
        setIsPreloader(false);
      }, 200);
    }
  }, [dates]);

  useEffect(() => {
    if (dates.length > 180 && isFullRight) {
      setIsPreloader(true);

      setTimeout(() => {
        setDates(() => {
          const daysInMonth = [];
          const currentMonth = moment(dates[dates.length - 1], 'DD.MM.YY');
          const currentMonthDate = currentMonth.startOf('month');

          console.log(currentMonthDate);

          // Push current month's dates
          for (let i = 0; i < currentMonthDate.daysInMonth(); i++) {
            let newDay = currentMonthDate.clone().add(i, 'days');
            daysInMonth.push(newDay.format('DD.MM.YY'));
          }
          setFirstDateBeforeEvent(moment(daysInMonth[0], 'DD.MM.YY'));
          return daysInMonth;
        });

        setIsPreloader(false);
      }, 200);
    }

    if (dates.length > 180 && isFullLeft) {
      setIsPreloader(true);

      setTimeout(() => {
        setDates(() => {
          const daysInMonth = [];
          const currentMonth = moment(dates[0], 'DD.MM.YY');
          const currentMonthDate = currentMonth.startOf('month');

          console.log(currentMonthDate);

          // Push current month's dates
          for (let i = 0; i < currentMonthDate.daysInMonth(); i++) {
            let newDay = currentMonthDate.clone().add(i, 'days');
            daysInMonth.push(newDay.format('DD.MM.YY'));
          }

          return daysInMonth;
        });

        setIsPreloader(false);
      }, 200);
    }
  }, [dates]);

  useEffect(() => {
    console.log(clickedDate);
  }, clickedDate);

  const openNotification = () => {
    notification.open({
      message: 'Напоминания в нашем телеграм боте!',
      description:
        'Боишься забыть об интересующем тебя ивенте? Просто кликни на колокольчик на карточке ивента и наш Телеграм бот уведомит тебя за день до события!',
      duration: 5,
      placement: 'bottomRight',
    });
  };

  useEffect(() => {
    openNotification();
  }, []);

  return (
    <section className='calendar' ref={containerRef}>
      <h2 className='visually-hidden'>Calendar</h2>
      <div className='calendar__top-panel'>
        {/* <span className="calendar__month-name">{moment().format("MMMM")}</span> */}

        {isPreloader && <Preloader />}

        {
          // рендерит даты
          isCalendarLoad &&
            dates.map((item) => {
              // console.log(firstDate);

              return (
                <div
                  className='calendar__date'
                  key={moment(item, 'DD.MM.YY').format('YYYY-MM-DD')}
                  ref={
                    moment(firstDateBeforeEvent, 'DD.MM.YY').format(
                      'DD.MM.YY'
                    ) === moment(item, 'DD.MM.YY').format('DD.MM.YY')
                      ? dateRef
                      : null
                  }
                >
                  {moment(item, 'DD.MM.YY').format('DD') === '01' && (
                    <span className='calendar__date-month'>
                      {moment(item, 'DD.MM.YY').format('MMMM').slice(0, 3)}
                    </span>
                  )}
                  {moment(item, 'DD.MM.YY').format('DD')}
                </div>
              );
            })
        }
      </div>
      <div className='calendar__left-panel'>
        {
          // рендерит строки
          isCalendarLoad &&
            y.map((item, index) => {
              return (
                <div className='calendar__time' key={index}>
                  {access ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.target.querySelector('[name="name"]');
                        y[index] = input.value;
                        socket.emit(
                          'calendars:put',
                          {
                            id: calendarId,
                            Y: y,
                          },
                          (data) => console.log(data)
                        );
                      }}
                    >
                      <input
                        type='text'
                        name='name'
                        className='calendar__time-input'
                        required
                        defaultValue={item}
                      />
                    </form>
                  ) : (
                    <p className='calendar__time-input'>{item}</p>
                  )}
                </div>
              );
            })
        }
      </div>
      {
        // рендерит поля и ивенты (логика рендера ивентов в CardHolder)
        y.map((_, index) => {
          return (
            <div
              key={index}
              className={
                y.length - 1 === index
                  ? 'calendar__dates calendar__dates--last'
                  : 'calendar__dates'
              }
              style={{
                top: 60 * (+index + 1) + 105,
              }}
            >
              {dates.map((date, i) => (
                <CardHolder
                  linesByIdWithCards={linesByIdWithCards}
                  isAuth={isAuth}
                  key={i}
                  isVisiblePopup={isVisiblePopup}
                  setIsVisiblePopup={setIsVisiblePopup}
                  setClickedDate={setClickedDate}
                  setClickedId={setClickedId}
                  setTitle={setTitle}
                  setText={setText}
                  setLink={setLink}
                  setIsVisibleDel={setIsVisibleDel}
                  clickedDate={clickedDate}
                  index={index}
                  i={i}
                  isLoad={isLoad}
                  data={data}
                  color={color}
                  setColor={setColor}
                  cardMaxWidth={dates.length}
                  date={date}
                  dates={dates}
                  setIsNotificationEnable={setIsNotificationEnable}
                />
              ))}
            </div>
          );
        })
      }
      {/* попапы для создания и изменения ивентов */}
      <CardCreator
        color={color}
        setColor={setColor}
        setClickedDate={setClickedDate}
        isVisiblePopup={isVisiblePopup}
        setIsVisiblePopup={setIsVisiblePopup}
        clickedDate={clickedDate}
      />
      <CardEditor
        title={title}
        notification={isNotificationEnable}
        setIsNotificationEnable={setIsNotificationEnable}
        setTitle={setTitle}
        text={text}
        setText={setText}
        link={link}
        setLink={setLink}
        color={color}
        setColor={setColor}
        setIsVisibleDel={setIsVisibleDel}
        isVisibleDel={isVisibleDel}
        clickedId={clickedId}
        data={data}
        isLoad={isLoad}
      />
    </section>
  );
});

export default Calendar;
