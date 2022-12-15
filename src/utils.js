// добавил эту функцию, чтобы когда беру данные из localstorage (isAuth: boolean), переводить их в нужный тип данных. localstorage строки возвращает.

export function parse(type) {
    return typeof type == 'string' ? JSON.parse(type) : type;
}