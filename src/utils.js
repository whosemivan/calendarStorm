// добавил эту функцию, чтобы когда беру данные из localstorage (isAuth: boolean), переводить их в нужный тип данных. localstorage строки возвращает.

export function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}

// функция для того, чтобы вызвать скрол у юзера к определенному html эленемнту
export const scrollToElement = (element) => {
    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }
};