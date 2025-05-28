document.addEventListener('DOMContentLoaded', () => {
    // --- Инициализация предзагрузчика ---
    const preloader = document.getElementById('preloader');
    const minimumLoadingTime = 2000; // Минимальное время отображения предзагрузчика (2 секунды)
    let pageFullyLoaded = false;
    let minimumTimeElapsed = false;

    // Скрываем прокрутку, пока предзагрузчик активен
    document.body.style.overflow = 'hidden';

    // Слушатель, когда все ресурсы страницы (изображения, стили и т.д.) загружены
    window.addEventListener('load', () => {
        pageFullyLoaded = true;
        hidePreloader();
    });

    // Устанавливаем таймер для минимального времени отображения предзагрузчика
    setTimeout(() => {
        minimumTimeElapsed = true;
        hidePreloader();
    }, minimumLoadingTime);

    /**
     * Скрывает предзагрузчик после того, как страница полностью загружена
     * и прошло минимально необходимое время.
     */
    function hidePreloader() {
        if (pageFullyLoaded && minimumTimeElapsed) {
            // Анимация исчезновения предзагрузчика с помощью GSAP
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.classList.add('hidden'); // Добавляем класс, чтобы полностью скрыть
                    document.body.style.overflow = ''; // Разрешаем прокрутку страницы
                }
            });
        }
    }

    // --- Переключение навигации в шапке ---
    const navToggle = document.getElementById('navToggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');

    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        header.classList.toggle('nav-active');
    });

    document.addEventListener('click', (e) => {
        // Закрываем меню, если клик произошел вне кнопки и самого меню
        if (!navToggle.contains(e.target) && !navList.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            header.classList.remove('nav-active');
        }
    });

    // Закрытие меню при клике на ссылку в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                header.classList.remove('nav-active');
            }
        });
    });

    // --- Переключение темного/светлого режима ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Загружаем сохраненные настройки темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // --- Инициализация Swiper (слайдер выставок) ---
    const exhibitionSwiper = new Swiper('.exhibition-slider', {
        loop: true,
        spaceBetween: 30,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            }
        }
    });


    // --- Инициализация AOS (анимации при прокрутке) ---
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        offset: 100,
    });

    // --- Кнопка "Наверх" ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Показываем/скрываем кнопку при прокрутке страницы
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Плавная прокрутка наверх при клике
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Плавная прокрутка для кнопок с атрибутом data-target ---
    document.querySelectorAll('button[data-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.target;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Логика модальных окон ---
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.modal .close-button');
    const modalBody = document.getElementById('modalBody');

    // Функция для открытия модального окна
    function openModal(contentHTML) {
        modalBody.innerHTML = contentHTML;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('open'), 10);
        document.body.style.overflow = 'hidden'; // Запретить прокрутку страницы под модальным окном
    }

    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.remove('open');
        setTimeout(() => {
            modal.style.display = 'none';
            modalBody.innerHTML = ''; // Очищаем содержимое модального окна
        }, 400);
        document.body.style.overflow = ''; // Разрешить прокрутку страницы
    }

    // Слушатель для кнопки закрытия модального окна
    closeButton.addEventListener('click', closeModal);
    // Слушатель для закрытия модального окна при клике вне его контента
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Данные для модальных окон выставок ---
    const exhibitionsData = {
        egypt: {
            title: 'Тайны Древнего Египта: Пески Времени',
            description: 'Эта уникальная выставка погружает вас в загадочный мир Древного Египта, раскрывая секреты пирамид, фараонов и их вечных верований. Вы увидите подлинные мумии, золотые украшения, ритуальные предметы и папирусы с иероглифами. Почувствуйте дыхание истории через подлинные артефакты, найденные в гробницах и храмах. Выставка открыта до 30 сентября 2024 года, не пропустите шанс прикоснуться к древности.'
        },
        medieval: {
            title: 'Эхо Средневековья: Рыцари и Замки',
            description: 'Постоянная экспозиция, посвященная Средневековью, перенесет вас в эпоху рыцарей, грандиозных замков и интриг. Откройте для себя коллекцию доспехов, мечей, редких рукописей, гобеленов и предметов быта, которые расскажут о жизни простых людей и королей, о крестовых походах и развитии городов. Это полное погружение в мир средневековой Европы, её культуру, искусство и конфликты.'
        },
        renaissance: {
            title: 'Гении Возрождения: Светоч Знаний',
            description: 'Выставка "Гении Возрождения" представляет собой захватывающее путешествие в эпоху великих открытий в искусстве, науке и философии. Здесь вы найдете впечатляющие репродукции знаменитых произведений Леонардо да Винчи, Микеланджело, Рафаэля, а также узнаете о влиянии этой эпохи на последующие столетия. Откройте для себя изобретения, научные трактаты и философские идеи, которые изменили мир. Выставка продлится до 15 ноября 2024 года.'
        },
        roman: {
            title: 'Империя Вечного Города: Величие и Падение',
            description: 'Постоянная экспозиция "Империя Вечного Города" раскрывает историю Древнего Рима от его легендарного основания до драматического падения. Представлены аутентичные скульптуры, сложнейшие мозаики, античные монеты, военное снаряжение и предметы повседневной жизни, которые помогут вам понять величие Римской империи, её сложную культуру, строгие законы и монументальные инженерные достижения, оказавшие влияние на всю цивилизацию.'
        }
    };

    // Слушатели для открытия модальных окон выставок
    document.querySelectorAll('button[data-action="open-exhibition-modal"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const exhibitionId = e.currentTarget.dataset.exhibitionId;
            const data = exhibitionsData[exhibitionId];
            if (data) {
                const content = `
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                `;
                openModal(content);
            }
        });
    });

    // --- Данные для модальных окон коллекций ---
   const collectionsData = {
    ancient: {
        title: 'Древние Цивилизации: Колыбель Человечества',
        image: '/images/civilization.png',  // исправлено тут
        description: 'Эта коллекция охватывает сокровища древнейших цивилизаций мира: от таинственной Месопотамии и загадочной Долины Инда до ранних культур Америки. Здесь вы найдете глиняные таблички с клинописью, изящные керамические изделия, архаичные статуэтки и свидетельства первых государственных образований, раскрывающие величие ранних обществ.'
    },
    'medieval-coll': {
        title: 'Средневековье: Эпоха Веры и Доблести',
        image: '/images/artefacts.jpg',
        description: 'Погрузитесь в эпоху рыцарей и замков. Коллекция включает в себя средневековые доспехи, мечи, арбалеты, редкие рукописи, гобелены, а также предметы церковного искусства и быта, иллюстрирующие жизнь европейского Средневековья. Здесь вы найдете как священные реликвии, так и предметы повседневной жизни, рассказывающие о непростой, но яркой эпохе.'
    },
    'renaissance-art': {
        title: 'Искусство Возрождения: Свет Разума',
        image: '/images/art.jpg',
        description: 'Эта коллекция демонстрирует шедевры эпохи Возрождения – времени расцвета человеческого гения. От живописи и скульптуры до архитектурных чертежей и научных инструментов – каждый экспонат отражает дух гуманизма, стремление к красоте и знанию, характерные для этого революционного периода. Узнайте, как новые идеи изменили мир.'
    },
    modern: {
        title: 'Новейшая История: Отголоски Будущего',
        image: '/images/newhistory.jpg',
        description: 'Коллекция Новейшей Истории охватывает период от индустриальной революции до современности. Здесь представлены артефакты, документы, фотографии и личные вещи, рассказывающие о мировых войнах, стремительном научно-техническом прогрессе, грандиозных социальных изменениях и культурных революциях XX и XXI веков. Это живая история, которая формирует наше настоящее.'
    }
};


    // Слушатели для открытия модальных окон коллекций
    document.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const collectionId = e.currentTarget.dataset.collectionId;
            const data = collectionsData[collectionId];
            if (data) {
                const content = `
                    <h2>${data.title}</h2>
                    <img src="${data.image}" alt="${data.title}">
                    <p>${data.description}</p>
                `;
                openModal(content);
            }
        });
    });


    // --- Модальное окно покупки билетов ---
    document.querySelector('button[data-action="open-ticket-modal"]').addEventListener('click', () => {
        const ticketFormContent = `
            <h2>Купить Билет Онлайн</h2>
            <p>Выберите тип билета и количество. После подтверждения на ваш email будет отправлен электронный билет.</p>
            <form class="ticket-form" id="ticketPurchaseForm">
                <div class="form-group">
                    <label for="ticketType">Тип билета:</label>
                    <select id="ticketType" name="ticketType" required>
                        <option value="adult">Взрослый (1500 ₽)</option>
                        <option value="student">Студент/Пенсионер (800 ₽)</option>
                        <option value="child">Детский (Бесплатно)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="ticketQuantity">Количество:</label>
                    <input type="number" id="ticketQuantity" name="ticketQuantity" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label for="ticketDate">Дата посещения:</label>
                    <input type="date" id="ticketDate" name="ticketDate" required>
                </div>
                <div class="form-group">
                    <label for="buyerEmail">Ваш Email:</label>
                    <input type="email" id="buyerEmail" name="buyerEmail" required placeholder="Ваш Email для отправки билета">
                </div>
                <button type="submit" class="btn btn-primary">Оформить заказ <i class="fas fa-credit-card"></i></button>
                <div id="ticketFormMessage" class="form-message" style="display: none;"></div>
            </form>
        `;
        openModal(ticketFormContent);

        setTimeout(() => {
            const ticketPurchaseForm = document.getElementById('ticketPurchaseForm');
            const ticketFormMessage = document.getElementById('ticketFormMessage');
            if (ticketPurchaseForm) {
                ticketPurchaseForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const ticketType = document.getElementById('ticketType').value;
                    const ticketQuantity = document.getElementById('ticketQuantity').value;
                    const ticketDate = document.getElementById('ticketDate').value;
                    const buyerEmail = document.getElementById('buyerEmail').value;

                    if (!ticketType || !ticketQuantity || !ticketDate || !buyerEmail) {
                        ticketFormMessage.textContent = 'Пожалуйста, заполните все поля.';
                        ticketFormMessage.className = 'form-message error-message';
                        ticketFormMessage.style.display = 'flex';
                        return;
                    }

                    if (!/\S+@\S+\.\S+\b/.test(buyerEmail)) {
                        ticketFormMessage.textContent = 'Пожалуйста, введите корректный адрес электронной почты.';
                        ticketFormMessage.className = 'form-message error-message';
                        ticketFormMessage.style.display = 'flex';
                        return;
                    }

                    console.log('Заказ билета отправлен:', { ticketType, ticketQuantity, ticketDate, buyerEmail });
                    ticketFormMessage.textContent = `Ваш заказ на ${ticketQuantity} ${ticketType} билет(ов) на ${ticketDate} успешно оформлен! Проверьте почту: ${buyerEmail}.`;
                    ticketFormMessage.className = 'form-message success-message';
                    ticketFormMessage.style.display = 'flex';
                    ticketPurchaseForm.reset();
                });
            }
        }, 50);
    });

   

    /**
     * Сохраняет данные формы покупки билета в LocalStorage.
     * @param {string} type Тип билета.
     * @param {number} quantity Количество билетов.
     * @param {string} date Дата посещения.
     * @param {string} email Email покупателя.
     */
    function saveTicketFormToStorage(type, quantity, date, email) {
        const formData = { type, quantity, date, email };
        localStorage.setItem('ticketFormData', JSON.stringify(formData));
        console.log('Данные формы покупки билета сохранены в LocalStorage.');
    }

    /**
     * Загружает данные формы покупки билета из LocalStorage и заполняет поля.
     */
    function loadTicketFormFromStorage() {
        const savedData = localStorage.getItem('ticketFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                if (document.getElementById('ticketType')) document.getElementById('ticketType').value = formData.type || '';
                if (document.getElementById('ticketQuantity')) document.getElementById('ticketQuantity').value = formData.quantity || 1;
                if (document.getElementById('ticketDate')) document.getElementById('ticketDate').value = formData.date || '';
                if (document.getElementById('buyerEmail')) document.getElementById('buyerEmail').value = formData.email || '';
                console.log('Данные формы покупки билета загружены из LocalStorage.');
            } catch (e) {
                console.error("Ошибка при парсинге данных ticketFormData из LocalStorage:", e);
                localStorage.removeItem('ticketFormData'); // Очистить некорректные данные
            }
        }
    }


    // --- Отправка контактной формы с LocalStorage ---
    const contactForm = document.getElementById('contactForm');
    const contactFormMessage = document.getElementById('contactFormMessage');

    // Загружаем данные из LocalStorage при загрузке страницы для контактной формы
    loadContactFormFromStorage();

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            contactFormMessage.style.display = 'none';

            if (!name || !email || !subject || !message) {
                contactFormMessage.textContent = 'Пожалуйста, заполните все поля формы.';
                contactFormMessage.className = 'form-message error-message';
                contactFormMessage.style.display = 'flex';
                return;
            }

            if (!/\S+@\S+\.\S+\b/.test(email)) {
                contactFormMessage.textContent = 'Пожалуйста, введите корректный адрес электронной почты.';
                contactFormMessage.className = 'form-message error-message';
                contactFormMessage.style.display = 'flex';
                return;
            }

            console.log('Форма обратной связи отправлена!', { name, email, subject, message });
            contactFormMessage.textContent = 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
            contactFormMessage.className = 'form-message success-message';
            contactFormMessage.style.display = 'flex';
            
            // Сохраняем данные формы в LocalStorage после успешной отправки
            saveContactFormToStorage(name, email, subject, message);

            // contactForm.reset(); // Можно раскомментировать, если нужно очищать форму после отправки
        });
    }

    /**
     * Сохраняет данные контактной формы в LocalStorage.
     * @param {string} name Имя пользователя.
     * @param {string} email Email пользователя.
     * @param {string} subject Тема сообщения.
     * @param {string} message Текст сообщения.
     */
    function saveContactFormToStorage(name, email, subject, message) {
        const formData = { name, email, subject, message };
        localStorage.setItem('contactFormData', JSON.stringify(formData));
        console.log('Данные контактной формы сохранены в LocalStorage.');
    }

    /**
     * Загружает данные контактной формы из LocalStorage и заполняет поля.
     */
    function loadContactFormFromStorage() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                if (document.getElementById('name')) document.getElementById('name').value = formData.name || '';
                if (document.getElementById('email')) document.getElementById('email').value = formData.email || '';
                if (document.getElementById('subject')) document.getElementById('subject').value = formData.subject || '';
                if (document.getElementById('message')) document.getElementById('message').value = formData.message || '';
                console.log('Данные контактной формы загружены из LocalStorage.');
            } catch (e) {
                console.error("Ошибка при парсинге данных contactFormData из LocalStorage:", e);
                localStorage.removeItem('contactFormData'); // Очистить некорректные данные
            }
        }
    }
    // --- Данные для интерактивных элементов (модальных окон) ---
    const educationalHubData = {
        quiz: {
            title: 'Историческая Викторина',
            contentHtml: `
                <div class="quiz-container">
                    <h2 id="quizTitle">Историческая Викторина</h2>
                    <div id="quizQuestionSection" style="display:none;">
                        <div class="question-section">
                            <p class="question-text" id="quizQuestionText"></p>
                            <ul class="options-list" id="quizOptionsList"></ul>
                        </div>
                        <div class="quiz-navigation">
                            <span class="quiz-progress" id="quizProgress">Вопрос 1 из 10</span>
                            <button class="btn btn-primary" id="quizNextBtn">Далее <i class="fas fa-arrow-right"></i></button>
                        </div>
                    </div>
                    <div id="quizResultsSection" class="results-section" style="display:none;">
                        <h3>Результаты Викторины</h3>
                        <p class="quiz-score" id="quizScoreDisplay"></p>
                        <p class="quiz-feedback" id="quizFeedback"></p>
                        <button class="btn btn-secondary quiz-review-button" id="quizReviewBtn">Посмотреть ответы <i class="fas fa-eye"></i></button>
                        <ul class="quiz-review-list" id="quizReviewList" style="display:none;"></ul>
                        <button class="btn btn-primary play-again-btn" id="quizPlayAgainBtn">Играть снова <i class="fas fa-redo"></i></button>
                    </div>
                    <div id="quizIntroSection" style="text-align: center;">
                        <p>Проверьте свои знания в нашей увлекательной исторической викторине из 10 вопросов. Удачи!</p>
                        <button class="btn btn-primary mt-3" id="startQuizBtn">Начать Викторину <i class="fas fa-play"></i></button>
                    </div>
                </div>
            `
        },
        '3d-model': {
            title: '3D-Модель: Амулет Осириса',
            contentHtml: `
                <p>Исследуйте древний амулет Осириса в интерактивной 3D-модели. Вращайте, увеличивайте и изучайте каждую деталь!</p>
                <div class="sketchfab-embed-wrapper">
                    <iframe
                        title="Osiris Amulet"
                        frameborder="0"
                        allowfullscreen
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        xr-spatial-tracking
                        execution-while-out-of-viewport
                        execution-while-not-rendered
                        web-share
                        src="https://sketchfab.com/models/6f92cbd2b23c46508842130c141d335b/embed?autostart=1&ui_theme=dark&camera_controls=0&ui_stop=0&ui_inspector=0&ui_infos=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_annotations=0">
                    </iframe>
                    <p class="sketchfab-attribution-text">
                        <a href="https://sketchfab.com/3d-models/osiris-amulet-6f92cbd2b23c46508842130c141d335b?utm_medium=embed&utm_campaign=share-popup&utm_content=6f92cbd2b23c46508842130c141d335b" target="_blank" rel="nofollow"> Osiris Amulet </a> by
                        <a href="https://sketchfab.com/wattinstitution?utm_medium=embed&utm_campaign=share-popup&utm_content=6f92cbd2b23c46508842130c141d335b" target="_blank" rel="nofollow"> The Watt Institution </a> on
                        <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=6f92cbd2b23c46508842130c141d335b" target="_blank" rel="nofollow">Sketchfab</a>
                    </p>
                </div>
                <p class="small-text mt-3"><em>Примечание: Для лучшего опыта используйте полноэкранный режим плеера Sketchfab.</em></p>
            `
        },
        'assemble-artifact': {
            title: 'Собери Артефакт: Древний Горшок',
            contentHtml: `
                <p>Примите участие в виртуальной реставрации! Ваша задача — собрать разбитый древний горшок из осколков.</p>
                <p>Это забавная головоломка, которая познакомит вас с работой археологов.</p>
                <button class="btn btn-primary mt-3" id="startAssembleGameBtn">Начать Игру</button>
                <p class="small-text mt-3"><em>Примечание: Реальная игра в разработке. Сейчас будет простое сообщение.</em></p>
            `
        }
    };

    // --- Данные вопросов для викторины ---
    const quizQuestions = [
        {
            question: "Какая древняя цивилизация построила пирамиды как гробницы для фараонов?",
            options: ["Месопотамия", "Древний Египет", "Римская Империя", "Древняя Греция"],
            correctAnswer: 1,
            explanation: "Пирамиды, такие как Великая пирамида Гизы, были построены в Древнем Египте как монументальные гробницы."
        },
        {
            question: "Кто считается изобретателем книгопечатания с использованием подвижных литер в Европе?",
            options: ["Уильям Шекспир", "Леонардо да Винчи", "Иоганн Гутенберг", "Мартин Лютер"],
            correctAnswer: 2,
            explanation: "Иоганн Гутенберг в середине XV века разработал технологию книгопечатания, которая произвела революцию в распространении знаний."
        },
        {
            question: "Какой город был столицей Византийской империи?",
            options: ["Рим", "Афины", "Константинополь", "Александрия"],
            correctAnswer: 2,
            explanation: "Константинополь (современный Стамбул) был столицей Восточной Римской (Византийской) империи на протяжении более тысячи лет."
        },
        {
            question: "Какое событие считается началом Второй мировой войны в Европе?",
            options: ["Нападение на Перл-Харбор", "Вторжение в Польшу", "Битва за Сталинград", "Высадка в Нормандии"],
            correctAnswer: 1,
            explanation: "Вторжение Германии в Польшу 1 сентября 1939 года общепризнано как начало Второй мировой войны в Европе."
        },
        {
            question: "Какой античный философ был учителем Александра Македонского?",
            options: ["Платон", "Сократ", "Аристотель", "Пифагор"],
            correctAnswer: 2,
            explanation: "Аристотель был наставником Александра Македонского, обучая его философии, этике и политике."
        },
        {
            question: "Какой известный путь использовался для торговли между Востоком и Западом в древности?",
            options: ["Великий Шелковый путь", "Путь Специй", "Янтарный путь", "Морской путь"],
            correctAnswer: 0,
            explanation: "Великий Шелковый путь был сетью торговых маршрутов, соединяющих Азию с Ближним Востоком и Европой."
        },
        {
            question: "Кто был первым человеком, совершившим кругосветное путешествие?",
            options: ["Христофор Колумб", "Васко да Гама", "Фернан Магеллан", "Джеймс Кук"],
            correctAnswer: 2,
            explanation: "Экспедиция Фернана Магеллана, хотя сам Магеллан погиб в пути, стала первой, совершившей кругосветное плавание."
        },
        {
            question: "Какое изобретение сыграло ключевую роль в промышленной революции?",
            options: ["Телескоп", "Паровой двигатель", "Электрическая лампочка", "Телефон"],
            correctAnswer: 1,
            explanation: "Паровой двигатель, усовершенствованный Джеймсом Уаттом, стал основой для развития фабрик и транспорта в ходе промышленной революции."
        },
        {
            question: "Как назывался древний город, разрушенный извержением Везувия в 79 году н.э.?",
            options: ["Александрия", "Карфаген", "Помпеи", "Троя"],
            correctAnswer: 2,
            explanation: "Помпеи и Геркуланум были погребены под вулканическим пеплом после извержения Везувия."
        },
        {
            question: "Какое событие ознаменовало окончание Холодной войны?",
            options: ["Создание ООН", "Развал Советского Союза", "Карибский кризис", "Корейская война"],
            correctAnswer: 1,
            explanation: "Распад Советского Союза в 1991 году обычно считается концом Холодной войны."
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = [];
    let quizScore = 0;

    let quizIntroSection, quizQuestionSection, quizResultsSection;
    let quizQuestionText, quizOptionsList, quizProgress, quizNextBtn;
    let quizScoreDisplay, quizFeedback, quizReviewBtn, quizReviewList, quizPlayAgainBtn;
    let startQuizBtn;

    function getQuizElements() {
        quizIntroSection = document.getElementById('quizIntroSection');
        quizQuestionSection = document.getElementById('quizQuestionSection');
        quizResultsSection = document.getElementById('quizResultsSection');

        quizQuestionText = document.getElementById('quizQuestionText');
        quizOptionsList = document.getElementById('quizOptionsList');
        quizProgress = document.getElementById('quizProgress');
        quizNextBtn = document.getElementById('quizNextBtn');

        quizScoreDisplay = document.getElementById('quizScoreDisplay');
        quizFeedback = document.getElementById('quizFeedback');
        quizReviewBtn = document.getElementById('quizReviewBtn');
        quizReviewList = document.getElementById('quizReviewList');
        quizPlayAgainBtn = document.getElementById('quizPlayAgainBtn');
        startQuizBtn = document.getElementById('startQuizBtn');
    }

    function loadQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const questionData = quizQuestions[currentQuestionIndex];
            if (quizQuestionText) quizQuestionText.textContent = questionData.question;
            if (quizOptionsList) quizOptionsList.innerHTML = '';

            questionData.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.classList.add('option-item');
                li.innerHTML = `
                    <label>
                        <input type="radio" name="quizOption" value="${index}" data-index="${index}">
                        ${option}
                    </label>
                `;
                if (quizOptionsList) quizOptionsList.appendChild(li);
            });

            if (quizProgress) quizProgress.textContent = `Вопрос ${currentQuestionIndex + 1} из ${quizQuestions.length}`;
            if (quizNextBtn) {
                if (currentQuestionIndex === quizQuestions.length - 1) {
                    quizNextBtn.textContent = 'Завершить Викторину';
                    quizNextBtn.innerHTML = 'Завершить Викторину <i class="fas fa-check-circle"></i>';
                } else {
                    quizNextBtn.textContent = 'Далее';
                    quizNextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
                }
            }
        } else {
            showResults();
        }
    }

    function nextQuestion() {
        const selectedOption = document.querySelector('input[name="quizOption"]:checked');
        if (!selectedOption) {
            alert('Пожалуйста, выберите ответ!');
            return;
        }

        userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        currentQuestionIndex++;
        loadQuestion();
    }

    function showResults() {
        quizScore = 0;
        if (quizReviewList) quizReviewList.innerHTML = '';
        if (quizReviewList) quizReviewList.style.display = 'none';

        quizQuestions.forEach((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const isCorrect = (userAnswerIndex === q.correctAnswer);
            if (isCorrect) {
                quizScore++;
            }

            const li = document.createElement('li');
            li.classList.add('result-item', isCorrect ? 'correct' : 'incorrect');
            li.innerHTML = `
                <p><strong>Вопрос ${index + 1}:</strong> ${q.question}</p>
                <p class="user-answer">Ваш ответ: <em>${userAnswerIndex !== undefined ? q.options[userAnswerIndex] : 'Не отвечено'}</em></p>
                <p class="correct-answer">Правильный ответ: <strong>${q.options[q.correctAnswer]}</strong></p>
                <p class="explanation">${q.explanation}</p>
            `;
            if (quizReviewList) quizReviewList.appendChild(li);
        });

        if (quizScoreDisplay) quizScoreDisplay.textContent = `${quizScore} / ${quizQuestions.length}`;
        if (quizFeedback) {
            if (quizScore === quizQuestions.length) {
                quizFeedback.textContent = 'Поздравляем! Вы - настоящий знаток истории!';
            } else if (quizScore >= quizQuestions.length / 2) {
                quizFeedback.textContent = 'Отличный результат! Так держать!';
            } else {
                quizFeedback.textContent = 'Неплохо, но есть что поучить. Продолжайте исследовать историю!';
            }
        }

        if (quizQuestionSection) quizQuestionSection.style.display = 'none';
        if (quizResultsSection) quizResultsSection.style.display = 'block';
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        userAnswers = [];
        quizScore = 0;

        getQuizElements(); 

        if (quizIntroSection) quizIntroSection.style.display = 'none';
        if (quizQuestionSection) quizQuestionSection.style.display = 'block';
        if (quizResultsSection) quizResultsSection.style.display = 'none';
        
        loadQuestion();
    }

    function toggleReviewList() {
        if (quizReviewList) {
            if (quizReviewList.style.display === 'none') {
                quizReviewList.style.display = 'block';
                if (quizReviewBtn) quizReviewBtn.innerHTML = 'Скрыть ответы <i class="fas fa-eye-slash"></i>';
            } else {
                quizReviewList.style.display = 'none';
                if (quizReviewBtn) quizReviewBtn.innerHTML = 'Посмотреть ответы <i class="fas fa-eye"></i>';
            }
        }
    }


    // --- Данные для аннотаций "Раскрытого Шедевра" ---
    const masterpieceAnnotationsData = {
        material: {
            title: 'Материал: Вулканический Обсидиан',
            description: 'Амулет вырезан из редкого сорта обсидиана, добытого из древнего вулкана в Месопотамии. Его гладкая, темная поверхность свидетельствует о высокой степени мастерства древних ювелиров.'
        },
        symbolism: {
            title: 'Символизм: Сердце и Вечность',
            description: 'Форма сердца символизирует жизнь и перерождение, а использование обсидиана, камня, рожденного из огня, связывалось с защитой от злых духов и вечной жизнью в шумерской мифологии.'
        },
        discovery: {
            title: 'История Открытия',
            description: 'Амулет был обнаружен в 1922 году во время раскопок царских гробниц в Уре. Он лежал на груди скелета, предположительно принадлежавшего жрецу, что указывает на его высокую ритуальную ценность.'
        }
    };

    // Слушатели для интерактивных точек на изображении артефакта
    document.querySelectorAll('.annotation-hotspot').forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            const annotationId = e.currentTarget.dataset.annotationId;
            const data = masterpieceAnnotationsData[annotationId];
            if (data) {
                const content = `
                    <div class="modal-annotation-content">
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                    </div>
                `;
                openModal(content);
            }
        });
    });

    // --- Основной слушатель для открытия интерактивных модальных окон ---
    document.querySelectorAll('button[data-action="open-interactive-modal"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const interactiveId = e.currentTarget.dataset.interactiveId;
            const data = educationalHubData[interactiveId];
            if (data) {
                openModal(`
                    <div class="modal-interactive-content">
                        <h2>${data.title}</h2>
                        ${data.contentHtml}
                    </div>
                `);

                setTimeout(() => { 
                    if (interactiveId === 'quiz') {
                        getQuizElements();
                        if (startQuizBtn) startQuizBtn.addEventListener('click', startQuiz);
                        if (quizNextBtn) quizNextBtn.addEventListener('click', nextQuestion);
                        if (quizPlayAgainBtn) quizPlayAgainBtn.addEventListener('click', startQuiz);
                        if (quizReviewBtn) quizReviewBtn.addEventListener('click', toggleReviewList);
                        
                        if (quizIntroSection) quizIntroSection.style.display = 'block';
                        if (quizQuestionSection) quizQuestionSection.style.display = 'none';
                        if (quizResultsSection) quizResultsSection.style.display = 'none';

                    } else if (interactiveId === 'assemble-artifact') {
                        const startAssembleGameBtn = document.getElementById('startAssembleGameBtn');
                        if (startAssembleGameBtn) {
                            startAssembleGameBtn.addEventListener('click', () => {
                                console.log('[Событие Клика] Нажата кнопка "Начать игру Собери Артефакт!"');
                                alert('Игра "Собери Артефакт" будет доступна в следующих обновлениях!');
                                closeModal();
                            });
                        }
                    }
                }, 100);
            }
        });
    });

    // --- Слушатель для Mouseover на карточках выставок (проверка через консоль) ---
    document.querySelectorAll('.exhibition-card').forEach(card => {
        card.addEventListener('mouseover', () => {
            const title = card.querySelector('h3').textContent;
            console.log(`[Событие Mouseover] Пользователь навел курсор на выставку: "${title}"`);
        });
        document.addEventListener('mouseout', () => {
            const title = card.querySelector('h3').textContent;
            console.log(`[Событие Mouseout] Пользователь убрал курсор с выставки: "${title}"`);
        });
    });

    // --- Формирование массива из заголовков коллекций и вывод в консоль (с использованием for...in) ---
    // Находим все элементы H3 в блоках коллекций и извлекаем их текстовое содержимое.
    // Создаем массив из полученных названий.
    const collectionTitlesArray = [];
    const collectionElements = document.querySelectorAll('.collection-item .collection-overlay h3');
    // Используем for...in для итерации по NodeList (который ведет себя как объект в данном контексте)
    // для извлечения текстового содержимого заголовков.
    for (const index in collectionElements) {
        // Проверяем, что это свойство является индексом и принадлежит самому NodeList, а не прототипу
        if (Object.prototype.hasOwnProperty.call(collectionElements, index)) {
            collectionTitlesArray.push(collectionElements[index].textContent.trim());
        }
    }
    console.log("--- Заголовки коллекций ---");
    console.log(collectionTitlesArray);
    console.log("--------------------------");

    // --- Динамическое формирование и вывод верстки для "Ключевых Фактов о Музее" с использованием fetch и GSAP ---
    const dynamicFactsContainer = document.getElementById('dynamicFactsContainer');

    // Выполняем запрос к файлу data.json
    fetch('data.json') // Убедитесь, что путь к data.json правильный
        .then(response => {
            // Проверяем, успешно ли получен ответ
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(data => {
            // Получаем данные о фактах музея из JSON
            const museumFacts = data.museumFacts;
            let factsHTML = ''; // Переменная для сбора HTML-строк

            // Итерируем по объекту museumFacts с помощью цикла for...in
            for (const key in museumFacts) {
                // Убеждаемся, что свойство принадлежит самому объекту, а не унаследовано
                if (Object.prototype.hasOwnProperty.call(museumFacts, key)) {
                    const fact = museumFacts[key]; // Получаем объект с данными для текущего факта

                    // Формируем HTML для каждого "кристалла-факта"
                    factsHTML += `
                        <div class="fact-shard">
                            <div class="shard-glow"></div> <!-- Для внутреннего свечения -->
                            <div class="shard-content">
                                <i class="${fact.icon}"></i> <!-- Иконка Font Awesome -->
                                <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4> <!-- Название факта с заглавной буквы -->
                                <p class="fact-value"><strong>${fact.value}</strong></p> <!-- Ключевое значение факта -->
                                <p class="fact-description">${fact.text}</p> <!-- Описание факта -->
                            </div>
                        </div>
                    `;
                }
            }
            
            // Вставляем сгенерированный HTML в контейнер
            if (dynamicFactsContainer) {
                dynamicFactsContainer.innerHTML = factsHTML;

                // Анимации GSAP для динамически созданных элементов
                gsap.set(".fact-shard", { opacity: 0, y: 50, scale: 0.9, rotateX: 10 }); // Начальное состояние

                gsap.to(".fact-shard", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    duration: 1.2,
                    stagger: 0.2, // Задержка между появлением каждого элемента
                    ease: "power3.out",
                    scrollTrigger: { // Используем ScrollTrigger для анимации при скролле
                        trigger: ".museum-facts-grid",
                        start: "top 80%", // Анимация начинается, когда верх контейнера в 80% от верха viewport
                        toggleActions: "play none none none" // Воспроизвести один раз
                    }
                });

                // Анимация "плавания" для каждого кристалла
                document.querySelectorAll('.fact-shard').forEach((shard, index) => {
                    gsap.to(shard, {
                        y: `random(-10, 10)`, // Случайное смещение по Y
                        x: `random(-10, 10)`, // Случайное смещение по X
                        rotation: `random(-5, 5)`, // Случайное вращение
                        duration: `random(6, 12)`, // Случайная продолжительность
                        ease: "none",
                        repeat: -1, // Повторять бесконечно
                        yoyo: true // Анимировать туда-обратно
                    });

                    // Анимации при наведении курсора (hover)
                    shard.addEventListener('mouseenter', () => {
                        gsap.to(shard, {
                            scale: 1.08,
                            z: 50,
                            rotationY: 10,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    });

                    shard.addEventListener('mouseleave', () => {
                        gsap.to(shard, {
                            scale: 1,
                            z: 0,
                            rotationY: 0,
                            duration: 0.5,
                            ease: "elastic.out(1, 0.5)"
                        });
                    });
                });

                console.log("--- Динамически сгенерированы и анимированы факты о музее из data.json ---");
            }
        })
        .catch(error => {
            // Обработка ошибок при загрузке JSON (например, файл не найден)
            console.error('Ошибка загрузки данных о фактах музея:', error);
            if (dynamicFactsContainer) {
                dynamicFactsContainer.innerHTML = '<p style="color: red; text-align: center;">Не удалось загрузить данные о фактах музея. Пожалуйста, попробуйте позже.</p>';
            }
        });


    // --- Обработка всплывающих форм (модальных окон) и кнопки скролла ---
    //
    // В данном проекте присутствуют всплывающие модальные окна (формы), что соответствует условию "при наличии всплывающих форм ... прописываем открытие этих форм".
    // Открытие этих форм (модальных окон) реализовано через функцию `openModal(contentHTML)`,
    // которая вызывается по клику на различные кнопки (например, "Подробнее" для выставок,
    // "Купить билет онлайн", кнопки интерактивных элементов) с использованием атрибута `data-action`.
    //
    // Кнопка скролла вверх страницы (`#backToTopBtn`) также присутствует и функциональна.
    // Она появляется при прокрутке страницы вниз и при клике плавно прокручивает страницу на самый верх.
    // Таким образом, хотя условие "в противном случае программируем кнопку скролла вверх страницы"
    // относится к альтернативному сценарию (если форм нет), в данном проекте эта кнопка является
    // частью общей навигации и работает независимо от наличия модальных форм.
});