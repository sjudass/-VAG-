/*Обработчик для события загрузки объекта window (страница)*/
window.onload = function () {
    /*Вызываем функцию генерации каталога услуг*/
    generateCatalogHTMLBlock();
    /*Вызываем функцию генерации отзывов*/
    generateRatesHTMLBlock();
    /*Вешаем submit событие на форму requestForm c валидацией данных от Bootstrap, если форма успешно проходит валидацию, выполняем функцию createRequest */
    submitEventForFormWithValidateFields('requestForm', createRequest)
    /*Вешаем submit событие на форму loginForm c валидацией данных от Bootstrap, если форма успешно проходит валидацию, выполняем функцию login */
    submitEventForFormWithValidateFields('loginForm', login)
    /*Вызываем функцию создания пользователя-администратора в localStorage*/
    createAdminUser();
}

//Получаем данные по отзывам из файла и формируем html контент
function getReviews() {
    /*Получаем в переменную reviews отзывы из localStorage по ключу reviews*/
    let reviews = localStorage.getItem('reviews');

    /*Если отзывов нет, получаем данные из файла ../resources/reviews.json*/
    if (reviews === null) {
        /*Выполняем http-запрос к файлу ../resources/reviews.json*/
        fetch('../resources/reviews.json')
            /*Преобразовываем ответ запроса в JSON объект*/
            .then(res => res.json())
            /*Данные из файла записываем в переменную data*/
            .then((data) => {
                /*Записываем полученные данные в localStorage и переменную reviews, предварительно преобразовывая в строку (данные в localStorage хранятся исключительно в виде строки)*/
                localStorage['reviews'] = reviews = JSON.stringify(data.reviews);
            })
    }

    /*Возвращаем список отзывов, преобразовывая строку в JSON объект*/
    return JSON.parse(reviews);
}

