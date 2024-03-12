import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import './style.css';
import { Ctx } from '../App';
// ресайз
import { ResizableBox } from 'react-resizable';
import moment from 'moment';
import { useHistory } from "react-router-dom";


const Card = ({
  linesByIdWithCards,
  setClickedId,
  setIsVisibleDel,
  title,
  text,
  link,
  color,
  setColor,
  beginX,
  beginY,
  endX,
  endY,
  id,
  cardMaxWidth,
  setTitle,
  setText,
  setLink,
  notification,
  setIsNotificationEnable
}) => {
  const [isResize, setIsResize] = useState(false);
  const [isRemind, setIsRemind] = useState(notification);

  // размер одной ячейки
  const CALENDAR__CELL = 60;

  const { socket, access, api, accToken, setAuthRedirectPath } = useContext(Ctx);

  const history = useHistory();

  // isDragging - во время перетаскивания true
  // drag - отвечат за возможность таскания
  const [{ isDragging }, drag] = useDrag(
    useMemo(() => {
      return {
        // тип перетаскиваемого элемента
        type: 'event',
        // этот id получит ячейка в которую дропнули этот ивент
        item: {
          id,
          beginning: {
            X: beginX,
            Y: beginY,
          },
          ending: {
            X: endX,
            Y: endY,
          },
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      };
    }, [beginX, beginY, endX, endY, id])
  );

  const cardHandler = (evt) => {
    evt.stopPropagation();
    setClickedId(id);
    setTitle(title);
    setText(text);
    setLink(link);
    setColor(color);
    setIsNotificationEnable(notification);
  };

  // запрос на напоминалку в тг

  const onRemindBtnClick = () => {
    api
      .remindMe({
        accessToken: accToken,
        eventId: id,
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.statusCode === 401) {
          history.push('/', { from: history.location });
          setAuthRedirectPath(history.location.state.from.pathname);
          return;
        }

        if (data.message === 'Требуется авторизация по ссылке.') {
          window.open(data.data.botUrl);
        }
        setIsRemind(!isRemind);
      });
  };

  console.log(cardMaxWidth, title);

  if (access) {
    return (
      // css класс card-resize нужен для того, чтобы в onResizeStop найти элемент, который ресайзили и получить его ширину.
      <ResizableBox
        className={
          isResize ? 'card card-calendar card-resize' : 'card card-calendar'
        }
        style={isDragging && { zIndex: 0 }}
        width={
          endX !== beginX
            ? 60 *
              (Math.abs(
                moment(endX, 'DD.MM.YY').diff(moment(beginX, 'DD.MM.YY'), "days")
              ) + 1)
            : 60
        }
        height={60}
        draggableOpts={{ grid: [60, 0] }}
        onDrop={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        handle={(h, ref) => (
          <span
            style={isResize ? { opacity: 1 } : { opacity: 0.4 }}
            className={`card__handle-r custom-handle custom-handle-${h}`}
            ref={ref}
          />
        )}
        minConstraints={[60, 60]}
        maxConstraints={[Math.abs(cardMaxWidth) * 60, 60]}
        onResizeStart={() => setIsResize(true)}
        onResizeStop={(e) => {
          e.stopPropagation();
          const resizeWidth = document.querySelector('.card-resize');
          const width = +resizeWidth.style.width.slice(0, -2);
          const cellCount = width / CALENDAR__CELL;
          const newPos = moment(beginX, 'DD.MM.YY')
            .add(cellCount - 1, 'days')
            .format('DD.MM.YY');

          console.log(newPos);

          resizeWidth.classList.remove('card-resize');

          if (newPos !== endX) {
            // запрос на изменение ending.Y, срабатывает сразу после ресайза
            socket.emit(
              'events:put',
              {
                id: id,
                beginning: {
                  X: beginX,
                  Y: beginY,
                },
                ending: {
                  X: newPos,
                  Y: endY,
                },
              },
              (data) => {
                console.log(data);
              }
            );
          }

          setIsResize(false);
        }}
      >
        <div
          className="card"
          ref={drag}
          onDrop={(e) => e.stopPropagation()}
          onDrag={cardHandler}
          onClick={(e) => {
            cardHandler(e);
            setIsVisibleDel(true);
          }}
          style={{
            backgroundColor: '#' + color,
            opacity: isDragging ? 0.5 : 1,
          }}
        >
          <h3 className="card__title">{title}</h3>
          {endX !== beginX && (
            <button
              className={
                isRemind
                  ? 'card__button-remind card__button-remind--clicked'
                  : 'card__button-remind'
              }
              type="button"
              onClick={(evt) => {
                evt.stopPropagation();
                onRemindBtnClick();
              }}
            >
              <span className="visually-hidden">Напомнить</span>
            </button>
          )}
        </div>
      </ResizableBox>
    );
  } else {
    return (
      <ResizableBox
        className={
          isResize ? 'card card-calendar card-resize' : 'card card-calendar'
        }
        width={
          endX !== beginX
          ? 60 *
            (Math.abs(
              moment(endX, 'DD.MM.YY').diff(moment(beginX, 'DD.MM.YY'), "days")
            ) + 1)
          : 60
        }
        height={60}
      >
        <div
          className="card"
          onClick={(e) => {
            cardHandler(e);
            setIsVisibleDel(true);
          }}
          style={{
            backgroundColor: '#' + color,
            width: '100%',
            height: '100%',
          }}
        >
          <h3 className="card__title">{title}</h3>
          {endX !== beginX && (
            <button
              className={
                isRemind
                  ? 'card__button-remind card__button-remind--clicked'
                  : 'card__button-remind'
              }
              type="button"
              onClick={(evt) => {
                evt.stopPropagation();
                onRemindBtnClick();
              }}
            >
              <span className="visually-hidden">Напомнить</span>
            </button>
          )}
        </div>
      </ResizableBox>
    );
  }
};

export default Card;
