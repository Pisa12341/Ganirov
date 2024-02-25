document.addEventListener("DOMContentLoaded", function() {
    // Массив с текстом для создания div
    var texts = [
        "Пример текста 1",
        "Пример текста 2",
        "Пример текста 3",
        "Пример текста 4",
        "Пример текста 5"
    ];

    // Находим контейнер, куда будем добавлять div
    var container = document.querySelector(".container");

    // Определяем высоту экрана
    var screenHeight = window.innerHeight;

    // Переменная для отслеживания начальной точки касания
    var startY = 0;

    // Переменная для хранения начальной позиции скролла
    var initialScrollPosition = 0;

    // Переменная для хранения времени начала движения
    var startTime = 0;

    // Переменная для хранения времени окончания движения
    var endTime = 0;

    // Флаг для отслеживания прокрутки
    var isScrolling = false;

    // Слушаем событие touchstart
    container.addEventListener("touchstart", function(event) {
        if (!isScrolling) {
            startY = event.touches[0].clientY;
            initialScrollPosition = window.scrollY; // Сохраняем начальную позицию скролла
            startTime = new Date().getTime(); // Сохраняем время начала движения
        }
    });

    // Слушаем событие touchend
    container.addEventListener("touchend", function(event) {
        if (!isScrolling) {
            var endY = event.changedTouches[0].clientY;
            var scrollDistance = startY - endY;
            endTime = new Date().getTime(); // Сохраняем время окончания движения

            // Если пользователь промотал более чем на 40%
            if (Math.abs(scrollDistance) > screenHeight * 0.4) {
                // Если пользователь прокрутил вниз
                if (scrollDistance > 0) {
                    // Вычисляем скорректированную высоту экрана
                    var adjustedHeight = screenHeight - Math.abs(scrollDistance);

                    // Прокручиваем до следующего div
                    window.scrollBy(0, adjustedHeight);
                } else {
                    // Если пользователь прокрутил вверх более чем на 40%, привязываемся к верхнему div
                    var currentScroll = window.scrollY;
                    var index = Math.floor(currentScroll / screenHeight);
                    window.scrollTo(0, index * screenHeight);
                }
            } else {
                // Если пользователь прокрутил менее чем на 40%, оставляемся на текущем div
                window.scrollTo(0, initialScrollPosition);
            }

            // Проверяем скорость движения и прокручиваем на следующий div, если скорость достаточно высока
            var swipeDuration = endTime - startTime;
            var swipeSpeed = Math.abs(scrollDistance) / swipeDuration; // Скорость в пикселях в миллисекунду

            if (swipeSpeed > 0.5) {
                // Если скорость выше порогового значения, прокручиваем на следующий div
                if (scrollDistance > 0) {
                    window.scrollBy(0, screenHeight); // Прокручиваем на следующий div
                    isScrolling = true; // Устанавливаем флаг прокрутки
                    setTimeout(function() {
                        isScrolling = false; // Сбрасываем флаг прокрутки через 500мс
                    }, 500);
                }
            }
        }
    });

    // Проходимся по массиву и создаем div с текстом
    texts.forEach(function(text) {
        var div = document.createElement("div");
        div.textContent = text;
        div.style.height = screenHeight + "px"; // Устанавливаем высоту div
        container.appendChild(div);
    });
});