//Получаем данные по услугам из файла и формируем html контент
function getServices() {
    /*Получаем в переменную services список услуг из localStorage по ключу services*/
    let services = localStorage.getItem('services');

    /*Если услуг нет, получаем данные из файла ../resources/services.json*/
    if (services === null) {
        /*Выполняем http-запрос к файлу ../resources/services.json*/
        fetch('../resources/services.json')
            /*Преобразовываем ответ запроса в JSON объект*/
            .then(res => res.json())
            /*Данные из файла записываем в переменную data*/
            .then((data) => {
                /*Записываем полученные данные в localStorage и переменную services, предварительно преобразовывая в строку (данные в localStorage хранятся исключительно в виде строки)*/
                localStorage['services'] = services = JSON.stringify(data.services);
            })
    }

    /*Возвращаем список услуг, преобразовывая строку в JSON объект*/
    return JSON.parse(services);
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

/*Функция генерации каталога услуг*/
function generateCatalogHTMLBlock() {
    /*Записываем в переменную services данные, полученные из функции getServices*/
    let services = getServices();
    /*Находим блок с идентификатором services в DOM-дереве*/
    let servicesBlock = document.getElementById('services');
    /*Проходимся циклом по массиву услуг, передавая в callback-функцию услугу (service)*/
    services.forEach(function (service) {
        /*Разбиваем указанный текст во втором параметре функции как HTML и вставляет полученные узлы (nodes) в DOM дерево в позицию перед закрытием (beforeend)*/
        servicesBlock.insertAdjacentHTML("beforeend", `<div class="col">
            <div class="card shadow-lg">
                <div class="card-img-top">
                    <img src="${service.image}" alt="${service.title}">
                </div>
                <div class="card-body">
                    <div class="card-description d-flex justify-content-between align-items-center fw-bold">
                        <div class="w-75 fs-6">${service.title}</div>
                        <div class="fs-4 float-end">${service.coast}</div>
                     </div>
                    <p class="text-muted pt-3">
                        ${service.description}
                    </p>
                    <a href="#request" class="btn btn-sm btn-outline-secondary">Оформить заявку</a>
                </div>
            </div>
        </div>`)
    })
}

/*Функция генерации отзывов*/
function generateRatesHTMLBlock() {
    /*Записываем в переменную chunkedReviews данные, полученные из функции getServices, предварительно разбитые на части при помощи функции chunkArray*/
    let chunkedReviews = chunkArray(getReviews());
    /*Находим блок с идентификатором reviews в DOM-дереве*/
    let reviewsBlock = document.getElementById('reviews');
    /*Очищаем содержимое блока reviewsBlock*/
    reviewsBlock.innerHTML = '';
    /*Проходимся циклом по разбитым частям массива chunkedReviews, передавая в callback-функцию массив отзывов (reviews)*/
    chunkedReviews.forEach(function (reviews) {
        /*Инициализируем переменную cards, в которую в дальнейшем будем записывать сгенерированные HTML блоки отзывов */
        let cards = ``;
        /*Проходимся циклом по массиву отзывов, передавая в callback-функцию отзыв (review)*/
        reviews.forEach(function (review) {
            /*Добавляем в переменную cards HTML блоки для отзывов*/
            cards += `<div class="carousel-card col-md-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
                <h3 class="pb-3">${review.user}</h3>
                <p>${review.comment}</p>
            </div>`
        });

        /*Разбиваем указанный текст во втором параметре функции как HTML и вставляет полученные узлы (nodes) в DOM дерево в позицию перед закрытием (beforeend)*/
        reviewsBlock.insertAdjacentHTML("beforeend", `<div class="carousel-item">
            <div class="container">
                <div class="row text-center">
                    ${cards}
                </div>
            </div>
        </div>`);
    });

    /*Находим первый DOM-элемент с классом carousel-item и добавляем ему класс active (чтобы отображалась карусель отзывов)*/
    document.getElementsByClassName('carousel-item')[0].classList.add('active');
}

/*Функция разбивки массива (array) на несколько массивов размером в perChunk элементов (необходимо для корректной генерации карусели отзывов)*/
function chunkArray(array, perChunk = 3) {
    /*Возвращаем при помощи функции reduce разбитый на части массив resultArray*/
    return array.reduce((resultArray, item, index) => {
        /*Определяем индекс массива, в который попадёт элемент исходного массива*/
        const chunkIndex = Math.floor(index/perChunk)

        /*Если chunk-массива нет в результирующем массива, то мы его создаем*/
        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        /*Записываем элемент исходного массива в chunk-массив*/
        resultArray[chunkIndex].push(item)

        /*Возвращаем разбитый на части массив*/
        return resultArray
    }, [])
}

/*Функция предназначена для добавления submit события на форму, идентификатор которой передан в качестве первого входного параметра,
 c валидацией данных от Bootstrap. Если форма успешно проходит валидацию, вызываем функцию, переданную в качестве второго входного параметра*/
function submitEventForFormWithValidateFields(formId, submitFunction) {
    // Получаем форму, к которой мы хотим применить пользовательские стили проверки Bootstrap
    let form = document.getElementById(formId)
    /*Вешаем прослушку на событие submit формы*/
    form.addEventListener('submit', function (event) {
        /*Отключаем действие по умолчанию для события submit (чтобы не перезагружалась страница)*/
        event.preventDefault()
        /*Если форма не прошла валидацию данных Bootstrap*/
        if (!form.checkValidity()) {
            /*Метод stopPropagation прекращает дальнейшую передачу текущего события.*/
            event.stopPropagation()
            /*Добавляем к форме класс was-validated*/
            form.classList.add('was-validated')
        } else {
            /*Если форма прошла валидацию, вызываем функцию, переданную вторым параметром в функцию submitEventForFormWithValidateFields*/
            submitFunction(form)
        }
    }, false)

}

/*Функция получает данные из формы по созданию заявки и записывает данные в localStorage*/
function createRequest(form) {
    /*Записываем поля формы в переменные*/
    const firstName = form.querySelector('[name="firstName"]'), //получаем поле firstName
        lastName = form.querySelector('[name="lastName"]'), //получаем поле lastName
        email = form.querySelector('[name="email"]'), //получаем поле email
        phone = form.querySelector('[name="phone"]'), //получаем поле phone
        model = form.querySelector('[name="model"]'), //получаем поле model
        service = form.querySelector('[name="service"]'); //получаем поле service

    /*Записываем данные из полей формы в JSON объект data*/
    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        model: model.value,
        service: service.value
    };

    /*Получаем в переменную requests заявки из localStorage по ключу requests*/
    let requests = getRequests()
    /*Добавляем в конец массива заявку, полученную из формы*/
    requests.push(data)
    /*Обновляем данные по заявкам в хранилище localStorage*/
    localStorage['requests'] = JSON.stringify(requests)
    /*Очищаем поля формы*/
    form.reset()
    /*Передаем в переменную modal модальное окно Bootstrap с идентификатором requestCreatedModal*/
    let modal = new bootstrap.Modal(document.getElementById('requestCreatedModal'))
    /*Показываем пользователю модальное окно (Заявка успешно создана)*/
    modal.show();
}

/*Функция создает в хранилище localStorage пользователя admin (для авторизации пользователя в системе и получения доступа к Админ-Панели)*/
function createAdminUser() {
    /*Получаем в переменную admin пользователя из localStorage по ключу admin*/
    let admin = localStorage.getItem('admin');
    /*Если пользователя в хранилище localStorage нет, мы его создаем*/
    if (admin === null) {
        localStorage['admin'] = JSON.stringify({"login": "admin", "password": "admin"})
    }
}

/*Функция авторизации пользователя в системе через модальное окно*/
function login(form) {
    /*Записываем поля формы в переменные*/
    const login = form.querySelector('[name="login"]'), //получаем поле login
        password = form.querySelector('[name="password"]'), //получаем поле password
        storageData = JSON.parse(localStorage.getItem('admin')); //Получаем данные пользователя из localStorage

    /*Если введенные данные формы совпадают с данными пользователя из хранилища localStorage,
    авторизовываем пользователя в системе и перенаправляем в Панель Администратора, в противном случае выводим ошибку*/
    if (login.value === storageData.login && password.value === storageData.password) {
        location.href = 'admin-panel.html'
    } else {
        form.getElementsByClassName('text-danger')[0].innerHTML = "Пользователь не найден"
    }
}