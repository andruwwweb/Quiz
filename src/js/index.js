import '../css/main.css';
import '../css/onest.css';
import staticImage from '../assets/static-image.png'
import nextArrow from "../assets/button-next-arrow.svg"
import prevArrow from "../assets/button-prev-arrow.svg"
import selectSvg from "../assets/select.svg"
import finallyImage from "../assets/finally-image.png"
import unsuccessImage from "../assets/unsuccess.jpeg"

document.addEventListener('DOMContentLoaded', () => {
    //Главный вопрос: селекты в макете сделаны немного непонятно и идут против ТЗ. 1) Как делать проверку выбранного варианта в селекте если в макете установлено выбранным первым значение, просто отслеживать рандомные клики внутри родителя? Цель проверки не допустить ввод пустого значения или заставить пользователя покликать для каких-то сеошных целей? 2) Как дефолтным значением селекта может быть элемент не из списка option? Или это label (хотя на него не похоже) или все таки значение option? Два таба, которые по идее делаются по одному шаблону имеют отличия, которые займут дополнительное время на верстку, а это не самое лучшее, если эта разница в двух шаблонных табах является небольшим недочетом, а не потоком вдохновения дизайнера. П.с. не преследую цели обидеть кого-то и осудить чей-то усердный труд. Просто объясняю мысли, приходящие в процессе работы. ТАКЖЕ замечу, я не делил всесь скрипт на модули просто по той причине, что здесь не так много кода и реализация всего функционала описана словами.

    //Динамическая стилизация инпутов: тут все просто - по клику мы очищаем все добавленные классы везде и добавляем класс с нужными стилями к кликуемому элементу
    const inputsRadio = document.querySelectorAll('.input_box input');
    const inputsWrapper = document.querySelectorAll('.input_box');
    inputsRadio.forEach(item => {
        item.addEventListener('click', () => {
            clearActiveColors()
            item.parentElement.style.cssText = 'background-color: white; border: 1px solid black'
        })
    });
    //Функция очисти стилей/установки дефолтных стилей
    function clearActiveColors() {
        inputsWrapper.forEach(item => item.style.cssText = 'background-color: #F5F5F5; border: 1px solid #F5F5F5')
    };

    //Переключение слайдов: мы тут создаем функцию, которая принимает в себя аргументом индекс и далее элементу из НодЛиста по этому индексу задает класс активности. Также мы тут заполняем счетчик табов с помощью того же индекса+1 и общее число слайдов берем из длины псевдомассива элементов. Еще тут создаем функцию очищающую активный класс.
    const tabs = document.querySelectorAll('.dynamic_content');
    const currentNumbers = document.querySelectorAll('.currentNumber');
    const commonNumbers = document.querySelectorAll('.commonNumber');
    function showTab(index) {
        tabs[index].classList.add('dynamic_content-active');
        currentNumbers[index].textContent = index + 1;
        commonNumbers.forEach(item => {
            item.textContent = commonNumbers.length;
        })
    };
    //Функция очистки активных классов для табов
    function clearTabs() {
        tabs.forEach(tab => {
            if (tab.classList.contains('dynamic_content-active')) {
                tab.classList.remove('dynamic_content-active');
            }
        })
    };
    //Вызов функции с аргументом 0 чтобы сделать дефолтный таб при загрузке страинцы
    showTab(0)

    //Кнопки вперед: тут мы создаем функцию, которая следит за выбором радио-кнопки. Работает так: создаем переменную с нулем, для каждого активного таба берем все инпуты, проверям через цикл каждый из них на правдивость свойства checked и если при проверке приходит true, плюсуем в переменную единичку, а если нет, то она остается с нулем. Результатом выполнения функции возвращаем переменную, пропущенную через цикл. Потом мы будем проверять значение этой переменной, чтобы понять какое действие нам делать по клику.
    const nextButtons = document.querySelectorAll('.next_button');
    function checkInputs() {
        let inputChecked = 0;
        const currentInputs = document.querySelectorAll('.dynamic_content-active input')
        currentInputs.forEach(input => {
            if (input.checked) {
                inputChecked += 1;
            }
        })
        return inputChecked;
    }

    //Слушаем кнопки: здесь мы для каждой кнопки вешаем слушатель клика и начинаем проверку. Берем функцию checkInputs и проверяем что она нам возвращает. если 0 - просто отменяем дефолное действие кнокпи, если больше нуля ИИ наш таб является табом в котором существуют инпуты с типом радио (проверяем через наличие класса) - запусакем функцию очистки активных классов и в функцию добавления класса передаем аргументом индекс кнопки +1. Кнопка назад также очищает активные классы и запускает функцию добавления класса с аргументом идекс (мы ведь помним что индексы начинаются с 0 и поэтому индекс кнопки нам идельно подход)
    nextButtons.forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            if (checkInputs() > 0 || btn.parentElement.classList.contains('select_buttons')) {
                e.preventDefault()
                clearTabs()
                showTab(i+1);
            }
            else {
                e.preventDefault()
                console.log('lala')
            }
        })
    })
    const prevButtons = document.querySelectorAll('.prev_button');
    prevButtons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            clearTabs()
            showTab(i)
        })
    })

    //Последний таб: он у нас другой, поэтому те кнокпи которые у нас уже есть, не нужны, таким образом создаем новый шаблон и задаем еиу общетабовский класс, далее мы валидируем форму и по нажатию на кнопку отправляем запрос на серв, в зависимости от ответа рендерим один и тот же блок, но с разным контентом, который передаем в функцию рендера аргументами
    const parent = document.querySelector('.finally_template_wrapper')
    const finallyForm = document.querySelector('.finally_template');
    finallyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(finallyForm);
        const jsonFormData = JSON.stringify(Object.fromEntries(data.entries()))

        postData('https://example.com/url/forms/', jsonFormData)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                console.log(data);
                finalModalStatus('Отлично, спасибо!', 'Мы отправили подборку вам на почту. Если подборка не приходит — проверьте спам, возможно, она попала туда.', './assets/finaly-image.png')
            })
            .catch(error => {
                console.error(error);
                finalModalStatus('Что-то пошло не так...', 'У нас не получилось связаться с сервером, провертье подключение к сети, перезагрузите страницу и попробуйте еще раз.', './assets/unsuccess.jpeg')
            })
            .finally(() => {
                finallyForm.reset()
            })
    });

    //Функция рендера внутренностей последнего блока после отправки формы: дисплейноним весь существующий контент в табе, создаем элемент div, добавляем заранее подготовленный класс, задаем внутренности, и определяем в них данные приходящие из аргументов. Потом просто аппендим элемент в поток.
    function finalModalStatus(header, message, absolutePath) {
        document.querySelector('.finally_template_wrapper div').style.display = 'none'
        document.querySelector('.finally_template_wrapper form').style.display = 'none'
        const finallyModal = document.createElement('div');
        finallyModal.classList.add('modal_message_template');
        finallyModal.innerHTML = `
        <img src="${absolutePath}">
        <h2>${header}</h2>
        <p>${message}</p>`;
        parent.append(finallyModal);
    };
    //Общая функция для пост запроса на сервер: используем FetchAPI и async/await
    async function postData(url, data) {
        let result = await fetch(url, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: data
        })
        return result
    };
})




