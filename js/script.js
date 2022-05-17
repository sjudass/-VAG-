window.onload = function () {
    generateCatalogHTMLBlock();
    generateRatesHTMLBlock();
    submitEventForFormWithValidateFields('requestForm', createRequest)
}

//Получаем данные по отзывам из файла и формируем html контент
function getReviews() {
    let reviews = localStorage.getItem('reviews');

    if (reviews === null) {
        fetch('../resources/reviews.json')
            .then(res => res.json())
            .then((data) => {
                localStorage['reviews'] = reviews = JSON.stringify(data.reviews);
            })
    }

    return JSON.parse(reviews);
}

//Получаем данные по услугам из файла и формируем html контент
function getServices() {
    let services = localStorage.getItem('services');

    if (services === null) {
        fetch('../resources/services.json')
            .then(res => res.json())
            .then((data) => {
                localStorage['services'] = services = JSON.stringify(data.services);
            })
    }

    return JSON.parse(services);
}

//Получаем данные по заявкам из localStorage
function getRequests() {
    let requests = localStorage.getItem('requests');

    if (requests === null) {
        return []
    }

    return JSON.parse(requests);
}

function generateCatalogHTMLBlock() {
    let services = getServices();

    let servicesBlock = document.getElementById('services');
    services.forEach(function (service) {
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

function generateRatesHTMLBlock() {
    let chunkedReviews = chunkArray(getReviews());
    let reviewsBlock = document.getElementById('reviews');
    reviewsBlock.innerHTML = '';
    chunkedReviews.forEach(function (reviews) {
        let cards = ``;

        reviews.forEach(function (review) {
            cards += `<div class="carousel-card col-md-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
                <h3 class="pb-3">${review.user}</h3>
                <p>${review.comment}</p>
            </div>`
        });

        reviewsBlock.insertAdjacentHTML("beforeend", `<div class="carousel-item">
            <div class="container">
                <div class="row text-center">
                    ${cards}
                </div>
            </div>
        </div>`);
    });

    document.getElementsByClassName('carousel-item')[0].classList.add('active');
}

function chunkArray(array, perChunk = 3) {
    return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}

function submitEventForFormWithValidateFields(formId, submitFunction) {
    // Получаем форму, к которой мы хотим применить пользовательские стили проверки Bootstrap
    let form = document.getElementById(formId)

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        if (!form.checkValidity()) {
            event.stopPropagation()
            form.classList.add('was-validated')
        } else {
            submitFunction(form)
        }
    }, false)

}

function createRequest(form) {
    const firstName = form.querySelector('[name="firstName"]'), //получаем поле firstName
        lastName = form.querySelector('[name="lastName"]'), //получаем поле lastName
        email = form.querySelector('[name="email"]'), //получаем поле email
        phone = form.querySelector('[name="phone"]'), //получаем поле phone
        model = form.querySelector('[name="model"]'), //получаем поле model
        service = form.querySelector('[name="service"]'); //получаем поле service

    const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phone: phone.value,
        model: model.value,
        service: service.value
    };

    let requests = getRequests()
    requests.push(data)
    localStorage['requests'] = JSON.stringify(requests)

    form.reset()

    let modal = new bootstrap.Modal(document.getElementById('requestCreatedModal'))
    modal.show();
}