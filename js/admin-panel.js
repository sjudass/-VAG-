/*Обработчик для события загрузки объекта window (страница)*/
window.onload = function () {
    /*Вызываем метод генерации строк таблицы заявок*/
    generateRequestsHTMLBlock();
}

/*Получаем данные по заявкам из localStorage*/
function getRequests() {
    /*Получаем в переменную requests заявки из localStorage по ключу requests*/
    let requests = localStorage.getItem('requests');

    /*Если заявок нет, возвращаем пустой массив*/
    if (requests === null) {
        return []
    }

    /*Возвращаем список заявок, преобразовывая строку в JSON объект (данные в localStorage хранятся исключительно в виде строки)*/
    return JSON.parse(requests);
}

/*Метод генерации строк таблицы заявок*/
function generateRequestsHTMLBlock() {
    /*Записываем в переменную requests данные, полученные из функции getRequests*/
    let requests = getRequests(),
        /*Находим тег tbody таблицы заявок по идентификатору requests*/
        requestsBlock = document.getElementById('requests');

    /*Проходимся циклом по массиву заявок, передавая в callback-функцию заявку (request)*/
    requests.forEach(function (request) {
        /*Разбиваем указанный текст во втором параметре функции как HTML и вставляет полученные узлы (nodes) в DOM дерево в позицию перед закрытием (beforeend)*/
        requestsBlock.insertAdjacentHTML("beforeend", `<tr>
            <td>${request.lastName + " " + request.firstName}</td>
            <td>${request.email}</td>
            <td>${request.phone}</td>
            <td>${request.model}</td>
            <td>${request.service}</td>
        </tr>`)
    })
}